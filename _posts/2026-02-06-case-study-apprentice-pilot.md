---
layout: case-study
title: "idea-to-pilot sprint: from raw dataset to live AI product in one week"
pullquote: "80,000 items to curated product in five days."
package: idea-to-pilot sprint
client: "an AI-powered learning app built on a large public dataset (reference available on request)"
industry: education / consumer AI
timeline: 1 week
permalink: /case-studies/apprentice-pilot
---

## the situation

there was a public dataset of 80,000+ items — comprehensive but built for researchers, not end users. the idea: turn it into an AI-powered learning product with curated content, AI-generated enrichments, and personalized study paths. the constraint: go from idea to live product in one week.

the dataset was the starting point, not the product. most of it wasn't suitable for learners. it needed opinionated curation, structured enrichment, and an architecture that could serve the enriched data through AI clients without regenerating it on every request.

## what we did

**day 1 — scoping.** defined the core hypothesis: a curated, enriched dataset is more valuable than a comprehensive one. the pilot would prove this by filtering aggressively, enriching what survived, and shipping a usable product by day 5.

**days 2-3 — data curation + enrichment.** built a scoring algorithm that evaluated each item on four dimensions relevant to the learning use case. 80,000 items became ~25,000. the filtered dataset then ran through an AI enrichment pipeline that generated structured breakdowns, contextual notes, and skill-level-appropriate guidance for each item. this enrichment is pre-computed at build time — users get instant responses, not real-time generation latency.

**days 4-5 — product build + deploy.** designed as an [MCP-native app from day one](/case-studies/apprentice-mcp) — a set of AI-callable tools rather than a traditional web UI. study plan generation, progress tracking, practice submissions with AI feedback. deployed to cloud run and launched live.

## the result

live product in one week: ~25,000 enriched items, personalized study plans, and a practice submission system. the enriched dataset is the real asset — the curation judgment and structured enrichments are proprietary data that compounds as users interact with it.

the "enrich once, serve everywhere" architecture means content is consistent across all AI clients with no per-request cost. adding a new client surface is a deployment, not a rebuild.

## key decisions

- **opinionated curation over comprehensiveness.** 70% of the raw dataset was filtered out. that curation judgment — deciding what's suitable for learners vs. researchers — is the product, not the interface. it's the kind of decision that can't be made generically.

- **enrich at build time, not query time.** pre-computing enrichments eliminates real-time generation latency and cost. users get instant, consistent responses. the tradeoff (enrichments are static until the next build) is worth it for content that doesn't change frequently.

- **ship the pilot, then harden.** week one proved the concept end-to-end. governance, scoping, and production hardening came next ([that story here](/case-studies/apprentice-mcp)). trying to do both in one week would have shipped neither.

---

*[idea-to-pilot sprint](/offers/idea-to-pilot-sprint) — one week to turn your AI idea into a working pilot.*
