---
layout: case-study
title: "apprentice: building an MCP-native app from day one"
pullquote: "designed as a set of tools that AI clients call — not a web app with an AI integration bolted on."
package: mcp server build sprint
client: "apprentice — reducibl internal product"
industry: education / consumer AI
timeline: 1 week
permalink: /case-studies/apprentice-mcp
---

## the situation

apprentice is an AI-powered art study tool with 25,000+ enriched masterworks. the goal was to build it as an MCP-native app from day one — not a web app that later gets an AI integration, but a system designed from the ground up to be used through AI clients.

the dataset and enrichment pipeline were already built ([that story here](/case-studies/apprentice-pilot)). the question was: how do you turn a curated dataset into a production MCP server with auth, scoping, and multi-client support — in a week?

## what we did

four MCP tools, each with scope-based access control through gatewaystack:

- **study plan generation** — creates personalized learning sequences based on skill level and interest, pulling from the enriched dataset to pair masterworks with technique annotations.
- **next-up suggestions** — recommends what to study next based on completed work and learning patterns.
- **attempt submission** — lets users upload their practice work for AI-powered feedback against reference masterworks.
- **progress history** — surfaces practice history and progression over time.

each tool declares its required scopes (read vs write). the same gatewaystack identity layer used in [inner](/case-studies/inner-governance) was applied — OAuth via Auth0, scope-based access control, per-user data isolation in firestore, audit logging. the governance setup took hours instead of days because the patterns were already proven.

deployed to cloud run, submitted as a chatgpt app, and launched at [learnart.app](https://learnart.app).

## the result

apprentice works through any AI client that supports MCP. when new agents add MCP support, apprentice is already there — no rebuild required. the "UI" is whatever AI client the user prefers.

the reusable governance pattern meant auth and scoping — usually the slowest part of a new service — was the fastest. one identity layer, applied to new tool definitions, done.

## key decisions

- **MCP-native from day one.** instead of building a traditional web app and bolting on AI later, apprentice was designed as a set of tools that AI clients call. less to build, more flexible, future-proof.

- **reusable governance pattern.** by using the same gatewaystack identity layer as inner, the governance setup was hours not days. OAuth scopes, firestore isolation, and audit logging were already proven — just applied to new tool definitions.

- **data is the moat, the app is the flywheel.** the strategic bet was to invest heavily in dataset curation and enrichment, and build the MCP server as a distribution channel. the enriched data compounds over time as users interact with it.

---

*[mcp server build sprint](/offers/mcp-server-sprint) — zero to production MCP server in one week.*
