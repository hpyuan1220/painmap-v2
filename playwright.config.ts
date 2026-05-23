import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — happy-path E2E for the worksheet.
 *
 * Setup: `npx playwright install chromium` (downloads the chromium binary, ~150MB)
 *
 * Run:   `npm run test:e2e`            (headless)
 *        `npm run test:e2e -- --ui`    (interactive)
 *
 * Notes:
 * - Specs live under `e2e/` (kept outside `src/` so vitest doesn't try to run them).
 * - Dev server boots on port 5173 via `vite dev`. Playwright reuses the server if already running.
 * - Only chromium is wired up. Mobile/Firefox/Safari profiles can be added per spec when needed.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
