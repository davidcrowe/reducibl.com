---
layout: post
title: "how is an llm like a financial advisor?"
description: "mcp servers are three party systems"
permalink: /writing/how-is-an-llm-like-a-financial-advisor
redirect_from:
  - /2025/12/11/how-is-an-llm-like-a-financial-advisor.html
---

*originally posted to linkedin*

i couldn’t figure out why user-scoped data access was so tricky in model context protocol servers. this is basic stuff in traditional apps. then it dawned on me. 

**mcp servers are different… they are three-party systems**. similar to a financial advisor accessing your bank records:

— **the user** → person soliciting financial advice  
— **the llm** → financial advisor acting on their behalf  
— **your backend** → the bank holding the records  

### don't give an llm power of attorney

why does this matter? imagine a financial advisor asking for bank records with no power of attorney to prove they represent the client. 

traditional apps are two-party systems. the user logs in and the backend knows who they are.

trust in three-party systems is different:

1. the user logs in to chatgpt
2. chatgpt calls your backend
3. your backend has no way to verify which specific user the llm is calling on behalf of 

### the user to backend identity link is missing

for many apps this becomes a security risk. you can't:

— filter data per-user ("show me my calendar" → returns everyone's calendar)  
— enforce policies ("only doctors can access patient records" → anyone can)  
— audit by user ("who made this query?" → not sure)  

**i call this the *three-party problem***. i tackled it while integrating my own app into chatgpt. 

if you’ve built mcp servers, have you hit this too? how did you approach it?
