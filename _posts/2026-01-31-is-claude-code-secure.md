---
layout: post
title: "is claude code secure?"
description: "first impressions on secrets, prompt injection, and the real weak link"
---
  <img src="/assets/claude-code-security.png" alt="Claude Code responding to security concerns" />

i used claude code to build a production chatgpt app. 

and in the back of my head I can't help but ask… ***is it secure?***

not the code that claude code produces. the system itself. 

claude code is a software package. you run it in a folder on your computer, and it gives claude access to all of the files in that folder. 

so in this case, secure means preventing unwanted data access, exfiltration, and writes.

this isn’t a claude-specific problem — *it’s a new class of local-AI security risk*.

### don't trust claude with your secrets
by design, claude code only accesses files in the directory where you run the claude command. so you have full control over what claude can read. 

this sounds great. but in practice, *many devs run it at the project repo root—precisely where secrets live*. secret leakage is the most obvious real-world risk. 

depending on your project, a leaked secret could expose keys to llms, cloud providers, or databases. depending on the key, it could potentially grant full access to the system or data. for example, my project required api keys for claude, google cloud, and auth0.

the blast radius can get large (and costly) fast. there could be legal and financial implications (especially if you are in a regulated industry). 

in a world where llms are accessing local file systems, the basics become more important than ever:

— **secret management** new rule… never rely on local .env files for secret management. always manage secrets in a dedicated secret manager at the org level  
— **fine grained permissions** don't use shared api keys that expose everything. each specific use case should have fine-grained, required only permissions to minimize the blast radius, make it more observable, and easier to isolate and control if leakage occurs  

make sure you have secret management buttoned up before you unleash claude code in your org. 

### the risk hidden in plain sight… prompt injection
claude code reads your files to understand your codebase. but what if one of those files contains instructions designed to manipulate the AI?

this is called prompt injection. hidden instructions are embedded in files read by the AI, which the AI follows as if they were your commands.

this isn't theoretical. any file claude reads could contain injected instructions: a pr diff from a contributor, a dependency's readme, even a downloaded config file. the injected text could instruct claude to read your .env file and embed secrets in a commit message, a code comment, or a curl command.

*the dangerous part: you might not notice*. the output looks like normal code. the commit looks routine. but the secret is now in your git history or sent to an external server.

there is no full fix for this at the moment. it's an open problem across all AI coding tools. but there are a few things you can do to reduce the risk:

— use .claudeignore to exclude sensitive files and directories from Claude's context entirely  
— review diffs carefully before approving writes, especially when working with untrusted code  
— never auto-approve in repos with external contributions or untrusted dependencies  

### on the bright side
by default claude code asks for permission before writing data or executing a command. you need to give it permission to write to a file or to another system. 

this mirrors one promising pattern emerging in agentic systems: layered read/write controls with human-in-the-loop redundancy.

— i control Claude Code's read/write at the file and execution level on my machine  
— i control read/write for each mcp connector and tool inside of the LLM  
— the developer controls read/write at the tool level for access to their database (maybe with fine grained permissions e.g., by role)  

## a theme is emerging… people are the weak link in the security chain
claude code has many safeguards today. it will continue to add them around things like secret management and prompt injection detection. 

however, the biggest risks are and will continue to be behavioral. if teams and devs normalize auto-approve for writes and stop paying attention… the safety rails won't help.

this is the kind of risk that gets worse as teams get more comfortable and stop reading what the AI produces.

---
*david crowe - [reducibl.com](https://reducibl.com) - [gatewaystack.com](https://gatewaystack.com)*