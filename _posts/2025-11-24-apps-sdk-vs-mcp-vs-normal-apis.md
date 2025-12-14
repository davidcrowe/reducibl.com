---
layout: post
title: "apps sdk vs mcp vs normal apis"
description: "my mental model for understanding the emerging AI app ecosystem"
---

i spent days confused by apps sdk vs model context protocol vs "regular" apis.

the terms seemed overlapping and ambiguous… until this mental model clicked:

**chatgpt = web browser**  
 ↓ renders ↓  
**apps sdk = react**  
 ↓ calls ↓  
**mcp server = node/express api**

in other words:

- chatgpt renders your app (like a web browser)  
- apps sdk is the frontend framework — components, views, layouts (like react)  
- mcp is the backend orchestration — tools, data access, logic, auth (like express)

once this clicked, building inside chatgpt felt like building a normal app. except your browser is an llm.

### the challenging part isn't the ai

the hard part of building ai apps? not the ai. it's the same fundamentals every app needs:

- authenticating users  
- scoping data per-user/per-tenant  
- enforcing roles, permissions, policies  
- logging, auditing, governance

thinking through how this infrastructure integrates with ai models has been on my mind a lot lately.

### prediction

user-scoped model access will replace shared api keys as the default in the next 12 months.

shared keys mean everyone sees everyones data.

user-scoped auth means every call is tied to a verified identity and scope — flowing from the llm, to your backend, to the database. 

this is why i built [gatewaystack](https://gatewaystack.com) — a trust layer for apps sdk + mcp that handles user authentication, jwt validation, policy enforcement and per-tool scopes for apps sdk and mcp. so you don't rebuild this infrastructure for every project.

what are you seeing as you build in this space? what patterns are emerging?

---
*david crowe - [reducibl.com](https://reducibl.com) - working on this at [gatewaystack.com](https://gatewaystack.com)*