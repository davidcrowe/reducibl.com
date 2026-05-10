---
layout: post
title: "the harness decides what's possible"
description: "the architectural choices in an agent harness — which dispatch points are exposed, how identity propagates, what protocols are routed where — set a hard ceiling on what infrastructure above the harness can do. the harness isn't a transparent layer."
date: 2026-03-22
tags: [harness-architecture]
permalink: /writing/the-harness-decides-whats-possible
---

most discussion of agent infrastructure treats the harness — the runtime between the model and the tools — as a transparent layer. you bolt on observability, governance, retries, cost tracking, and they all just work.

they don't. the harness is the thing that decides what any of those infrastructure layers can see.

## what the harness actually does

every agent harness, regardless of how it's marketed, does roughly the same five jobs:

1. **prompt construction** — assembles the message history and tool catalog passed to the model.
2. **dispatch** — parses the model's tool-use output and figures out where to route each call.
3. **tool execution** — actually runs the call: in-process function, http request, mcp request, shell command.
4. **result formatting** — turns the result back into something the model can consume.
5. **state management** — keeps track of conversation, partial results, retries, errors.

every infrastructure concern you might add is one or more of:

- **observe** — see what's happening at one of those steps.
- **enforce** — change the outcome at one of those steps.
- **persist** — record state across runs.

if the harness doesn't expose a hook into the relevant step, the infrastructure can't observe or enforce there — no matter how good the infrastructure is.

## what a harness chooses, in practice

claude code, anthropic agent sdk, openai agents sdk, langgraph, crewai — all five make different architectural decisions that determine what infrastructure above them can do.

- **which dispatch points fire callbacks**. claude code fires `pretooluse` / `posttooluse` on every tool dispatch — universal coverage of the dispatch step. langgraph's callbacks fire on graph transitions but not all the same hooks. crewai exposes callbacks per-tool but not on inter-agent handoffs by default. these aren't "feature gaps." they're architectural choices about what a customer can do above the harness.

- **whether identity propagates**. some harnesses preserve the originator's identity through every tool call and every subagent spawn. some have no notion of identity at all — every tool call is system-anonymous unless you wire it. governance built on top can only attribute as well as the harness propagates.

- **whether tools route through one path**. claude desktop routes most tools through mcp — one chokepoint, one dispatch path, easy to govern. claude code routes some tools through built-in typescript and some through mcp — two dispatch paths, governance has to cover both. langgraph routes tools through whatever the developer wired. each shape decides what a single intercept point can see.

- **what protocols compose**. some harnesses make it easy to point at a custom http client (proxy works). some don't (proxy can't be inserted). some have a hook for the model api (you can intercept llm calls). some don't (you can't).

every one of these is a *substrate decision* the infrastructure layer has to live with.

## a benchmark made the substrate visible

we ran a benchmark — same governance backend, seven different agent frameworks, 48 governance scenarios across identity, audit, policy, scope inheritance, fail-mode, cross-tenant isolation. scores ranged from 37/48 to 46/48. nine-point spread on the same backend.

the variance was architectural, not implementation. the framework that exposed every dispatch point with rich payload context scored 46/48. the framework that only exposed the mcp boundary scored 37/48. the same governance product, the same infrastructure, the same scenarios — different harnesses produced different scores because the harnesses gave the governance layer different surfaces to work on.

[full benchmark scorecard](https://agenticcontrolplane.com/blog/architecture-is-governance) — the version with the scoring detail.

## the implication for what you build

if you're building an agent, the harness you pick decides what infrastructure you can put around it. some harnesses make governance, observability, and retries straightforward. some make all three painful. the decision is upstream of which infrastructure product you'd buy — a permissive harness with mediocre infrastructure beats a restrictive harness with the best infrastructure on the market.

if you're building agent infrastructure, the harnesses you support decide your coverage ceiling. you can ship the most sophisticated audit logic in the world and it will still miss tool calls if the harness didn't expose them. the infrastructure problem isn't sophisticated logic. it's getting the harness to surface enough of its own internal state that the logic has something to work on.

if you're evaluating either, the question to ask first is: "does this harness expose the dispatch points i care about?" before "does this product have the features i want?" the substrate decides what's possible.

---

*disclosure: i'm building [agentic control plane](https://agenticcontrolplane.com). a lot of acp's design — hooks where harnesses expose them, decorators where they don't, proxies for the network layer — is a direct response to the fact that no single intercept point covers every harness's dispatch surface.*
