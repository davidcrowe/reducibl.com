---
layout: post
title: "i automated my build logs with AI"
description: "how i use gemini to turn claude code transcripts into daily build logs"
---

*originally posted to linkedin*

i've been building in public for a while now. 

writing build logs every day? that was never going to happen.

*so i automated it.*

### the problem

i use claude code for most of my development work. at the end of every session, there's a transcript — everything i built, broke, debugged, and shipped.

that transcript is gold. it's exactly what happened, in order, with full context.

but it's also 10,000+ lines of raw conversation. not something anyone wants to read.

### the solution

i built a pipeline that turns those transcripts into readable build logs:

1. a cron job syncs my claude code transcripts to cloud storage
2. a cloud function reads the day's work -- transcripts and screenshots
3. gemini extracts the interesting parts and writes a draft in my voice, based on prior posts
4. i review, approve, and it commits directly to my site's repo

the whole thing runs automatically. i just approve and publish.

for example, yesterday’s log detailed building out a web app from enriching data to building ux to adding plausible analytics.

### why this matters

**writing builds trust.** the whole point of putting work out there is to build trust with collaborators and clients. people want to see how you think, what you build, and whether you're someone they want to work with.

**what you do every day is content.** we're all doing interesting work — the problem is capturing it. i'm a builder, not a writer. but the work i do every day *is* content, if i can extract it without burning hours on prose.

**AI documenting AI-assisted development is poetic.** i use claude to build. gemini to document. the machines are writing the story of how they helped me ship.

### the meta lesson

the best automations don't replace what you do — they capture what you're already doing and make it useful.

i was already building. now i have a record of it, published daily, with zero extra effort.

check out the build logs at [reducibl.com/buildlogs](https://reducibl.com/buildlogs).

---
*david crowe - [reducibl.com](https://reducibl.com) - [gatewaystack.com](https://gatewaystack.com)*
