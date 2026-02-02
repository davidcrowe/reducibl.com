---
layout: default
title: build logs
---

# build logs

*these entries are generated automatically* 

-- a cron job syncs my claude code transcripts to cloud storage  
-- a cloud function reads the day's work  
-- it runs it through gemini to extract the interesting parts and write a draft of the build log in my voice   
-- once i approve, it commits the buildlog to this site's repo  

*interested in something you read?* [reach out](https://www.linkedin.com/in/mrdavidcrowe)!

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
