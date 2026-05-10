---
layout: default
title: writing
description: "essays on agent harness architecture and the architectural primitives underneath agentic ai."
---

# writing

essays on agent harness architecture, identity, dispatch paths, and the protocols underneath.

## harness architecture

<ul>
{% assign harness_posts = site.posts | where_exp: "post", "post.tags contains 'harness-architecture'" %}
{% for post in harness_posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <br/>
    <small>{{ post.description }}</small>
  </li>
{% endfor %}
</ul>

## other writing

<ul>
{% for post in site.posts %}
  {% if post.categories contains "buildlog" %}{% continue %}{% endif %}
  {% if post.layout == "case-study" %}{% continue %}{% endif %}
  {% if post.tags contains "harness-architecture" %}{% continue %}{% endif %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <br/>
    <small>{{ post.description }}</small>
  </li>
{% endfor %}
</ul>

{% include subscribe.html label="get new posts by email" source="writing" %}
