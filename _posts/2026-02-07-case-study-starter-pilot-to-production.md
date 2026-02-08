---
layout: case-study
title: "pilot-to-production sprint: hardening an MCP server from demo to deployable"
pullquote: "690 lines of dead code removed, one scope enforcement bug caught, zero manual test effort before."
package: pilot-to-production sprint
client: "an open-source MCP server starter kit with OAuth-protected CRM demo tools (reference available on request)"
industry: developer tools / AI infrastructure
timeline: 1 day
permalink: /case-studies/starter-pilot-to-production
---

## the situation

the MCP server worked. it demonstrated user-scoped identity flowing through ChatGPT, OAuth JWT verification, per-tool scope enforcement, and a mock CRM with cross-user access denial. as a demo, it was compelling. as something you'd actually deploy to production, it had problems.

the codebase carried ~690 lines of dead firebase code from an earlier deployment strategy that was abandoned. it silently fell back to a hardcoded development Auth0 tenant if the `OAUTH_ISSUER` env var wasn't set — meaning a misconfigured deployment could authenticate against someone else's identity provider. there was no rate limiting. no tests. the module system was CommonJS in a project that should have been ESM from day one. the README was written for a different positioning.

none of these are exotic problems. they're the exact gap between "works in demo" and "safe to deploy." and they're the reason most pilots stall — not because the core idea is wrong, but because nobody has bandwidth to do the hardening work.

## what we did

**assessment — dead code and dependency audit.** mapped every source file to determine what was active and what was vestigial. found four firebase variant files (`toolGateway-firebase.ts`, `mcpHandler-firebase.ts`, `firebaseAdapter.ts`, `cloudFunctions.ts`) that were never imported by the main codebase. the `firebase-admin` dependency — a heavy package — was only used by this dead code. removed all of it. 690 lines deleted, 144 transitive packages eliminated from the dependency tree.

**auth hardening.** the OAuth config module had a fallback: if `OAUTH_ISSUER` wasn't set, it silently used `https://dev-e2r87v477lvku60t.us.auth0.com/`. this is the kind of default that works perfectly in development and creates a security incident in production. replaced it with a fail-fast error on startup. if you don't configure your identity provider, the server won't start. this is the correct behavior.

**rate limiting.** added `express-rate-limit` at the application level — 100 requests per minute per IP with draft-7 standard headers. the original codebase had no request throttling at all, meaning a single client could saturate the server.

**test suite.** wrote 26 unit tests across four test files covering auth helpers (JWT parsing, scope enforcement, base64url decoding), tool registry (scope declarations, MCP descriptors, output summarizers), CRM identity (HMAC user key derivation, user labels), and data isolation (note store user scoping). the tests immediately caught a real bug: `crmResetMyData` was registered as an MCP tool but missing from the scope enforcement map, meaning it could be called without the `starter.crm` scope. fixed.

**ESM migration.** switched from CommonJS to native ES modules — `"type": "module"` in package.json, `Node16` module resolution in tsconfig, `.js` extensions on all relative imports, replaced `ts-node` with `tsx`, removed the CJS `require.main === module` entry point pattern. clean build verified.

**README rewrite.** repositioned from "trust and governance layer" (abstract) to "build your own MCP server with real user identity" (concrete). added architecture tree, endpoint table, what's-included table with GatewayStack package attribution, customize-in-3-steps guide.

## the result

the codebase went from 23 source files to 17 (plus 4 test files), from ~2,200 lines to ~1,500 active lines plus 226 lines of tests. dependency count dropped from 301 packages to 208. the hardcoded Auth0 fallback is gone. rate limiting is in place. every tool has scope enforcement. the module system is modern. the README explains what the repo actually does.

the scope enforcement bug — `crmResetMyData` callable without authorization — was invisible in manual testing because you'd always be authenticated when testing the CRM flow. only a systematic test that cross-referenced the tool registry against the scope map caught it. this is why "it works when I try it" isn't a production readiness standard.

total diff: 23 files changed, 1,959 insertions, 2,518 deletions. net reduction of 559 lines while adding tests, rate limiting, and a rewritten README.

## key decisions

- **fail-fast over fail-safe for auth config.** a server that refuses to start is better than a server that silently authenticates against the wrong identity provider. the hardcoded fallback was convenient for development. removing it was necessary for production.

- **tests that cross-reference declarations.** the most valuable test wasn't a unit test of a function — it was a structural test that verified every tool in the MCP registry had a corresponding entry in the scope enforcement map. this caught a real authorization bypass. structural tests like this are cheap to write and catch entire categories of bugs.

- **delete before you add.** the first commit removed 690 lines. the instinct is to add hardening on top of what exists. but dead code isn't neutral — it confuses contributors, inflates dependencies, and creates false confidence in test coverage. removing it first made everything else clearer.

- **ESM migration as part of hardening, not separately.** switching module systems is disruptive enough that it's tempting to defer. but doing it during the hardening sprint — when you're already touching every file for import auditing — is the cheapest time. the alternative is doing it later when there are more files and more consumers.

---

*[pilot-to-production sprint](/offers/pilot-to-production-sprint) — two weeks to ship your stalled AI pilot, or kill it with a clear post-mortem.*
