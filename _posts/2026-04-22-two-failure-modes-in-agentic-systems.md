---
layout: post
title: "two failure modes in agentic systems"
description: "scripted flows fail by design. autonomous agents fail by exploration. the same architectural distinction shapes how you think about reliability, observability, and cost — not just governance."
date: 2026-04-22
tags: [harness-architecture, autonomy]
permalink: /writing/two-failure-modes-in-agentic-systems
---

every production agent today sits somewhere between two ends.

at one end is the **scripted flow**: a langgraph state machine, a dspy program, a workflow engine with llm steps embedded. the graph picks the tools. the model fills in arguments. the path is fixed at design time.

at the other is the **autonomous agent**: an anthropic sdk tool-use loop, a react agent, operator, claude code with no specifications. the model picks the tool, the arguments, the order, the moment to stop. the path is decided one step at a time.

most discussion of these treats the difference as a *capability* trade-off — deterministic but limited vs flexible but risky. that framing misses the more useful distinction.

**they fail differently.**

## scripted flows fail by design

the workflow author chose the wrong allowed tools. or the wrong policy. or the wrong fallback. or didn't anticipate the llm injecting a leaked api key into a slack message body.

the failure is upstream of the run, embedded in the workflow definition. once the workflow ships, the failure mode is locked in until someone edits the workflow.

if you think of the workflow as code, this is a code-review problem. mostly static. the workflow is the policy.

## autonomous agents fail by exploration

the model picked a tool you didn't predict, in a context you didn't predict, with arguments you didn't predict. there is no workflow to review. the model invented the path. the failure happens at runtime, in the gap between *tools the agent could call* and *tools the agent should call right now*.

no design-time review can answer that gap. the question only comes into existence at the moment of the call.

## why this matters beyond governance

the failure-mode distinction doesn't only shape governance. the same split decides:

- **reliability**. retry semantics break for autonomous agents because every call has side effects the agent chose. retry-on-failure for an idempotent rpc is well-understood; retry-on-failure for "the agent decided to send a slack message" is a different problem.
- **observability**. distributed-tracing primitives assume call paths are constructed by the dispatcher, not the operand. autonomous agents construct paths reactively. a span tree where the next span is decided by an llm at runtime is not a thing opentelemetry models cleanly.
- **cost**. cost attribution per-tool, per-user, per-tenant is straightforward when the workflow chose the tool. it gets harder when the agent chose, because the cost driver is the agent's discretion — and discretion is harder to budget against than throughput.
- **debugging**. when something goes wrong in a scripted flow, the answer to "what happened" is in the execution log. when something goes wrong in an autonomous agent, the answer is "well, the model decided to..." which is a different kind of debugging entirely.

each of these is a cross-cutting concern that most agent infrastructure implicitly assumes the scripted shape. autonomous agents need new shapes for each.

## hybrid is most production

the dichotomy above is theoretical. real production deployments are almost always hybrid — a scripted skeleton with autonomous regions in the middle.

typical shape:

1. scripted setup: authenticate the request, pull user context, validate inputs.
2. **autonomous region**: tool-use loop with the actual agent doing the work.
3. scripted teardown: log the result, hand response back to the caller.

infrastructure has to handle both. a product that addresses only one regime is half a product for production.

## the autonomy axis is what matters, not volume

here's the practical implication for sizing the operational complexity: **the harder problems scale with autonomy, not with traffic.**

a 10,000-call/day scripted langgraph workflow with three deterministic tool nodes is mostly a code-correctness problem. workflow review and content scanning at llm steps cover the bulk of it.

a 100-call/day computer-use agent that picks tools at runtime is a much harder operational problem. the blast radius per decision is much higher. governance, observability, and reliability all need shapes built for runtime decision-making, not design-time review.

a buyer evaluating any agent infrastructure product — observability, governance, reliability, cost — should ask not "how many tool calls do we make?" but "where on the autonomy spectrum do we operate?"

## the direction of travel

agent products are moving up the autonomy axis, not down. computer use, operator, cursor's auto-mode, claude code's loose-leash workflows, devin, recursion experiments — every product gaining attention gives the model more discretion, not less.

langgraph and dspy's "make it deterministic" pitch is real and valuable, but it's a *response* to the autonomy direction. the default trajectory of the field is more discretion, longer leashes, more tools.

which means the failure-by-exploration share of agent failures grows. infrastructure built only for the scripted regime gets less useful over time. infrastructure built for runtime decision-making gets more useful.

---

*disclosure: i'm building [agentic control plane](https://agenticcontrolplane.com), the governance instance of a lot of this thinking.*
