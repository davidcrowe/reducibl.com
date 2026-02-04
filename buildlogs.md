---
layout: default
title: build logs
---

# build logs

notes from building AI-native products in public. what worked, what broke, and what i changed

*the build logs are automatically generated*

-- a cron job syncs my claude code transcripts to cloud storage  
-- a cloud function reads the day's work  
-- it runs it through gemini to extract the interesting parts and write a draft of the build log in my voice   
-- once i approve, it commits the buildlog to this site's repo  

**building (or *want to build*) something similar?** [let's talk](/build)

<hr style="margin: 2rem 0;">

{% assign buildlogs = site.posts | where_exp: "post", "post.categories contains 'buildlog'" %}
{% assign total_tools = 0 %}
{% assign total_files = 0 %}
{% assign total_sessions = 0 %}
{% for post in buildlogs %}
  {% if post.toolCallCount %}{% assign total_tools = total_tools | plus: post.toolCallCount %}{% endif %}
  {% if post.filesWrittenCount %}{% assign total_files = total_files | plus: post.filesWrittenCount %}{% endif %}
  {% if post.sessionCount %}{% assign total_sessions = total_sessions | plus: post.sessionCount %}{% endif %}
{% endfor %}

{% if total_tools > 0 %}
<div style="background: var(--card-bg, #f8f9fa); border: 1px solid var(--border, #e9ecef); border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem;">
  <div style="display: flex; flex-wrap: wrap; gap: 1.25rem 2.5rem; font-size: 0.95rem;">
    <div><strong style="color: var(--heading, #231E5C);">{{ total_tools | divided_by: 1000.0 | round: 1 }}k</strong> <span style="color: var(--muted, #666);">tool calls</span></div>
    <div><strong style="color: var(--heading, #231E5C);">{{ total_files }}</strong> <span style="color: var(--muted, #666);">files modified</span></div>
    <div><strong style="color: var(--heading, #231E5C);">{{ total_sessions }}</strong> <span style="color: var(--muted, #666);">sessions</span></div>
    <div><strong style="color: var(--heading, #231E5C);">{{ buildlogs.size }}</strong> <span style="color: var(--muted, #666);">build logs</span></div>
  </div>
</div>
{% endif %}

<ul class="buildlog-list" style="list-style: none; padding: 0;">
  {% for post in site.posts %}
    {% unless post.categories contains "buildlog" %}{% continue %}{% endunless %}
    <li style="margin-bottom: 1.75rem; padding-bottom: 1.75rem; border-bottom: 1px solid var(--border, #e9ecef);">
      <a href="{{ post.url | relative_url }}" style="font-size: 1.1rem; font-weight: 600;">{{ post.title }}</a>
      <p style="margin: 0.5rem 0 0; color: var(--muted, #666);">{{ post.description }}</p>
      {% if post.toolCallCount %}
      <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--muted, #666); display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem;">
        <span>{{ post.toolCallCount | divided_by: 1000.0 | round: 1 }}k tool calls</span>
        {% if post.filesWrittenCount %}<span>{{ post.filesWrittenCount }} files</span>{% endif %}
        {% if post.sessionCount %}<span>{{ post.sessionCount }} sessions</span>{% endif %}
      </div>
      {% endif %}
    </li>
  {% endfor %}
</ul>
