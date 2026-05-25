import { Link, useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { LITE_STEP_LABELS, LITE_STEP_PATHS, stepFromLitePath } from "@/lib/painCardLite";
import { cn } from "@/lib/utils";
import { usePainCardStore } from "@/store/painCard";

const STEPS = [1, 2, 3, 4, 5, 6] as const;

export function LiteProgressStepper() {
  const maxReached = usePainCardStore(
    (s) => Math.min(s.card.current_step, 6) as 1 | 2 | 3 | 4 | 5 | 6,
  );
  const { pathname } = useLocation();
  const current = stepFromLitePath(pathname, maxReached);
  const onResult = pathname.includes("/learn/worksheet-lite/result");

  return (
    <nav className="w-full border-b border-border-hairline bg-canvas-base" aria-label="6 卡進度">
      <div className="md:hidden flex items-center justify-between px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          Card{" "}
          <span className="text-text-primary">
            {String(onResult ? 6 : current).padStart(2, "0")}
          </span>
          {" / 06"}
        </span>
        <span className="text-[13px] text-text-secondary truncate max-w-[60%]">
          {LITE_STEP_LABELS[(onResult ? 6 : current) as 1 | 2 | 3 | 4 | 5 | 6]}
        </span>
      </div>

      <ol className="hidden md:flex items-start justify-between gap-1 px-8 py-5 max-w-6xl mx-auto">
        {STEPS.map((step, index) => {
          const completed = step < current || onResult || step < maxReached;
          const active = !onResult && step === current;
          return (
            <li key={step} className="flex-1 flex items-start min-w-0">
              <div className="flex flex-col items-center min-w-0 flex-1">
                <Link
                  to={LITE_STEP_PATHS[step]}
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center font-mono text-[11px] transition-all",
                    active && "bg-text-primary text-text-inverse",
                    !active &&
                      completed &&
                      "border border-text-primary/40 bg-surface-active text-text-primary",
                    !active &&
                      !completed &&
                      "border border-border-hairline bg-canvas-raised text-text-tertiary",
                  )}
                >
                  {completed && !active ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    String(step).padStart(2, "0")
                  )}
                </Link>
                <span
                  className={cn(
                    "mt-2.5 font-mono text-[10px] uppercase tracking-[0.06em]",
                    active && "text-text-primary",
                    !active && completed && "text-text-secondary",
                    !active && !completed && "text-text-tertiary",
                  )}
                >
                  {LITE_STEP_LABELS[step]}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 mt-3.5 mx-1",
                    completed ? "bg-text-primary/60" : "bg-border-hairline",
                  )}
                />
              )}
            </li>
          );
        })}
        <li className="flex items-start">
          <div className="h-px w-6 mt-3.5 mr-1 bg-border-hairline" aria-hidden />
          <Link
            to={LITE_STEP_PATHS.result}
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-[12px]",
              onResult
                ? "bg-text-primary text-text-inverse"
                : "border border-border-hairline bg-canvas-raised text-text-tertiary",
            )}
          >
            ◆
          </Link>
        </li>
      </ol>
    </nav>
  );
}
