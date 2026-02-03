/**
 * Global TypeScript declarations
 *
 * Copy this to src/types/global.d.ts in new projects.
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export {};
