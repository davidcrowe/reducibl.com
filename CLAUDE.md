# reducibl.com

## What This Is

Personal brand and consulting site for David Crowe — applied AI studio offering consulting, apps, and infrastructure.

**Positioning:** "Complexity is reducibl" — even the most complex AI systems can be reduced to core components.

## Site Sections

- **Homepage** — Studio intro, project gallery, consulting pitch
- **Build logs** — Auto-generated daily notes from Claude Code sessions
- **Writing** — Long-form posts on AI systems
- **/build** — "Work with me" page with pricing and intake form

## Products Showcased

| Product | Domain | Description |
|---------|--------|-------------|
| **Inner** | innerdreamapp.com | Dream journaling and emotional memory for LLMs |
| **Apprentice** | learnart.app | AI-powered art study and analysis |
| **GatewayStack** | gatewaystack.com | Trust and governance layer for AI systems |

---

## Stack

- Jekyll (static site generator)
- Markdown content
- Deployed to GitHub Pages
- Chatflow widget for intake form

## Key Files

- `_layouts/default.html` — Main layout with Plausible analytics, styles
- `_layouts/post.html` — Post layout with auto-generated note for build logs
- `index.md` — Homepage with project cards, consulting pitch
- `build.html` — "Work with me" page with pricing and intake
- `buildlogs.md` — Build log index
- `writing.md` — Writing index
- `_posts/*.md` — Blog posts and build logs

## Commands

```bash
bundle install           # install dependencies
bundle exec jekyll serve # local dev server (localhost:4000)
bundle exec jekyll build # production build to _site/
```

## Analytics

- Plausible (self-hosted at analytics.reducibl.com)
- Domain: reducibl.com
- Events: Project Click, Form: Submission, Waitlist Signup, Outbound Link: Click
- Goal: `/build` pageview

## Consulting Model

1. **Intro call** — 45 minutes, free, includes live building demo
2. **Paid sessions** — 4-hour blocks ($1,200) or 8-hour blocks ($2,000)
3. **Fractional** — Ongoing arrangements for running systems, shipping features

## Notes

- never add co-authored-by or cite yourself in commits
- lowercase aesthetic throughout
- build logs are auto-generated from Claude Code transcripts via Gemini

## Proactive Reviews

After completing significant work, independently kick off reviews for:
- **Security**: Review for XSS, injection, exposed secrets, auth issues
- **Performance**: Check for unnecessary re-renders, large bundles, unoptimized images
- **Edge cases**: What happens with empty states, errors, slow networks?
- **Accessibility**: Keyboard navigation, screen reader support, color contrast

Periodically audit the codebase for:
- Dead code and unused dependencies
- Inconsistent patterns that should be unified
- Missing error boundaries or error handling
- Opportunities to simplify

## Self-Maintaining CLAUDE.md

Proactively propose additions to this file when you notice:
- **Architectural decisions** — Why something was built a certain way
- **Anti-patterns** — Things that were tried and didn't work
- **Domain knowledge** — User journeys, what matters most, product context
- **Code patterns** — Conventions to follow for consistency
- **Known tech debt** — Intentional shortcuts that should be fixed later
- **Environment quirks** — Build steps, deployment gotchas, tooling issues
