---
layout: post
title: "don't trust the parrot"
description: "the three-party problem in agentic AI, explained with a bird"
permalink: /writing/dont-trust-the-parrot
---

<div class="version-content" data-version="linkedin" markdown="1">

*originally posted to linkedin*

imagine you have a really smart parrot.

you send it to the bank to withdraw money from your account.

the parrot flies to the bank and says: "i'd like to withdraw $200 from David's account."

but you can't just trust a parrot.

it could be lying. confused. intercepted on the way.

### guess what?

the parrot is an LLM.
your backend is the bank.
David is… David.

*that's the three-party problem.*

every team that moves an AI pilot into production hits this problem. usually the hard way. integration by integration.

### so what do you do? 

you set up a security checkpoint at the front door of the bank.

before the parrot gets anywhere near a teller:

1. **the checkpoint checks for a sealed, tamper-proof letter** from a trusted authority. the letter says "this parrot is acting on behalf of David, account #1234, and he's allowed to withdraw up to $200." the parrot can carry it but can't forge it.

2. **the checkpoint verifies the seal is real** by calling the authority that issued it.

3. **the checkpoint checks the rules** — is David allowed to do this? today? this amount?

4. **the checkpoint counts** — has this parrot already made 50 trips today? something's off.

5. **the checkpoint stamps the request** with David's verified identity and walks it to the right teller window. the teller never talks to the parrot directly.

6. **the whole transaction gets written in an immutable ledger.** who, what, when, approved or denied.

### don't trust the parrot.

verify the request.

*this is the function of an agentic control plane.*

</div>