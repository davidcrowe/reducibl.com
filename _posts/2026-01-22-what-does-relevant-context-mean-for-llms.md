---
layout: post
title: "what does ‘relevant context’ really mean for LLM applications?"
description: "want to know? learn from a human"
---

*originally posted to linkedin*

quick experiment: how long can you stand on one leg with your eyes closed? now try with your eyes open. 

a lot easier with your eyes open, huh? **when your eyes are closed, you’re missing a critical input.** 

everyone knows that getting the inputs right matters. for llms that input is context. providing relevant context results in better llm responses. 

### what does relevant context mean exactly?

given a data set, there are technical strategies to determine the most relevant context to include. 

but what if the context you need sits outside of the given data set?

*how do you know what you don’t know?*

### learn from a human

many AI applications automate something that was previously done manually. 

**if you want to assess whether you’re giving an AI comprehensive inputs, learn from a human. consider what context they use to do the job manually.**

*are you providing all of that context to the AI system when you ask it to do the job?*

if not, the system may appear to work while missing critical context a human relies on -- making early success potentially misleading and increasing exposure to edge failures.

### let’s make this concrete

last year when we launched [inner](https://www.innerdreamapp.com/app) — an emotional intelligence coaching app — our LLM responses returned technically strong content, but they didn’t quite “feel” right. whether it was tone or otherwise, something was off. 

so we thought through how our AI workflow compared to similar manual workflows. 

the key insight: *emotional intelligence coaching requires context across many chat sessions*. the relationship between events over time mattered and limiting context to a single session limited performance.  

once we began providing context from relevant past conversations — not just the current session — the response quality increased dramatically.

so even if your application seems to be performing well today, it’s worth asking…

**how robust is your system to the range of situations a human would naturally adapt to for the use case?**
