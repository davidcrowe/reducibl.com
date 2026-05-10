---
layout: post
title: "three places to sit in an agent's call path"
description: "hooks, decorators, proxies — three distinct architectural positions for any cross-cutting concern in an agent harness. each has a coverage scope, a cooperation cost, and a different blind spot."
date: 2026-04-08
tags: [harness-architecture, dispatch-path]
permalink: /writing/three-places-to-sit-in-an-agents-call-path
---

if you want to do anything to every tool call an agent makes — log it, audit it, deny it, redact it, retry it, count it, charge for it — you have to sit somewhere in the call path. there are three primary places to sit. they aren't equivalent.

## hook

the harness fires a callback at a known lifecycle point: before tool dispatch, after tool dispatch, on stop, on error. the callback receives the full tool call and can allow, deny, modify, or audit. claude code's `pretooluse` and `posttooluse` are the canonical example. codex cli has equivalent.

- **coverage**: every tool the harness dispatches, by construction. no agent cooperation needed; the harness fires the hook regardless of what the agent decides.
- **cooperation cost**: harness has to expose a hook surface. some do (claude code, codex cli). most don't (cursor partially, windsurf no, aider no).
- **blind spot**: tools that bypass the harness's dispatcher entirely — for instance, an mcp tool the harness routed without lifecycle attribution, or a built-in shell escape that doesn't get registered as a tool call.

## decorator

a wrapper around the tool function itself, in the agent's own code. python: `@governed`. typescript: `withGoverned(toolFn)`. fires every time the function is called, regardless of how the agent reached it.

- **coverage**: every call to the wrapped function. if the agent reaches the function, the decorator fires.
- **cooperation cost**: developer cooperation. the developer writing the agent has to wrap their tools. fine when you control the code; harder when you don't.
- **blind spot**: anything that escapes the wrapped function. `child_process.exec` inside the function. raw `fetch` inside the function. another tool that calls the same backend without going through this wrapper.

## proxy

an http intermediary. the harness or sdk is configured to route its outbound calls through a proxy server. the proxy sees full request and response. openai agents sdk does this naturally — point its http client at a proxy url, and every llm round-trip + tool dispatch (if the tool is an http call) is observable.

- **coverage**: every network round-trip the agent makes through the configured client. catches a different shape than the others — proxy sees the *outbound* side, including responses.
- **cooperation cost**: harness has to honor a custom http client. most modern sdks do. but the harness has to actually route through the proxy — local execution (a python tool that calls a python function) doesn't go through it.
- **blind spot**: in-process work. anything the agent does that doesn't generate an outbound network call.

## the choice isn't ergonomic, it's architectural

each pattern has a coverage scope determined by *where in the dispatch path it sits*. you can't pick the one with "the best ergonomics" and get the same coverage as the one with "the best position." they see different things.

a more useful way to think about a real production stack:

- if your harness exposes hooks, hooks cover everything *the harness dispatches*. use them.
- if you control the agent code, decorators cover everything *the developer wrapped*. add them.
- if you have an sdk routing through an http client, a proxy covers everything *that client sends out*. add it.
- the union covers more than any single pattern. each pattern has a complementary blind spot.

what's *not* on this list is mcp. mcp is a tool-delivery protocol, not a call-path position. it sits beside the dispatch path, not in it. governance applied at the mcp layer covers the slice of tool calls that go through mcp — it doesn't cover the rest, by protocol design. that's a separate distinction worth having clean.

## why this matters beyond governance

the same architectural split applies to every cross-cutting concern in an agent harness:

- **logging**: where do you log every tool call? same three options.
- **rate limiting**: where do you enforce per-tool budgets? same three options.
- **caching**: where do you intercept duplicate calls and return cached results? same three options.
- **retry**: where do you re-execute on failure? same three options. (with the caveat that retry semantics for autonomous agents are their own problem.)
- **cost attribution**: where do you record per-call cost? same three options.

if you've solved one of these at the hook level, you've laid the foundation for the others. the architectural primitive is *where in the dispatch path enforcement sits*, not *what enforcement does*.

---

*disclosure: i'm building [agentic control plane](https://agenticcontrolplane.com), which uses all three patterns where each fits. the coverage of any one pattern alone is bounded by where it sits.*
