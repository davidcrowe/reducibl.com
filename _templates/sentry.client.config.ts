/**
 * Sentry Client Config
 *
 * Copy to project root as sentry.client.config.ts
 *
 * Setup:
 * 1. npm install @sentry/nextjs
 * 2. Create project at sentry.io (free tier)
 * 3. Copy DSN and replace below
 * 4. Run: npx @sentry/wizard@latest -i nextjs
 *    (This creates necessary config files)
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring sample rate (0.0 to 1.0)
  tracesSampleRate: 0.1,

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Don't send PII
  sendDefaultPii: false,

  // Environment tag
  environment: process.env.NODE_ENV,
});
