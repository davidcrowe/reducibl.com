---
layout: post
title: "the governance controls existed"
description: "they lived inside the system that failed"
permalink: /copilot-governance-gap
image: /assets/copilot-blog-header.png
---

imagine a compliance lead at a fortune 500 — let's call her sarah — gets a slack message from her ceo's ea.

"did you know copilot can pull up draft emails?"

sarah opens microsoft 365 copilot and asks it to summarize recent executive communications about a pending acquisition. it returns drafts. confidential ones. emails marked with sensitivity labels that should have excluded them from ai summarization.

she checks the labels. set correctly. she checks the data loss prevention (dlp) policies. all in place. everything configured exactly as microsoft's documentation says it should be.

it doesn't matter. the governance controls exist — but they live inside the same system that failed.

this scenario is fictional, but the underlying bug is real. microsoft confirmed it this week (tracked as [CW1226324](https://www.theregister.com/2026/02/18/microsoft_copilot_data_loss_prevention)) after reporting forced the disclosure. the root cause: a code issue that caused copilot to surface emails from users' sent items and draft folders despite sensitivity labels that should have excluded them. dlp policies and sensitivity labels were configured correctly and bypassed entirely.

microsoft's response is worth examining closely. a spokesperson said this ["did not provide anyone access to information they weren't already authorised to see."](https://cybersecuritynews.com/microsoft-365-copilot-bug/)

microsoft is drawing the authorization boundary at access permissions — can sarah's account reach this mailbox item? yes. so in their framing, nothing went wrong.

but that misses the entire point of sensitivity labels. organisations apply them precisely because access permissions aren't enough. a user may have access to a document but policy says an ai assistant shouldn't be able to summarize it, extract it, or surface it in a chat window. that's what dlp is for. that's what sensitivity labels are for.

when the system enforcing those policies is the same system processing the data, a single code defect collapses both layers simultaneously. the access check passes. the policy check should have blocked the content but didn't. and there's no independent layer to catch the gap.

## the architectural problem

it's not that microsoft didn't build governance controls. they did. it's that every control — identity, access, policy evaluation, and data processing — lives inside the same vendor stack. when one component fails, there's no external checkpoint to say: this content passed access control but should have been filtered by policy before the ai could process it.

the alert was [reposted on nhs it support portals](https://cybersecuritynews.com/microsoft-365-copilot-bug/), where it was logged as INC46740412. in a separate development the same week, the european parliament's it department reportedly blocked built-in ai features on staff devices, citing [longstanding concerns about data sovereignty](https://cyberpress.org/microsoft-365-copilot-vulnerability-exposes-sensitive-emails-to-ai-summarization/) and confidential correspondence being processed through cloud ai services. these are different events, but they point in the same direction: organisations are discovering that their policy enforcement has a single point of failure.

## what independent enforcement looks like

this is the problem i've been building [gatewaystack](https://github.com/davidcrowe/GatewayStack) to solve. it sits between ai clients and your backend as an independent governance layer. identity verification, data classification, and policy validation all run outside the vendor pipeline — before any content reaches the llm. the policy check isn't a step inside the ai vendor's processing pipeline. it's an external gate that runs before the vendor's pipeline begins.

not because microsoft was negligent — code defects happen. because the layer that enforces data governance needs to be independent of the system that processes the data.

no compliance lead should need to trust that every vendor's code is flawless to know their sensitivity labels are enforced.

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
