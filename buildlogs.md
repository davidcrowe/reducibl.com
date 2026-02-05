---
layout: default
title: build logs
---

# build logs

notes from building AI-native products in public. what worked, what broke, and what i changed.

if you're building AI-native products, these logs show the real day-to-day: the dead ends, the pivots, and what actually works.

<details style="margin: 1rem 0;">
<summary style="cursor: pointer; color: var(--muted);">how the automation works</summary>
<div style="margin-top: 0.75rem; padding-left: 1rem; border-left: 2px solid rgba(35, 30, 92, 0.15);">
<p>a cron job syncs my claude code transcripts to cloud storage. a cloud function reads the day's work, gemini extracts the interesting parts and drafts the log in my voice, and once i approve it commits to this site's repo.</p>
<p><a href="/build">let's talk</a> if you're building something similar.</p>
</div>
</details>

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

{% include subscribe.html label="get build logs by email" source="buildlogs" %}
