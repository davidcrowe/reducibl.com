---
layout: case-study
title: "hardening inner for production: identity, scopes, and audit trails"
pullquote: "replaced 100 lines of custom auth with a single identity layer — now serving three AI clients with full audit trails."
package: ai governance layer setup
client: "inner — reducibl internal product"
industry: consumer AI / emotional wellness
timeline: 1 week
permalink: /case-studies/inner-governance
---

## the situation

inner is an emotional memory layer for LLMs — users capture emotionally significant experiences and recall them through semantic search. it was live as a chatgpt app and on iOS, but it had a governance problem: ~100 lines of custom JWT verification code, shared API keys in places they shouldn't have been, and no audit trail for who accessed what through the AI.

when i exposed inner as an MCP server — allowing claude and other agents to access user memories — the identity gap became critical. the three-party problem (user ↔ LLM ↔ backend) meant that without proper identity binding, any agent could potentially access any user's emotional data.

## what we did

i replaced the entire custom JWT verification layer with gatewaystack's identity module — one function call instead of ~100 lines of manual JWKS fetching, issuer validation, and scope extraction.

- **user-scoped identity binding** — every AI interaction is cryptographically tied to a real user via OAuth, regardless of which client (chatgpt, claude via MCP, or iOS) initiates the request.

- **scope-based tool access control** — each tool declares required scopes (read vs write). scope validation happens at the tool boundary before any data access.

- **per-user data isolation** — every database query is scoped to the authenticated user. emotional memories are cryptographically isolated between users, regardless of which AI client makes the request.

- **audit trail** — every tool call is logged with full request context: who, what, when, which scopes, from which client. queryable for compliance or incident response.

## the result

inner went from "working but fragile" to production-hardened in one week. the identity layer now handles authentication uniformly across three client surfaces through a single code path. the custom JWT verification code was eliminated entirely — reducing the auth surface area and removing a class of bugs.

the audit trail answered the question that every AI system eventually faces: "who accessed what data through the AI, and when?" inner can now prove the answer cryptographically.

## key decisions

- **one identity layer for all clients.** rather than separate auth for chatgpt vs MCP vs iOS, gatewaystack normalizes identity at the gateway. the backend doesn't know or care which AI client initiated the request — it just sees a verified user with scopes.

- **scope enforcement at the tool boundary, not the route.** scopes are checked per-tool, not per-endpoint. adding a new tool with different permission requirements is a one-line scope declaration, not a new middleware chain.

- **the three-party problem solved by token forwarding.** the user's OAuth token flows through the entire chain: user authenticates → AI client passes bearer token → server validates → database gets a verified UID. no shared keys, no ambient authority.

---

*[ai governance layer setup](/offers/ai-governance-setup) — identity, permissions, and audit trails for your AI systems — powered by [gatewaystack](https://gatewaystack.com).*
