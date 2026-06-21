---
layout: default
title: david crowe
description: "david crowe — i build products like agentic control plane and calafia.ai. i publish my writing on applied AI, infrastructure, and building real systems here."
---

# david crowe

i build products like [agentic control plane](https://agenticcontrolplane.com) and [calafia.ai](https://calafia.ai). i publish my writing here.

<p style="color: var(--muted);"><a href="https://www.linkedin.com/in/mrdavidcrowe">linkedin</a> · <a href="mailto:david@agenticcontrolplane.com">david@agenticcontrolplane.com</a></p>

## featured

[**apps are the flywheel, data is the asset**](/writing/apps-are-the-flywheel-data-is-the-asset) — building a portfolio of AI apps? bet on the data

[**the three-party identity problem in mcp servers**](/writing/the-three-party-identity-problem-in-mcp-servers) — the architectural challenge every agent system hits

[**is claude code secure?**](/writing/is-claude-code-secure) — secrets, prompt injection, and the real weak link

## all posts

<ul>
  {% for post in site.posts %}
    {% if post.categories contains "buildlog" %}{% continue %}{% endif %}
    {% if post.layout == "case-study" %}{% continue %}{% endif %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <br/>
      <small>{{ post.description }}</small>
    </li>
  {% endfor %}
</ul>

{% include subscribe.html label="get new posts by email" source="writing" %}
