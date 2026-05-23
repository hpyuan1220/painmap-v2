/**
 * Vitest global setup —
 * - wires `@testing-library/jest-dom` matchers into expect
 * - cleans up the DOM between tests (RTL auto-cleanup needs an afterEach hook)
 *
 * Picked up via `setupFiles` in `vitest.config.ts`.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
