---
layout: default
title: writing
description: "i build products like agentic control plane and calafia.ai. i publish my writing on applied AI, infrastructure, and building real systems here."
---

i build products like [agentic control plane](https://agenticcontrolplane.com) and [calafia.ai](https://calafia.ai). i publish my writing here.

<p style="color: var(--muted);"><a href="https://www.linkedin.com/in/mrdavidcrowe">contact me</a></p>

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
