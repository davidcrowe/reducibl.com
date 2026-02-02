---
layout: default
title: build logs
---

# build logs

daily notes on what i'm building, what broke, and what i learned

<ul>
  {% for post in site.posts %}
    {% unless post.categories contains "buildlog" %}{% continue %}{% endunless %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <br/>
      <small>{{ post.description }}</small>
    </li>
  {% endfor %}
</ul>
