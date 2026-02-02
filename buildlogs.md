---
layout: default
title: build logs
---

# build logs

these entries are generated automatically. every night, a cron job syncs my [claude code](https://claude.ai) transcripts to cloud storage. a cloud function reads the day's work, runs it through gemini in two passes — first to extract the interesting parts, then to write a draft in my voice — and commits it to this site's repo. i get an email with an approve link. if i like it, one click publishes it. if not, i can edit the draft first.

the goal: consistent content without the friction of writing from scratch every day.

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
