---
layout: default
title: writing
description: "thoughts on applied AI, infrastructure, and building real systems."
---

# writing

thoughts on applied AI, infrastructure, and building real systems

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
