---
layout: post
title: "the three-party identity problem in mcp servers"
description: "thoughts around an agentic control plane for ai model access"
---

a few weeks ago i was building an mcp server to integrate an app into chatgpt. it took me days just to get user authentication working. turns out that binding cryptographic user identity to AI requests isn't a solved problem. there's no shared identity layer between the user, the llm, and your backend. this is what i call the "three-party problem". 

here is the basic flow:

1. user logs into chatgpt (openai identity) 
2. user initiates oauth flow from chatgpt to connect my app
3. chatgpt redirects to my oauth endpoint with standard PKCE flow
4. **the gap**: my backend needs to cryptographically bind chatgpt's user to my firebase user
5. i built a custom token exchange: validate the oauth callback, issue a firebase custom token, then inject verified identity (X-User-Id) into every subsequent request

this works, but it's fragile and not standardized. everyone is rolling their own version of this identity bridge inside their mcp server. worse, once you solve identity, you still need to build:

- per-tool scope enforcement (only certain users can call certain tools)
- rate limiting per user (not just per api key)
- audit trails with cryptographic proof of who called what
- policy routing (send doctors to medical models, analysts to financial models)

### ai model access governance - best practice
can you believe what oscar from accounting sent to chatgpt?!

before oscar's message get's through to chatgpt, ideally the dundler mifflin it team would make sure his message is:

— **identifiabl** who is actually making the call (e.g., oscar from accounting)  
— **validatabl** is oscar allowed to call the model or share that data  
— **transformabl** e.g., remove customer names from the revenue forecast he pasted in, or tag the request as containing sensitive info and requiring vp approval  
— **limitabl** has oscar exceeded his quota or budget?  
— **proxyabl** e.g., forward the message to the correct model for Oscar's role  
— **explicabl** store + explain the interaction (for when corporate flies in from scranton with kpmg and wants an audit trail)  

### ai model access governance - real life
in most companies, llm usage still flows through a single org-wide api key. this means that when oscar pastes that revenue forecast into chatgpt:

— you don't know that it's him  
— you don't know what is being sent  
— you don't know if he has permission to access that model or send that data  
— you can't control how much money is spent on model calls  
— you can't audit the call or prove compliance e.g., with HIPAA or SOX  

there's nothing preventing him from sending it, no cryptographic proof it was Oscar. just a shared key that could be anyone.

### why this matters... now

mcp servers are proliferating. openai's apps sdk and anthropic's mcp are making it trivial to give llms access to tools and data. but the identity and governance layer is still homegrown.

this worked fine when llms were isolated experiments. but as they become:
- multi-user production systems  
- integrated with sensitive data
- subject to compliance requirements
- billed per-user or per-call

the lack of a standard trust layer becomes a risk and bottleneck.

### what i'm thinking

it occurred to me that identity is just the first of a set of modular components of the same system - the trust and governance agentic control plane. 

the core insights are:

1. llm apps are three-party systems (user ↔ llm ↔ backend) with no standard identity layer binding them together
2. that identity is a prerequisite for governance.

and i am curious... 
- is there any known standard emerging to bridge user ↔ LLM ↔ backend identity? 
- or are most teams just rolling their own?

curious what others are doing. is your team hitting these issues? how are you solving them?

so… what did your team send to chatgpt today?

---
*david crowe - [reducibl.com](https://reducibl.com) - working on this at [gatewaystack.com](https://gatewaystack.com)*