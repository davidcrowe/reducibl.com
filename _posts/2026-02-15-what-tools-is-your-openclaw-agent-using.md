---
layout: post
title: "what tools is your openclaw agent using?"
description: "introducing gatewaystack governance — identity, scope, rate limiting, injection detection, and audit logging for every tool call"
og_image: /assets/openclaw-gatewaystack-governance-og.png
permalink: /writing/what-tools-is-your-openclaw-agent-using
---

I installed OpenClaw and pointed it at my project directory. Within minutes it had read my .env file.

Fair enough — I gave it file access. So I installed a permissions skill to lock things down.

The agent ignored it.

Not maliciously. The skill was just a suggestion to the LLM, not an enforcement layer. There's nothing in OpenClaw's architecture that forces the agent to check every skill and permission before calling a tool. It's all voluntary compliance.

So I built GatewayStack Governance — a plugin that hooks into every tool call at the process level. The agent doesn't get to decide whether governance applies. It always does.

Five checks run on every invocation: 

- identity mapping
- deny-by-default tool scoping
- rate limiting
- injection detection (40+ patterns from published research)
- full audit logging.

This isn't theoretical. Snyk audited ClawHub and found 12% of published skills were compromised — including one campaign that delivered macOS malware through markdown instructions.

"Trust the LLM to do the right thing" is not a security model.

GatewayStack Governance is.

Open source. MIT licensed. One command install. 

Peace of mind.

### see it in action

<video controls width="100%" style="border-radius: 8px; margin: 1em 0;">
  <source src="/assets/openclaw-gatewaystack-governance-demo.mp4" type="video/mp4">
  your browser does not support the video tag.
</video>

in the demo: a read succeeds (agent has permission), but write and exec are blocked — the agent's role doesn't have access. the governance layer explains why, and every decision hits the audit log.

### get started

open source, MIT licensed. install in one command:

```bash
openclaw plugins install @gatewaystack/gatewaystack-governance
```

zero config. governance is active on every tool call immediately.

[github repo](https://github.com/davidcrowe/openclaw-gatewaystack-governance) · [npm package](https://www.npmjs.com/package/@gatewaystack/gatewaystack-governance) · [clawhub page](https://clawhub.ai/davidcrowe/gatewaystack-governance)
