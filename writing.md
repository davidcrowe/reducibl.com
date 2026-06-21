---
layout: default
description: "i build products like agentic control plane and calafia.ai. i believe complexity is reducibl. i publish my writing on applied AI, infrastructure, and building real systems here."
---

# reducibl

i build products like [agentic control plane](https://agenticcontrolplane.com) and [calafia.ai](https://calafia.ai). i believe that complexity is reducibl. i publish my writing here.

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

{% include subscribe.html label="get new posts by email" source="writing" contact="https://www.linkedin.com/in/mrdavidcrowe" %}
