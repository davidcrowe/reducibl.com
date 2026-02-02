---
layout: default
title: build logs
---

# build logs

*these entries are generated automatically* 

every night: 

-- a cron job syncs my [claude code](https://claude.ai) transcripts to cloud storage
-- a cloud function reads the day's work
-- it runs it through gemini first to extract the interesting parts, 
-- then it runs it through gemini again to to write a draft in my voice 
-- finally, it commits the buildlog to this site's repo. 

i get an email with an approve link. if i like it, one click publishes it. if not, i can edit the draft first.

the goal: share what i am building without the friction of writing from scratch every day.

interested in something you read? reach out!

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
