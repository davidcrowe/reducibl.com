---
layout: post
title: "The Dev Pipeline Behind Modern AI Products"
description: "How I think about moving from idea to architecture to production in modern AI systems."
---

# The Dev Pipeline Behind Modern AI Products

You found your million-dollar AI idea. You built a no-code MVP and showed it to real users.  
The interactions validated a real problem people will pay to solve.  
And your MVP… actually solves it.

Then you try to turn it into a real product.

And you immediately hit everything the MVP glossed over: personalization, retrieval, state management, LLM orchestration, and “little” details like authentication, latency, and secure data access. Suddenly you need a real backend — not a no-code demo.

After turning multiple MVPs into working AI apps, I realized the underlying architecture was almost always the same.

## The Three-Layer Architecture I Kept Rebuilding

**1. Serverless orchestration layer (Cloud Run / Cloud Functions)**  
This becomes the app’s nervous system — routing requests, composing context, enforcing security boundaries, and calling models.

**2. Authentication + user data layer (Firebase / Auth0)**  
Identity, user state, documents, events, and the logic needed for user-scoped data access.

**3. Vector database + LLM API (Vertex AI, OpenAI)**  
Embeddings, retrieval, and the model interface itself.

The actual flow is simple to describe:

**User → Orchestration → Firebase + Vector DBs/LLMs → Response**

But rebuilding this stack from scratch every time added *weeks* to each project.

## Reducing the Rebuild Tax

Every user interaction enters the system through the orchestration layer.  
This is where:

- context is assembled  
- data is pulled  
- security is enforced  
- tools and models are routed  
- outputs are persisted  

Once that was stable, I realized something obvious in retrospect:

> If every app uses the same backbone, then the backbone should be reusable.

So I stopped reinventing the wheel and started building *infrastructure* instead of *projects*:

- cloud function templates already wired to my resources  
- opinionated patterns for user-scoped data access  
- drop-in RAG pipelines and vector indexing tools  
- a shared Firebase project for isolated app-level namespaces  
- model integration utilities that standardize logging and context construction  

Once these pieces existed, my ability to spin up new AI apps changed dramatically.

## Cycle Time: Months → Weeks

Development speed didn’t improve because I typed faster.  
It improved because the architecture stopped changing.

With the repetitive setup handled, I started spending more time on things that actually matter:

- talking to users  
- validating direction  
- refining behavior  
- rewriting prompts  
- improving UX  
- making the app less magical and more useful  

It turns out:

> Development velocity matters.  
> But **learning velocity** matters more.

You can build incredibly fast and still build the wrong thing.

The trick is building fast *enough* to maximize how quickly you can learn what the right thing actually is.

---

If you’ve found ways to reduce iteration time for greenfield AI products — technical or process — I’d love to hear them.
