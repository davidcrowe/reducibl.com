# New App Checklist

Use this when spinning up a new consumer app (Next.js pattern).

## 1. Project Setup

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

## 2. CLAUDE.md

Create `CLAUDE.md` in project root with:

```markdown
# my-app

## What This Is
One-liner description

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Deployed via static export / Vercel

## Key Files
- src/app/layout.tsx — Plausible analytics, global styles
- src/app/page.tsx — Landing page
- src/components/WaitlistForm.tsx — Email capture with Plausible

## Commands
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # production build

## Analytics
- Plausible (self-hosted at analytics.reducibl.com)
- Domain: myapp.com
- Events: Form: Submission, Waitlist Signup, Outbound Link: Click

## Waitlist
- API: https://us-central1-trim-glazing-445021-n8.cloudfunctions.net/joinWaitlist
- Source param: "myapp"

## Notes
- never add co-authored-by to commits
```

## 3. Plausible Analytics

### Add site to Plausible dashboard
1. Go to analytics.reducibl.com
2. Add new site with domain

### Update layout.tsx

```tsx
<head>
  <script
    defer
    data-domain="myapp.com"
    src="https://analytics.reducibl.com/js/script.js"
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
    }}
  />
</head>
```

### Add TypeScript declaration

Create `src/types/global.d.ts`:

```typescript
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}
export {};
```

### Set up goals in Plausible
- Custom Event: `Form: Submission`
- Custom Event: `Waitlist Signup`
- Custom Event: `Outbound Link: Click`
- Pageview: `/` (or key conversion page)

## 4. WaitlistForm Component

Copy from `reducibl/_templates/WaitlistForm.tsx` to `src/components/WaitlistForm.tsx`

Update:
- `source` prop default to match your app
- Colors/styling to match brand

## 5. Sentry (Optional but Recommended)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
```

## 6. Environment Variables

Create `.env.local`:
```
# Analytics (if using env var approach)
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=https://analytics.reducibl.com/js/script.js

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=

# App-specific
```

Create `.env.example` (committed to repo):
```
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=
NEXT_PUBLIC_SENTRY_DSN=
```

## 7. Deployment

### For static export (GitHub Pages, Firebase Hosting):

Add to `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
```

### For Vercel:
- Connect repo to Vercel
- Set environment variables in Vercel dashboard

## 8. Uptime Monitoring (Optional)

For static sites, use external monitoring:
- UptimeRobot (free tier)
- Pingdom
- Better Uptime

Set up alert for main page returning non-200.

---

## Quick Copy Commands

```bash
# Create types directory and global.d.ts
mkdir -p src/types
cp ~/reducibl/_templates/global.d.ts src/types/

# Copy WaitlistForm
cp ~/reducibl/_templates/WaitlistForm.tsx src/components/

# Copy Sentry configs (if using)
cp ~/reducibl/_templates/sentry.client.config.ts .
cp ~/reducibl/_templates/sentry.server.config.ts .
```

---

## Verification Checklist

- [ ] CLAUDE.md exists and is accurate
- [ ] Plausible script in layout.tsx with data-domain
- [ ] Plausible init function for custom events
- [ ] global.d.ts with plausible type
- [ ] WaitlistForm has tracking calls
- [ ] Site added to Plausible dashboard
- [ ] Goals configured in Plausible
- [ ] .env.example committed (no secrets)
- [ ] .env.local in .gitignore
- [ ] Sentry configured (if using)
- [ ] Tested locally: form submits, events fire
