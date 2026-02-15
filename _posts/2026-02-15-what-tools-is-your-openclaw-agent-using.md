---
layout: post
title: "what tools is your openclaw agent using?"
description: "introducing gatewaystack governance — identity, scope, rate limiting, injection detection, and audit logging for every tool call"
og_image: /assets/openclaw-gatewaystack-governance-og.png
permalink: /writing/what-tools-is-your-openclaw-agent-using
redirect_from:
  - /2026/02/15/what-tools-is-your-openclaw-agent-using.html
---

what tools is your openclaw agent using? and what are they using them for?

openclaw gives your personal AI agent access to powerful tools — read files, write files, execute commands, search the web. but out of the box, there's no governance layer answering:

- **who** is making the call?
- **what** tool are they invoking?
- is the payload **safe**?
- is there a **record**?

### gatewaystack governance fixes this

it's an openclaw plugin that hooks into every tool call at the process level — so the agent can't bypass it.

five checks run automatically on every invocation:

1. **identity** — maps the agent to a policy role
2. **scope** — deny-by-default tool allowlist
3. **rate limiting** — per-user and per-session limits
4. **injection detection** — 40+ patterns from published security research
5. **audit logging** — every decision recorded

### see it in action

<video controls width="100%" style="border-radius: 8px; margin: 1em 0;">
  <source src="/assets/openclaw-gatewaystack-governance-demo.mp4" type="video/mp4">
  your browser does not support the video tag.
</video>

in the demo: a read succeeds (agent has permission), but write and exec are blocked — the agent's role doesn't have access. the governance layer explains why, and every decision hits the audit log.

### why this matters

this matters because published research from [cisco](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare), [snyk](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/), and [kaspersky](https://www.kaspersky.com/blog/openclaw-vulnerabilities-exposed/55263/) has found real vulnerabilities in personal AI agents — malicious skills, prompt injection via email, and RCE via websocket hijacking. "trust the LLM to do the right thing" isn't a security strategy.

### get started

open source, MIT licensed. install in one command:

```bash
openclaw plugins install @gatewaystack/gatewaystack-governance
```

zero config. governance is active on every tool call immediately.

[github repo](https://github.com/davidcrowe/openclaw-gatewaystack-governance) · [npm package](https://www.npmjs.com/package/@gatewaystack/gatewaystack-governance)
