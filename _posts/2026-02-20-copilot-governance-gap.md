---
layout: post
title: "the governance controls existed"
description: "they lived inside the system that failed"
permalink: /copilot-governance-gap
image: /assets/copilot-blog-header.png
---

this week microsoft confirmed a bug ([CW1226324](https://www.theregister.com/2026/02/18/microsoft_copilot_data_loss_prevention)) in microsoft 365 copilot chat. the root cause: a code issue that caused copilot to surface emails from users' sent items and draft folders despite sensitivity labels and data loss prevention (dlp) policies configured to prevent exactly that. imagine being the compliance lead who discovers your ai assistant is summarizing confidential merger and acquisition or financial forecast emails — even when every governance setting is configured correctly.

microsoft's response is worth examining closely. a spokesperson said this ["did not provide anyone access to information they weren't already authorised to see."](https://cybersecuritynews.com/microsoft-365-copilot-bug/)

that framing draws the authorization boundary at access permissions — can this user's account reach this mailbox item? yes. so in microsoft's view, nothing went wrong.

but organisations apply sensitivity labels precisely because access permissions aren't enough. a user may have access to a document but policy says an ai assistant shouldn't be able to summarize it, extract it, or surface it in a chat window. that's what dlp is for. that's what sensitivity labels are for. these are governance controls, not access controls — and they failed silently.

## where the governance layer needs to live

the question this incident raises isn't "why did microsoft have a bug?" code defects happen. the question is: why was there nothing outside microsoft's stack to catch it?

every control in this scenario — identity, access, policy evaluation, data classification, and ai processing — lived inside a single vendor's pipeline. when one component failed, every downstream control failed with it. the access check passed. the policy check should have blocked the content but didn't. and there was no independent layer in between to say: this content cleared access control but should have been filtered by policy before the ai could process it.

this is the architectural pattern that makes ai governance brittle. it's not unique to microsoft. any system where the vendor that processes the data is also the vendor that enforces the policies around that data has the same single point of failure. a bug, a misconfiguration, a regression in a quarterly update — any of these can collapse both layers simultaneously.

the alternative is to separate enforcement from processing. run identity verification, data classification, and policy validation outside the vendor pipeline — before content reaches the ai. not as a step inside the vendor's processing chain, but as an external gate that runs before the vendor's pipeline begins. the policy decision happens independently of the system being governed.

## gatewaystack

this is the problem i've been building [gatewaystack](https://github.com/davidcrowe/GatewayStack) to solve. it sits between ai clients and your backend as an independent governance layer — so that a single vendor's code defect can't silently bypass the policies your organisation set.

not because microsoft was negligent. because the layer that enforces data governance needs to be architecturally independent of the system that processes the data.

questions or want to talk through your specific deployment? [office hours](/build).

---

## references

- [copilot chat bug bypasses dlp on 'confidential' email](https://www.theregister.com/2026/02/18/microsoft_copilot_data_loss_prevention) — the register
- [microsoft 365 copilot flaw allows ai assistant to summarize sensitive emails](https://cybersecuritynews.com/microsoft-365-copilot-bug/) — cybersecurity news
- [microsoft 365 copilot vulnerability exposes sensitive emails to ai summarization](https://cyberpress.org/microsoft-365-copilot-vulnerability-exposes-sensitive-emails-to-ai-summarization/) — cyberpress
- [how microsoft 365 copilot works — architecture](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture) — microsoft learn
- [data, privacy, and security for microsoft 365 copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy) — microsoft learn

## further reading

- [your ai agents are acting on behalf of your users](/writing/the-three-party-identity-gap) — and your backend systems have no idea who they are
- [the three-party identity problem in mcp servers](/writing/the-three-party-identity-problem-in-mcp-servers) — the origin of this problem: no shared identity layer between the user, the llm, and your backend
- [gatewaystack on github](https://github.com/davidcrowe/GatewayStack)
- [managed version of gatewaystack](https://agenticcontrolplane.com))
