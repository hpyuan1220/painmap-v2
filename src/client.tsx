/**
 * client.tsx — CSR-only bootstrap for the Vercel SPA build.
 *
 * The default TanStack Start build path uses the lovable preset which bundles
 * a Cloudflare Workers SSR runtime. That output is not deployable on Vercel,
 * so for the Vercel deploy we build a plain client-side SPA using
 * `vite.config.vercel.ts` and this entry.
 *
 * Behavior: render the same TanStack Router app, but skip the hydration path —
 * mount fresh into <div id="root">. All data is in LocalStorage anyway, so
 * there's no SSR data loss.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Missing <div id=\"root\"></div> in index.html");
}

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
