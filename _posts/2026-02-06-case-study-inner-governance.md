---
layout: case-study
title: "ai governance setup: solving the three-party identity problem"
pullquote: "100 lines of custom auth replaced with one identity layer."
package: ai governance layer setup
client: "a consumer AI app with three client surfaces — chatgpt, claude via MCP, and iOS (reference available on request)"
industry: consumer AI
timeline: 1 week
permalink: /case-studies/inner-governance
---

## the situation

if you're building an AI-powered product, you'll hit the three-party identity problem: user authenticates with your app, but the request comes through an LLM that has no identity of its own. user ↔ LLM ↔ backend — and the backend needs to know which human is on the other end, regardless of which AI client initiated the request.

this product had the problem three times over. it served users through chatgpt, claude via MCP, and a native iOS app. each surface had its own auth path — ~100 lines of custom JWT verification with manual JWKS fetching, issuer validation, and scope extraction. shared API keys had crept in. no audit trail for who accessed what through the AI. when the MCP server launched, any agent could potentially access any user's data.

## what we did

replaced the entire custom auth layer with a single identity module. one function call instead of ~100 lines of manual JWT handling.

**user-scoped identity binding.** every AI interaction is cryptographically tied to a real user via OAuth, regardless of which client initiates the request. the user's token flows through the full chain: user authenticates → AI client passes bearer token → server validates → database gets a verified UID.

**scope-based tool access control.** each tool declares required scopes (read vs write). validation happens at the tool boundary before any data access. adding a new tool is a one-line scope declaration, not a new middleware chain.

**per-user data isolation.** every database query is scoped to the authenticated user. data is cryptographically isolated between users regardless of which AI client makes the request.

**audit trail.** every tool call logged with full context: who, what, when, which scopes, from which client. queryable for compliance or incident response.

## the result

the app went from "working but fragile" to production-hardened in one week. three client surfaces authenticate through a single code path. the custom JWT code was eliminated entirely — removing an entire class of potential auth bugs.

the audit trail answers the question every AI system eventually faces: "who accessed what data through the AI, and when?" the system can now prove the answer cryptographically.

## key decisions

- **one identity layer for all clients.** rather than separate auth per surface, identity is normalized at the gateway. the backend doesn't know or care which AI client initiated the request — it just sees a verified user with scopes.

- **scope enforcement at the tool boundary.** scopes are checked per-tool, not per-endpoint. this means new capabilities are a scope declaration, not an infrastructure change.

- **token forwarding, not shared keys.** the user's OAuth token flows through the entire chain. no shared keys, no ambient authority. this is the core pattern that solves the three-party problem.

---

*[ai governance layer setup](/offers/ai-governance-setup) — identity, permissions, and audit trails for your AI systems — powered by [gatewaystack](https://gatewaystack.com).*
