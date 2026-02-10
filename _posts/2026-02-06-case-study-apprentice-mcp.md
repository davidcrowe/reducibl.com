---
layout: case-study
title: "mcp server build sprint: production MCP server with auth in one week"
pullquote: "governance setup took hours, not days."
package: mcp server build sprint
client: "an AI-powered learning app exposing tools through MCP (reference available on request)"
industry: education / consumer AI
timeline: 1 week
permalink: /case-studies/apprentice-mcp
redirect_from:
  - /2026/02/06/case-study-apprentice-mcp.html
---

## the situation

you have internal tools or a dataset that should be accessible through AI agents — chatgpt, claude, or whatever comes next. the product works. but exposing it as an MCP server means solving auth, scoping, and multi-client identity in a way that doesn't collapse when a second AI client shows up.

this app had a curated dataset of 25,000+ enriched items ([built in a prior sprint](/case-studies/apprentice-pilot)). the goal: turn it into a production MCP server with proper auth, scope-based access control, and multi-client support — in one week.

## what we did

built four MCP tools, each with scope-based access control:

**study plan generation** — creates personalized learning sequences based on skill level, pulling from the enriched dataset to pair items with structured annotations.

**next-up suggestions** — recommends what to study next based on completed work and learning patterns.

**attempt submission** — lets users upload practice work for AI-powered feedback against reference items.

**progress history** — surfaces practice history and progression over time.

each tool declares its required scopes (read vs write). the same identity layer used in a [prior governance engagement](/case-studies/inner-governance) was applied — OAuth via Auth0, scope-based access control, per-user data isolation in firestore, audit logging. the governance setup took hours instead of days because the patterns were already proven.

deployed to cloud run. works through any AI client that supports MCP.

## the result

production MCP server in one week, serving through multiple AI clients from day one. when new agents add MCP support, the app is already there — no rebuild required. the "UI" is whatever AI client the user prefers.

the reusable governance pattern meant auth and scoping — usually the slowest part of a new service — was the fastest. one identity layer, applied to new tool definitions, done.

## key decisions

- **MCP-native, not AI-bolted-on.** designed as a set of tools that AI clients call, not a web app with an integration layer. less to build, more flexible, future-proof against new AI clients.

- **reusable governance pattern.** same identity layer as the [prior engagement](/case-studies/inner-governance) — OAuth scopes, firestore isolation, audit logging — applied to new tool definitions. hours, not days. this is the pattern: solve governance once, reuse it across every new MCP server.

- **scope enforcement at the tool boundary.** each tool declares what it needs. adding a new capability is a one-line scope declaration, not an infrastructure change.

---

*[mcp server build sprint](/offers/mcp-server-sprint) — zero to production MCP server in one week.*
