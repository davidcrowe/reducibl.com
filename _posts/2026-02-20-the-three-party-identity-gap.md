---
layout: post
title: "your ai agents are acting on behalf of your users"
description: "and your backend systems have no idea who they are"
permalink: /writing/the-three-party-identity-gap
---

your team shipped an ai agent. it connects to slack, reads emails, queries your crm, opens tickets. users love it. it's saving hours a week.

here's the question nobody asked during the build: when that agent calls your backend api, what does your api think is happening?

the answer, in almost every enterprise deployment today: your api sees a request from a service account. it grants access based on that service account's permissions. it logs the action against that service account. and it has no idea which user actually initiated the request, whether that user authorized this specific action, or whether the agent was operating within the scope the user intended.

this isn't a configuration mistake. it's how every major agent framework works today.

## what your security team thinks is happening

your users authenticate. your systems check permissions. actions are logged against identities. you can audit who did what and when.

this model has worked for decades because the entities taking actions were humans, or software systems your team built and controlled.

ai agents break this model at the foundation. an agent isn't a user and it isn't a traditional service. it's a third party — operating between your user and your backend — that your access control systems were never designed to reason about.

## what's actually happening

when a user asks your ai agent to "send a summary to the team," the chain looks like this:

1. user sends a message to the agent
2. agent decides to call your email api
3. agent calls the api using a service credential — typically a static token your team configured during setup
4. your email api receives the request, sees a valid credential, sends the email
5. your logs show: `service-account-ai-agent sent email at 14:32`

what your logs don't show: which user initiated this. whether they intended to send it to this distribution list. whether the agent correctly understood the scope of "the team." whether this was the first time this happened or the hundredth.

if something goes wrong — wrong recipient, sensitive content, unauthorized action — your audit trail points to a service account. the actual decision chain is gone.

## why this matters beyond logging

this isn't just an audit problem. it's an authorization problem.

your access control policies are built around user identity. a user in the finance role can access financial records. a user in the support role cannot. these rules exist for good reasons — compliance, data protection, regulatory requirements.

your ai agent typically runs with credentials that cut across these boundaries. it has to — otherwise it can't serve users across different roles and contexts. but that means the agent's permissions are almost always broader than any individual user's permissions.

security researchers call this the [confused deputy problem](https://www.hashicorp.com/en/blog/before-you-build-agentic-ai-understand-the-confused-deputy-problem): a trusted intermediary with elevated privileges gets tricked — or simply misconfigured — into taking actions that the user it's acting for would not have been permitted to take directly.

in a human system, this is an edge case. in an agentic system, it's the default architecture.

## the question your next audit will ask

regulators and auditors are catching up to this. the questions are coming:

- when your ai agent accessed that customer record, was the user who initiated the request authorized to access it?
- when your agent sent that communication, did the initiating user explicitly authorize that specific action?
- can you produce a complete delegation chain — user to agent to action — for any agent-initiated event in your system?

"the agent did it" is not an answer. it's an audit finding.

gdpr articles 5(2) and 15 require accountability and meaningful information about the logic of automated processing. sox section 404 requires internal controls with audit trails over financial reporting. hipaa §164.528 requires accounting of disclosures of protected health information. none of these regulations were written with ai agents in mind, but all of them apply when an agent accesses covered data on behalf of a user.

## what good looks like

the fix isn't complicated conceptually. it's hard to implement consistently across an enterprise.

what you need: every time an agent calls a backend system on behalf of a user, that call should carry verified proof of three things — who the user is, what they authorized the agent to do, and that this specific action falls within that authorization. the backend system should validate all three before acting.

concretely: instead of your agent calling your email api with `Authorization: Bearer <service-account-token>`, the call carries a scoped delegation token — something like a jwt with claims for `sub` (the user), `actor` (the agent), `scope` (the permitted action), and `aud` (the target api). your backend validates all four claims before acting. the audit trail captures the full chain: user → agent → scoped action → api response.

this means user identity needs to flow through the agent layer to the api boundary. it means authorization needs to be scoped to the action, not just the service account. it means the audit trail needs to capture the full chain, not just the last hop.

the mcp spec is moving in this direction, but no major agent framework ships delegated identity propagation as a default today. the gap between what the spec envisions and what production deployments actually implement is where the risk lives.

## what to do now

three things worth doing before this becomes a finding:

**inventory your agent's backend access.** list every api, database, and service your agent can call. for each one, ask: what credential does it use? what permissions does that credential have? could the agent use that credential to take actions on behalf of a user that the user couldn't take directly?

**map your authorization assumptions.** your existing access control policies assume human users making direct requests. document where those assumptions break down when requests are mediated by an agent. that gap is your exposure.

**define your audit requirement.** before your next deployment, decide what a complete audit trail looks like for an agent-initiated action. if you can't answer "who authorized this?" for every action your agent takes, you have a compliance gap — even if you don't have a breach.

the agent ecosystem is maturing fast. runtime security — session management, tool authorization, plugin containment — is getting addressed by the frameworks. the backend identity problem is structural and it's coming to you regardless of which runtime your team chose.

the teams that get ahead of it now will have a significant advantage when the auditors arrive.

questions or want to talk through your specific deployment? [office hours](/build).

---

## further reading

- [the three-party identity problem in mcp servers](/writing/the-three-party-identity-problem-in-mcp-servers) — the origin of this problem: no shared identity layer between the user, the llm, and your backend
- [1-line jwt/jwks verification for mcp backends](/writing/one-line-jwt-jwks-verification-for-mcp-backends) — practical implementation of scoped identity propagation with gatewaystack's identifiabl module
- [before you build agentic ai, understand the confused deputy problem](https://www.hashicorp.com/en/blog/before-you-build-agentic-ai-understand-the-confused-deputy-problem) — hashicorp on why traditional service auth breaks with agents
- [the looming authorization crisis: why traditional iam fails agentic ai](https://www.isaca.org/resources/news-and-trends/industry-news/2025/the-looming-authorization-crisis-why-traditional-iam-fails-agentic-ai) — isaca on the structural iam gap
- [security risks of agentic ai: an mcp introduction](https://businessinsights.bitdefender.com/security-risks-agentic-ai-model-context-protocol-mcp-introduction) — bitdefender's analysis of mcp's missing user context
- [engineering gdpr compliance in the age of agentic ai](https://iapp.org/news/a/engineering-gdpr-compliance-in-the-age-of-agentic-ai) — iapp on what gdpr actually requires for agent-mediated processing
- [mcp authorization spec update (november 2025)](https://aaronparecki.com/2025/11/25/1/mcp-authorization-spec-update) — aaron parecki on oauth 2.1 and resource indicators in the latest spec
- [authenticated delegation and authorized ai agents](https://arxiv.org/html/2501.09674v1) — academic treatment of the delegation problem
