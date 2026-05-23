/**
 * GitHub Pages SPA build config.
 *
 * Why this file exists:
 * - GitHub Pages serves at `https://<user>.github.io/<repo>/` — a sub-path,
 *   not the domain root. Assets and router URLs must be prefixed accordingly.
 * - This config mirrors `vite.config.vercel.ts` (vanilla Vite + TanStack
 *   router plugin + React + Tailwind) but adds `base: "/painmap-v2/"` so all
 *   emitted asset paths and the TanStack router's basepath line up with the
 *   GH Pages URL.
 *
 * Entry: src/client.tsx via index.html (shared with the Vercel build).
 * Output: dist-ghpages/   (separate from dist/ and dist-vercel/).
 * Run via `npm run build:ghpages`.
 */

import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Path the app will live under on GitHub Pages.
  // If you fork this to a different repo name, change this to match.
  base: "/painmap-v2/",
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
    outDir: "dist-ghpages",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});
