import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LiteProgressStepper } from "@/components/worksheet-lite/LiteProgressStepper";

export const Route = createFileRoute("/learn/worksheet-lite")({
  component: WorksheetLiteLayout,
});

function WorksheetLiteLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-canvas-base text-text-primary">
      <div className="relative z-10 flex flex-col flex-1">
        <header className="sticky top-0 z-40 border-b border-border-hairline bg-canvas-base">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Logo size={32} />
              <span className="font-display font-semibold tracking-[-0.01em] text-text-primary">
                PainMap
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                / Condensed
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <LiteProgressStepper />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
