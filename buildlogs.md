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

**building (or *want to build*) something similar?** 

[reach out](https://www.linkedin.com/in/mrdavidcrowe) and let's compare notes

<br>
<hr>
<br> 
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
