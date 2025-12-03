---
layout: post
title: "how i replaced 100 lines of tricky jwt/jwks code with 1 line."
description: "npm i identifiabl — deploying gatewaystack's first layer into production"
---

i have redeveloped the same 100-line jwt verification flow for every mcp server i have built. while somewhat boilerplate, the cognitive load of sorting out JWKS fetching, signature verification, scope mapping, etc. for every app is draining.  

these aren't issues with my app. not a framework issue from something like firebase or swift. this is a common backend problem pervasive for every mcp server the moment you try to build something more than a prototype (e.g., multi-tenant or regulated).

so i started writing a package to standardize this process for my new apps. and i realized that i wasn't building an app anymore. i was reverse-engineering the missing trust and governance layer for AI model calls.

> **tl;dr:** here is how I replaced **~100 lines of custom jwt/jose logic** in my mcp server with a single `identifiablVerifier()` call. first production deployment of gatewaystack's identity layer. zero changes to tool definitions, scopes, or firebase integration.

**this post is for you if:**
- you're building an mcp server with oauth
- you have custom jwt verification code you'd rather not write or maintain
- you need to map oauth subjects to your app's user ids
- you're planning to add rate limiting, audit trails, or policy enforcement later

**time to read:** 12 minutes  
**time to migrate:** ~30 minutes

### origins of gatewaystack

identity is fundamental to ai apps but it's just the start. so I started writing, designing, and prototyping what eventually became [gatewaystack](https://gatewaystack.com): a modular, open-source agentic control plane that adds identity, safety, validation, routing, limits, and auditability to AI calls. gatewaystack is a user-scoped trust and governance gateway for ai apps. it standardizes the layer that should exist between a user clicking “send” and the request hitting the model api.

last night, one piece of that vision went live.

### identifiabl: gatewaystack's first production module

every llm integration has the same challenge...

three parties are involved — the user, the llm, and your backend — but there is no shared identity between them. 

