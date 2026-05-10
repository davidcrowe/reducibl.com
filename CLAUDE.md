# reducibl.com

## What This Is

Personal site for David Crowe — essays on **agent harness architecture**, identity, dispatch paths, and the protocols underneath agentic AI.

**Positioning:** Thought-leadership blog. The thinking instance of David's product work. Cross-links to [Agentic Control Plane](https://agenticcontrolplane.com), the governance product David is building.

**Tagline:** "i work with agent harnesses" — paired with disclosure that David is building ACP.

**Repositioned (2026-05):** previously framed as a consulting / "product team of one" site with sprint sessions and fixed-price packages. Pivoted to thought-leadership-only. Consulting pages (/build, /diagnostic, /offers/*) retired with HTML meta-refresh + canonical (no `redirect_from` plugin per anti-pattern note below). Build logs removed from nav and feed.

## Site Sections

- **Homepage (index.md)** — Hero with positioning + ACP cross-link, feed of recent harness-architecture essays, "what i've shipped" portfolio, about footer
- **Writing (writing.md)** — Two sections: "harness architecture" (posts tagged `harness-architecture`) and "other writing" (everything else, build logs and case studies excluded)
- **Posts** — Essays on harness architecture and adjacent topics. Posts tagged `harness-architecture` cluster on the homepage feed
- **Retired pages** — `/build`, `/diagnostic`, `/offers/*`, `/buildlogs` all serve a meta-refresh + canonical to a relevant destination (mostly homepage or ACP)

## Products (Cross-Project References)

| Product | Domain | Local Repo | Description |
|---------|--------|------------|-------------|
| **Inner** | innerdreamapp.com | ~/dream-backend | Emotional memory layer for LLMs — chatgpt app, MCP server, iOS |
| **Apprentice** | learnart.app | ~/apprentice-web | AI-powered art study across 25k+ enriched masterworks |
| **GatewayStack** | gatewaystack.com | ~/gatewaystack | Trust and governance layer — identity, permissions, audit trails |

All apps use GatewayStack for identity (Auth0 OAuth, scope-based access, per-user Firestore isolation). When referencing these products, check the relevant repo's CLAUDE.md for architecture details.

## Tagging Convention

The harness-architecture thesis is collected via a tag, not a single keystone post:

- `harness-architecture` — essays exploring an aspect of the harness layer (dispatch path, identity propagation, failure modes, protocol coverage, etc.)
- Other tags (`identity`, `protocols`, `autonomy`, `dispatch-path`) supplement it

Posts tagged `harness-architecture` cluster:
- On the homepage under "recent essays on harness architecture"
- On /writing under the "harness architecture" section (separate from "other writing")

Over time the tag's collection of posts is intended to span the whole harness territory.

## Stack

- Jekyll 4.3 (static site generator)
- Kramdown markdown processor
- Minima theme (heavily customized)
- Deployed to GitHub Pages
- Chatflow widget for intake form on /build

### CSS Custom Properties
- `--bg: #E1E6F8` (periwinkle background)
- `--heading: #231E5C` (dark purple headings)
- `--muted: #6B7280` (gray secondary text)
- `--link: #2563EB` (blue links)

## Key Files

- `_layouts/default.html` — Main layout with Plausible analytics, Open Graph, Twitter Cards, JSON-LD structured data
- `_layouts/post.html` — Post layout with build log metadata (tool counts, session stats, activity grid)
- `_layouts/case-study.html` — Case study layout with pullquote, package/client/industry/timeline metadata
- `index.md` — Homepage
- `build.html` — Work with me page with mini-nav, FAQ schema, referral section
- `buildlogs.md` — Build log index with activity grid
- `writing.md` — Writing index
- `_posts/*.md` — Build logs (category: buildlog), writing, case studies
- `_playbooks/*.md` — Internal execution guides for each package (gitignored)
- `_includes/subscribe.html` — Email signup form (posts to cloud function)
- `_includes/activity-grid.html` — GitHub-style heatmap of daily tool usage

## Build Log Automation Pipeline

1. **Cron job** — syncs Claude Code session transcripts to cloud storage daily
2. **Cloud function** — reads day's work, extracts metadata (tokens, tools, files, projects)
3. **Gemini** — drafts the log in David's voice from transcripts
4. **Email** — sends draft with inline screenshots for approval
5. **Git commit** — on approval, commits directly to this repo
6. **GitHub Pages** — auto-rebuilds the site

Screenshots stored in Firestore first — only committed after approval to prevent secrets in git history.

## Content Engine

Multi-platform content distribution in /content-engine/:
- Monday: Claude generates 5 LinkedIn-style drafts from recent build logs
- Tuesday: Pick and modify one
- Wednesday: Claude adapts to HN, Twitter, Reddit, Dev.to
- Thursday-Friday: Publish
- Weekend: Archive with performance notes

## Commands

```bash
bundle install           # install dependencies
bundle exec jekyll serve # local dev server (localhost:4000)
bundle exec jekyll build # production build to _site/
```

## Analytics

- Plausible (self-hosted at analytics.reducibl.com)
- Domain: reducibl.com
- Events: Project Click, Form: Submission, Waitlist Signup, Newsletter Signup (with source property), Outbound Link: Click
- Goal: `/build` pageview conversion

## Structured Data

All offer pages have Service JSON-LD schema. Default layout has Article/Person schema. Build page has FAQPage schema. Twitter Card and Open Graph meta tags on all pages.

## Conventions

- never add co-authored-by or cite yourself in commits
- lowercase aesthetic throughout — headings, titles, everything
- build logs are auto-generated — don't manually create posts with category: buildlog
- build log front matter must always include `sitemap: false` — build logs are excluded from the sitemap to focus crawl budget on indexable content
- never add `redirect_from` to posts — the plugin was removed to eliminate ghost stub pages that hurt indexing
- case studies use layout: case-study with front matter: pullquote, package, client, industry, timeline
- offer pages follow pattern: problem → what you get → how it works → best for → pricing → other packages → see it in action → start here

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
