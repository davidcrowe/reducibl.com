---
layout: case-study
title: "apprentice: from idea to working art study app in one week"
pullquote: "80,000 artworks filtered to 25,000 learnable works, enriched with AI-generated technique breakdowns — the dataset is the product."
package: idea-to-pilot sprint
client: "apprentice — reducibl internal product"
industry: education / consumer AI
timeline: 1 week
permalink: /case-studies/apprentice-pilot
---

## the situation

the idea: an AI-powered art study tool that helps people learn to paint and draw by studying masterworks — not just looking at them, but getting structured breakdowns of technique, composition, and history. the raw material existed: wikiart's dataset of 80,000+ artworks. what didn't exist was a curated, enriched dataset optimized for learning, or any way for users to interact with it through AI.

the question wasn't whether it was possible. it was whether it could go from idea to live product in a week.

## what we did

**data curation.** the wikiart dataset was built by art historians for art historians — comprehensive but not learnable. i built a learnability scoring algorithm that evaluated each artwork on composition simplicity, lighting clarity, subject appropriateness, and technical accessibility. 80,000 works became ~25,000 curated works optimized for someone trying to learn, not just browse.

**AI enrichment pipeline.** the filtered dataset was run through an enrichment pipeline to generate style breakdowns, technique decompositions, historical context, and beginner tips for each work. the enriched metadata is what makes apprentice useful — a user doesn't just see a Vermeer, they get a structured explanation of how Vermeer handled light and why it matters for their skill level.

**product architecture.** designed as an [MCP-native app from day one](/case-studies/apprentice-mcp) — a set of AI-callable tools rather than a traditional web UI. study plan generation, progress tracking, practice submissions with AI feedback. deployed to cloud run and launched at [learnart.app](https://learnart.app).

## the result

apprentice went from "idea in a doc" to a live chatgpt app with 25,000+ enriched artworks, personalized study plans, and a practice submission system — in one week. the enriched dataset is the real asset: style breakdowns, technique notes, and learnability scores are proprietary data that compounds over time as users interact with it.

## key decisions

- **data is the moat, the app is the flywheel.** 70% of the wikiart dataset was filtered out as not learnable. that curation judgment is the product, not the interface. the enrichment layer on top makes the dataset defensible.

- **enrich once, serve everywhere.** the AI enrichment pipeline runs at build time, not query time. every artwork's technique breakdown, historical context, and beginner tips are pre-computed and stored. users get instant, consistent responses instead of waiting for real-time generation.

- **ship the pilot, then harden.** the first week was about proving the concept works end-to-end. governance, scoping, and production hardening came next ([that story here](/case-studies/apprentice-mcp)). trying to do both in week one would have shipped neither.

---

*[idea-to-pilot sprint](/offers/idea-to-pilot-sprint) — one week to turn your AI idea into a working pilot.*
