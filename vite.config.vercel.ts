/**
 * Vercel SPA build config.
 *
 * Why this file exists:
 * - `vite.config.ts` uses `@lovable.dev/vite-tanstack-config` which bundles
 *   Cloudflare Workers as the deploy target. That output cannot run on Vercel.
 * - For the Vercel deploy we build a plain client-side SPA: vanilla Vite +
 *   the TanStack Router plugin (file-based routing) + the React plugin +
 *   Tailwind. No SSR, no Cloudflare adapter.
 *
 * Entry: src/client.tsx via index.html (only the Vercel build reads this file —
 *        the Cloudflare/lovable build path emits its own HTML at runtime).
 * Output: dist-vercel/   (separate from dist/ so the two builds never collide)
 * Run via `npm run build:vercel`.
 */

import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-vercel",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});
