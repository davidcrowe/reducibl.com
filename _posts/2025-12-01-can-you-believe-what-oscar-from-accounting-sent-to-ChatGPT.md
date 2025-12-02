---
layout: post
title: "can you believe what oscar from accounting sent to chatgpt?!"
description: "why shared api keys don't scale for mcp and agentic apps"
---

a few weeks ago i was building an mcp server to integrate an app into chatgpt. it took me days just to get user authentication working. turns out that binding cryptographic user identity to AI requests isn't a solved problem. there's no shared identity layer between the user, the llm, and your backend.

and that got me thinking… if it’s this hard to even identify who is interacting with the mcp server, what about everything else we’re supposed to govern?

### what are we supposed to govern for ai model calls?
ideally the dundler mifflin it team would do some mix of the following before sending the message to chatgpt:

— identify who is actually making the call (e.g., oscar from Accounting)  
— validate that oscar is allowed to call the model or share that data  
— transform the data (e.g., remove customer names from the revenue forecast he pasted in, or tag the request as containing sensitive info and requiring vp approval)  
— limit the call (has oscar exceeded his quota or budget?)  
— route the request to the correct model for his role  
— store + explain the result (for when corporate flies in from scranton with kpmg and wants an audit trail)  

### what actually happens today?

in most companies, llm usage still flows through a single org-wide api key. when oscar pastes that revenue forecast, there's nothing preventing him from sending it, no cryptographic proof it was Oscar. just a shared key that could be anyone.

as llm adoption accelerates (and AI agents enter the equation), the “shared api key + homegrown wrappers” approach doesn’t scale. 

so… what did your team send to chatgpt today?



