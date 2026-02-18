---
layout: post
title: "we scanned every skill on clawhub. here's what we found."
description: "a static analysis of 7,522 AI agent skills using regex pattern matching"
permalink: /writing/we-scanned-every-skill-on-clawhub
---

last week someone [forked my governance repo to distribute malware](/writing/someone-used-my-repo-to-distribute-malware). that got me thinking about the broader supply chain. not github — the AI tool ecosystem specifically. clawhub has 7,500+ skills that people install and run with their AI agents. what's actually in them?

i decided to find out.

## the setup

important caveat upfront: this is static text analysis. regex patterns against file contents. it catches what's written in the code and documentation — hardcoded secrets, shell commands, suspicious patterns. it does not catch a skill that exfiltrates data through legitimate-looking API calls, or one that behaves differently at runtime than its source suggests. static analysis is a floor, not a ceiling.

i wrote a scanner that pulls every skill from the clawhub registry, downloads the scannable files (SKILL.md, source code, configs), and runs 40 regex patterns against them. the patterns come from published research — snyk's toxicskills report, cisco's skill scanner, kaspersky's work on indirect prompt injection. the categories cover the things you'd worry about: prompt injection, credential exfiltration, reverse shells, hardcoded secrets, obfuscated payloads, data exfil endpoints.

the whole thing runs in docker with `--network=none`. no skill code ever touches a live network. download phase pulls the files, then the container goes fully airgapped for analysis.

first pass: 7,522 skills scanned. 4,931 findings across 746 skills. 61% estimated false positive rate.

that's a lot of noise.

## the noise problem

the top triggered pattern was `api_key|token|secret` with 1,923 hits. almost all of them are documentation. every API integration skill has a SKILL.md that says something like "set your `STRIPE_API_KEY` environment variable" or shows a curl example with `$TOKEN`. that's not exfiltration. that's a readme.

the second noisiest: `webhook` with 979 hits. the word "webhook" appears in every integration skill that handles callbacks. only a handful of actual exfiltration indicators — requestbin, pipedream, hookbin, burpcollaborator — were in there. the rest is just the word "webhook."

`~/.config` triggered 400 times. almost all benign. only `~/.ssh`, `~/.env`, and `~/.aws` matter. `~/.config/openclaw/calendar.json` is not a threat.

so i built a second pass.

## deep analysis

the second-pass analyzer reads every finding, pulls the surrounding context from the actual downloaded file, and applies validation rules:

- **noise filtering**: generic "webhook" without exfil domains → noise. `~/.config` without sensitive dirs → noise.
- **placeholder detection**: if the "hardcoded secret" contains `your_api_key` or `sk-...` or `<placeholder>` → benign. if it references `process.env` → benign.
- **base64 decoding**: for every `Buffer.from(...)` match, decode the payload and check if it's a credential.
- **file location weighting**: a finding in SKILL.md (the file that instructs the AI agent) is weighted 3x. a finding in `references/README.md` is weighted 0.5x.
- **context checks**: if the match is preceded by "Example:" or lives inside a code fence in documentation → reduce confidence.

each finding gets classified into a threat category (prompt injection, RCE, credential exfil, etc.), assigned a validation status (confirmed, likely, uncertain, benign, noise), and scored.

result after deep analysis: **4,931 findings reduced to 1,397 actionable.** 72% noise reduction. 16 confirmed threats. 284 likely threats.

## what the "confirmed threats" actually are

here's where it gets interesting. i manually reviewed every confirmed threat. all 16 of them.

**zero are malicious.**

- **5 are security tools** documenting attack patterns for defensive purposes. `guardian-angel` and `indirect-prompt-injection` list "ignore previous instructions" as examples of what to *detect*, not what to *do*. `agent-tinman` shows a sample alert for SSH key exfiltration — it's the detection output, not the attack.

