/**
 * Health Check API Route
 *
 * Copy to: src/app/api/health/route.ts
 *
 * Note: Only works with server-side Next.js deployments (Vercel, etc.)
 * Does NOT work with static exports (output: 'export')
 *
 * For static sites, consider:
 * - External uptime monitoring (UptimeRobot, Pingdom)
 * - Checking the main page returns 200
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