- chatgpt knows who the user is (via openai auth)
- your backend knows who the user is (via your app's auth e.g., firebase auth)
- but your mcp server has no simple way to carry the user’s cryptographic identity across the boundary

`identifiabl` makes it easy, repeatable, and secure to bridge that boundary... providing shared identity across the entire interaction.

it binds user identity to AI-originated requests and exposes a normalized gatewaystack request context for other controls to plug into later (policy, limits, routing, audit, etc.).

**get started:** `npm i identifiabl`  
[→ github](https://github.com/davidcrowe/GatewayStack/tree/main/packages/identifiabl)  
[→ Docs](https://identifiabl.com)

#### Who needs this?

if you're building an mcp server that:
- accepts oauth tokens from chatgpt, claude, or another AI platform
- needs to verify user identity before calling your backend
- wants to enforce scopes/permissions on tool calls
- currently has 50-100 lines of custom jose/jwt logic

you should check out `identifiabl`. it handles all of it.

### how exactly did my mcp server code change?

after launching `identifiabl`, i immediately used it to replace my hand-rolled identity handling in the mcp server for my app inner. 

it was... easy. my mcp server used to contain ~100 lines of custom jose/jwt wiring to:

- fetch jwks
- verify signatures
- check issuer and audience
- normalize claims
- extract scopes
- map subjects
- forward identity downstream

`identifiabl` reduces all of this to a single call:

```ts
const result = await identifiablVerifier(accessToken)
```

everything else — your scopes, your uid mapping, your firebase plumbing — stays the same.

more specifically, the main changes i made to my mcp server can be bucketed into three areas:

#### 1. core auth helper: `verifyBearer`

**before: ~100 lines of hand-rolled jose**
```ts
async function verifyBearer(req: Request) {
  logAuthShape("verifyBearer", req);

  const auth = req.header("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    const err: any = new Error("NO_AUTH");
    err.status = 401;
    err.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw err;
  }

  const accessToken = auth.slice(7);

  const segments = accessToken.split(".");
  const header = segments[0] ? b64urlDecodeToJson(segments[0]) : undefined;
  console.log(
    "[auth:token] segments=%d header.alg=%s header.typ=%s",
    segments.length, header?.alg, header?.typ
  );

  if (segments.length !== 3) {
    const e: any = new Error(
      segments.length === 5
        ? "ACCESS_TOKEN_IS_ENCRYPTED_JWE"
        : "ACCESS_TOKEN_NOT_JWS"
    );
    e.status = 401;
    e.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw e;
  }

  const { createRemoteJWKSet, jwtVerify } = await import("jose");
  const JWKS = createRemoteJWKSet(new URL(JWKS_URI_FALLBACK));
  const issuerNoSlash = OAUTH_ISSUER.replace(/\/+$/, "");
  const issuerWithSlash = issuerNoSlash + "/";

  try {
    const { payload } = await jwtVerify(accessToken, JWKS, {
      issuer: [issuerNoSlash, issuerWithSlash],
      ...(OAUTH_AUDIENCE ? { audience: OAUTH_AUDIENCE } : {})
    });

    const { sub, aud, exp, iat } = payload as any;
    console.log("[auth:postVerify]", {
      sub,
      aud,
      exp,
      iat,
      now: Math.floor(Date.now() / 1000),
      hasScope: !!(payload as any).scope,
    });
    logTokenScopes("postVerify", payload);
    return payload;
  } catch (err: any) {
    console.error("[auth:jwtVerify:error]", {
      message: err?.message,
      name: err?.name,
      code: err?.code,
    });
    const e: any = new Error("JWT_VERIFY_FAILED");
    e.status = 401;
    e.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw e;
  }
}
```

**after: delegates to identifiablVerifier**
```ts
async function verifyBearer(req: Request) {
  logAuthShape("verifyBearer", req);

  const auth = req.header("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    const err: any = new Error("NO_AUTH");
    err.status = 401;
    err.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw err;
  }

  const accessToken = auth.slice(7);

  // Log shape early, same as before
  const segments = accessToken.split(".");
  const header = segments[0] ? b64urlDecodeToJson(segments[0]) : undefined;
  console.log(
    "[auth:token] segments=%d header.alg=%s header.typ=%s",
    segments.length, header?.alg, header?.typ
  );

  if (segments.length !== 3) {
    const e: any = new Error(
      segments.length === 5
        ? "ACCESS_TOKEN_IS_ENCRYPTED_JWE"
        : "ACCESS_TOKEN_NOT_JWS"
    );
    e.status = 401;
    e.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw e;
  }

  // Use identifiabl-core to verify + map identity
  const result = await identifiablVerifier(accessToken);

  if (!result.ok) {
    console.error("[auth:identifiabl:error]", {
      error: result.error,
      detail: result.detail,
    });
    const e: any = new Error("JWT_VERIFY_FAILED");
    e.status = 401;
    e.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw e;
  }

  const { identity, payload } = result;

  console.log("[auth:postVerify]", {
    sub: identity.sub,
    issuer: identity.issuer,
    tenantId: identity.tenantId,
    roles: identity.roles,
    scopes: identity.scopes,
    plan: identity.plan,
  });

  logTokenScopes("postVerify", payload as any);

  // keep the same return shape as before so callers don't change:
  return payload;
}
```

#### 2. scope verification: same interface, new foundation

**no api changes** — `verifyBearerAndScopes` still returns `{ uid, gatewaySig }`, but now it's built on `identifiabl`'s normalized identity layer instead of raw jose

```ts
async function verifyBearerAndScopes(req: Request, toolName: string) {
  const payload = await verifyBearer(req); // ⬅ now uses identifiablVerifier under the hood

  const sub = String(payload.sub || "");
  if (!sub) {
    const err: any = new Error("TOKEN_NO_SUB");
    err.status = 401;
    err.www = buildWwwAuthenticate(req) + ", error=\"invalid_token\"";
    throw err;
  }

  const email =
    typeof (payload as any).email === "string" ? (payload as any).email : undefined;

  const scopeStr =
    typeof (payload as any).scope === "string" ? (payload as any).scope : "";
  const permissions = Array.isArray((payload as any).permissions)
    ? ((payload as any).permissions as string[])
    : [];

  const scopes = Array.from(
    new Set([...scopeStr.split(" ").filter(Boolean), ...permissions])
  );

  const need = TOOL_SCOPES[toolName] || [];
  if (need.length) requireScopes(scopes, need);

  const uid = await subjectToUid(sub, email);
  const gatewaySig = signGatewayUid(uid);
  return { uid, gatewaySig };
}
```

#### 3. rest endpoint: same transformation

**before:**
```ts
// tools: POST only beyond this point
const auth = req.header("authorization") || "";
if (!auth.startsWith("Bearer ")) {
  res.setHeader("WWW-Authenticate", buildWwwAuthenticate(req) + ", error=\"invalid_token\"");
  res.status(401).json({ ok: false, error: { code: "NO_AUTH", message: "Missing Bearer token" }, requestId });
  return;
}
const accessToken = auth.slice(7);
const parts = accessToken.split(".");
if (parts.length !== 3) {
  res.setHeader(
    "WWW-Authenticate",
    buildWwwAuthenticate(req) + ", error=\"invalid_token\", error_description=\"Expecting JWS access token (3 parts)\""
  );
  res.status(401).json({ ok: false, error: { code: "INVALID_TOKEN", message: "Expecting JWT/JWS access token" }, requestId });
  return;
}

logTokenStructure("rest.verify", accessToken);
logJwtClaims("rest.claimsPreview", accessToken);

const { createRemoteJWKSet, jwtVerify } = await import("jose");
const JWKS = createRemoteJWKSet(new URL(JWKS_URI_FALLBACK));
const issuerNoSlash = OAUTH_ISSUER.replace(/\/+$/, "");
const issuerWithSlash = issuerNoSlash + "/";
const { payload } = await jwtVerify(accessToken, JWKS, {
  issuer: [issuerNoSlash, issuerWithSlash],
  ...(OAUTH_AUDIENCE ? { audience: OAUTH_AUDIENCE } : {})
});

// then: sub/scope extraction, TOOL_SCOPES check, subjectToUid, signGatewayUid, Firebase ID token, forwarding…
```

**after: delegates to identifiablVerifier**
```ts
// tools: POST only beyond this point
const auth = req.header("authorization") || "";
if (!auth.startsWith("Bearer ")) {
  res.setHeader("WWW-Authenticate", buildWwwAuthenticate(req) + ", error=\"invalid_token\"");
  res.status(401).json({ ok: false, error: { code: "NO_AUTH", message: "Missing Bearer token" }, requestId });
  console.warn("[rest] no Authorization header; sending WWW-Authenticate");
  return;
}
const accessToken = auth.slice(7);

const parts = accessToken.split(".");
if (parts.length !== 3) {
  res.setHeader(
    "WWW-Authenticate",
    buildWwwAuthenticate(req) + ", error=\"invalid_token\", error_description=\"Expecting JWS access token (3 parts)\""
  );
  console.warn("[rest] non-JWS token (parts=%d); prompting OAuth", parts.length);
  res.status(401).json({ ok: false, error: { code: "INVALID_TOKEN", message: "Expecting JWT/JWS access token" }, requestId });
  return;
}

logTokenStructure("rest.verify", accessToken);
logJwtClaims("rest.claimsPreview", accessToken);

// Use identifiabl-core instead of inline jose logic
const result = await identifiablVerifier(accessToken);

if (!result.ok) {
  console.error("[rest:jwtVerify:error]", {
    error: result.error,
    detail: result.detail,
  });
  res.setHeader(
    "WWW-Authenticate",
    buildWwwAuthenticate(req) + ", error=\"invalid_token\""
  );
  res.status(401).json({
    ok: false,
    error: {
      code: "JWT_VERIFY_FAILED",
      message: result.detail || result.error,
    },
    requestId,
  });
  return;
}

const { identity, payload } = result;

const sub = String(identity.sub || "");
if (!sub) {
  res.setHeader("WWW-Authenticate", buildWwwAuthenticate(req) + ", error=\"invalid_token\"");
  res.status(401).json({
    ok: false,
    error: { code: "TOKEN_NO_SUB", message: "Missing sub" },
    requestId,
  });
  return;
}

const scopeStr = typeof (payload as any).scope === "string" ? (payload as any).scope : "";
const scopeList = scopeStr.split(" ").filter(Boolean);
const permissions = Array.isArray((payload as any).permissions)
  ? ((payload as any).permissions as string[])
  : [];
const scopes = Array.from(new Set([...scopeList, ...permissions]));

// same TOOL_SCOPES, subjectToUid, signGatewayUid, Firebase mint, etc.
```

#### 4. what stayed the same (everything else)

- TOOL_SCOPES + REQUIRED_SCOPES
- subjectToUid(sub) → still mapping to auth0:${sub}
- signGatewayUid(uid) hmac scheme
- firebase admin init + getFirebaseIdTokenForUid custom token exchange
- tool schemas, titles, descriptions, and the entire inner widget plumbing 

### the real payload: a standardized request context primed for AI model governance

`identifiabl` doesn't just say "this jwt is valid."

it normalizes everything you care about into a **request context** that the rest of gatewaystack can plug into: identity, scopes, roles, tenant/plan, plus the derived `uid` and hmac signature you already use to call firebase functions.

in other words: one place that understands "who is this, what are they allowed to do, and how should downstream services trust this call?"

#### the gatewaystack request context

this is what the request context code looks like:

```typescript
type GatewayRequestContext = {
  // Who this request is "running as" inside your app
  uid: string;
  gatewaySig: string; // HMAC over uid + timestamp for your functions
  
  // Normalized identity from identifiabl
  identity: {
    sub: string;           // Raw subject from IdP (e.g. auth0|abc123)
    issuer: string;        // Cleaned issuer URL
    scopes: string[];      // Merged from `scope` + `permissions`
    roles: string[];       // Role/permission names
    tenantId?: string;     // Optional org/workspace
    plan?: string;         // Optional billing tier
  };
  
  // Raw JWT claims if you ever need to dig deeper
  claims: Record<string, unknown>;
  
  // Optional: what tool is being invoked
  tool?: {
    name: string;
    requiredScopes: string[];
  };
  
  // Optional: trace info for logging/audit
  trace?: {
    requestId: string;
    receivedAt: string; // ISO timestamp
    ip?: string;
    userAgent?: string;
  };
};
```

#### a concrete example

here's what a real `saveMemoryOrb` call looks like flowing through the system — chatgpt → inner mcp server → firebase:

```json
{
  "uid": "auth0:auth0|abc123",
  "gatewaySig": "auth0:auth0|abc123.1733190000.0b9c0f…",
  "identity": {
    "sub": "auth0|abc123",
    "issuer": "https://dev-e2r87v477lvku60t.us.auth0.com/",
    "scopes": [
      "openid",
      "profile",
      "email",
      "inner.dreams:read",
      "inner.memories:write"
    ],
    "roles": ["user"],
    "tenantId": "org_7Yk9pQ3",
    "plan": "free"
  },
  "claims": {
    "iss": "https://dev-e2r87v477lvku60t.us.auth0.com/",
    "sub": "auth0|abc123",
    "aud": "https://inner-api",
    "scope": "openid profile email inner.dreams:read",
    "permissions": ["inner.memories:write"],
    "email": "you@example.com",
    "exp": 1733193600,
    "iat": 1733186400
  },
  "tool": {
    "name": "saveMemoryOrb",
    "requiredScopes": ["inner.memories:write"]
  },
  "trace": {
    "requestId": "b5a76d7b-5f5a-4d7f-9d3b-1c6d5f2e3a91",
    "receivedAt": "2024-12-02T07:20:43.511Z"
  }
}
```

everything downstream becomes easier: validation, limits, audit trails, routing, policy, usage metering — because they all start with the same normalized identity and request metadata.

### try it yourself
i deployed `identifiabl` inside inner’s mcp server — and it worked exactly as intended. this is the first live, production instance of gatewaystack.

If you're running an mcp server with oauth, the migration is straightforward:

1. install: `npm i identifiabl`
2. replace your `jwtVerify()` logic with `createIdentifiablVerifier()`
3. update your auth helper to use the result
4. everything else stays the same

reach out if you hit any roadblocks - i would be happy to help you migrate.

### follow along
**next up:** `proxyabl` and `limitabl` - gatewaystack's routing and limiting layers — are under active development. follow along at [gatewaystack.com](https://gatewaystack.com) or [star the repo](https://github.com/davidcrowe/GatewayStack) for updates.

this isn't just about replacing 100 lines with 1 line. It's about **standardizing how identity flows through AI applications**.
 
when every mcp server speaks the same identity language — the same request context — the next layers—policy enforcement, rate limiting, audit trails—become plug-and-play.
 
that's the real win: a composable governance stack instead of bespoke middleware in every project.

---
*david crowe - [reducibl.com](https://reducibl.com) - working on this at [gatewaystack.com](https://gatewaystack.com)*
















