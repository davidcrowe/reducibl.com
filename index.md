---
layout: default
title: reducibl
description: "essays on agent harness architecture — identity, dispatch paths, delegation chains, and the protocols underneath."
---

# reducibl

**i work with agent harnesses.** i'm building [agentic control plane](https://agenticcontrolplane.com) — the governance instance of much of the thinking on this site.

*complexity is reducibl.*

most of what's hard about agentic AI today isn't model capability — it's the layer between the model and the tools. that layer has a name nobody quite agreed on yet. i call it the **harness**, and the architectural primitives underneath it — dispatch path, identity propagation, delegation chains, failure modes, protocol coverage — decide what's possible above.

these essays explore those primitives.

## recent essays on harness architecture

<ul style="margin: 1rem 0;">
{% assign harness_posts = site.posts | where_exp: "post", "post.tags contains 'harness-architecture'" | limit: 6 %}
{% for post in harness_posts %}
  <li style="margin-bottom: 0.5rem;">
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a><br/>
    <small style="color: var(--muted);">{{ post.description }}</small>
  </li>
{% endfor %}
</ul>

[**all writing →**](/writing){: data-track="Homepage: All Writing"}

## what i've shipped

- [**agentic control plane**](https://agenticcontrolplane.com) — cross-architecture governance for AI agents. hooks, decorators, proxies, MCP gateways under one identity model.
- [**inner**](https://innerdreamapp.com) — emotional memory layer for LLMs (chatgpt app, MCP server, iOS).
- [**apprentice**](https://learnart.app) — AI-powered art study across 25k+ enriched masterworks.
- [**gatewaystack**](https://gatewaystack.com) — open-source identity and governance npm packages (the foundation under ACP).

## about

david crowe · previously aws, dell · harvard, uchicago · [github](https://github.com/davidcrowe) · [linkedin](https://www.linkedin.com/in/mrdavidcrowe) · [email](mailto:david@reducibl.com)
