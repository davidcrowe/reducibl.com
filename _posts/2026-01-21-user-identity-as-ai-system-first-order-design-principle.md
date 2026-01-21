---
layout: post
title: "user identity isn’t a first-order AI system design principle"
description: "and why this is as a fundamental architectural mistake"
---

*originally posted to linkedin*

**most AI systems are deployed without user identity as a first-order design principle.**

this matters more than is immediately apparent. especially when you move from pilot to production. 

because when something goes wrong and compliance calls, you can’t reliably answer the most basic questions:

– who triggered a model call?
– what data was accessed and supplied as context?
– was the user actually allowed to do this?
– who is accountable for the outcome?

no shared identity context across the AI system flow means no clear owner. worst case, that means shared access. best case, it means unclear accountability.

### so how did we get here?

most AI systems are built around *model access*, not *user identity*.

that made sense early on. the first wave of genAI systems weren’t designed to be multi-tenant.

today many teams still rely on shared API keys. others glue identity into their app logic in bespoke ways that aren’t their core competency. either way, identity still isn’t the center of the system or the llm workflow.

**i view this as a fundamental architectural mistake in production AI systems.**

curious how others are handling this today.

---
*david crowe - [reducibl.com](https://reducibl.com) - [gatewaystack.com](https://gatewaystack.com)*