- **5 are benign usage**. `docker-sandbox` uses `bash -c` to run builds in isolated containers. `dns-networking` uses `/dev/tcp/` for port connectivity checks. `rose-docker-build-skill` has `bash -c` because that's how you run multi-line commands in docker.

- **4 are false positives**. `calendar-reminders` matched "print instructions" — it's telling users how to print their calendar config. `snapmaker-2` matched "override safety" — it's about overriding 3D printer safety limits, not AI safety.

- **1 is a real credential leak**. `antigravity-quota-1-1-0` has a google oauth client ID and client secret encoded in base64 inside a javascript file. the base64 values decode to valid google oauth credentials — a `GOCSPX-` prefixed client secret and a `.apps.googleusercontent.com` client ID. committed to a public skill with 562 downloads. probably unintentional, but it's there. (we've redacted the actual values and reported the issue.)

- **1 is a prompt injection example** in a backup file. `proactive-agent` has "ignore previous instructions" in `SKILL-v2.3-backup.md`. 14,488 downloads. likely a leftover from testing, not active.

## the "likely" threats

the 284 likely threats are almost entirely curl commands with API tokens in SKILL.md files. `curl -s -H "X-N8N-API-KEY: $N8N_API_KEY"` is not credential exfiltration — it's API documentation. the scanner correctly identifies that a SKILL.md file is instructing an AI agent to use curl with credentials. but that's... what API skills do.

the few genuinely interesting ones:

- `pdauth` references pipedream endpoints — a known data exfiltration service. worth investigating.
- `agent-tinman` instructs the agent to `read ~/.ssh/id_rsa` — but it's in the context of demonstrating what attacks look like, not performing them.
- several skills have hardcoded strings that look like real API keys (20+ alphanumeric chars, not matching any placeholder pattern). uncertain whether they're live credentials or just long test values.

## clawhub's own moderation

clawhub flags 978 skills as "suspicious." we found findings in 746 skills. the overlap? 315 skills. jaccard agreement: 22%.

after removing noise, it drops to 10% agreement. they're flagging different things than we are, and neither system is flagging the right things with high confidence.

clawhub missed `antigravity-quota-1-1-0` (the real credential leak). they flagged `calendar-reminders` (a false positive). the moderation layer exists but it's not doing what you'd hope.

## what this actually means

the clawhub ecosystem is cleaner than the headlines would suggest. out of 7,522 skills:

- **90.1%** had zero pattern matches of any kind
- the remaining 9.9% are overwhelmingly documentation noise
- **1 confirmed credential leak** across the entire registry
- **0 confirmed malicious skills** (in the current registry, via static analysis)

that last point comes with caveats. this is what's in the registry *right now*. anything truly malicious may have already been pulled. and static analysis only catches what's visible in text — a skill designed to be subtle wouldn't show up in regex patterns. this is a lower bound on safety, not a guarantee.

the security tools on clawhub are actually pretty good. `guardian-angel`, `indirect-prompt-injection`, `agent-tinman` — these are doing exactly what they should be doing: documenting threat patterns so AI agents can recognize and block them. the irony is that good security documentation triggers security scanners.

but "clean today" doesn't mean "clean tomorrow." the registry is growing. skills are getting more powerful — more tool access, more credential scopes, more filesystem interaction. the attack surface is expanding even if nobody's exploiting it yet.

## what we're doing about it

we're running a nightly differential scan. pull the manifest, diff against yesterday's, download and analyze only new or updated skills. if something changes, we'll know within 24 hours.

the deeper question — the one i keep coming back to — is whether regex-based scanning is the right tool for this at all. the gap between "pattern match says this is RCE" and "a human reads the context and sees it's docker build docs" is enormous. the next version of this pipeline probably needs an LLM in the loop: feed each finding its surrounding context and ask "is this genuinely malicious intent?" that's where the real signal lives.

for now, the data says the ecosystem is healthy. but the tooling to verify that didn't exist until this week.