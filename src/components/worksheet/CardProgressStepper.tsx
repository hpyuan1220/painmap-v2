/**
 * CardProgressStepper — 13 步進度條 + Result Pain ID 卡片 (v3.0)
 *
 * 唯一目的：讓使用者知道自己在哪、之前完成了哪幾張、後面還有哪幾張。
 * 不是排名工具、不是評分工具、不是激勵工具。
 *
 * 不顯示：完成度百分比、剩餘預估時間、與其他使用者的比較。
 */

import { Link, useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { memo } from "react";

import { usePainCardStore } from "@/store/painCard";
import type { CurrentStep } from "@/types/painCard";
import { STEP_LABELS } from "@/types/painCard";
import { cn } from "@/lib/utils";

type StepNum = Exclude<CurrentStep, "result">;

const STEPS: StepNum[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const TOTAL = STEPS.length;

type StepState = "completed" | "current" | "locked";

function order(s: CurrentStep): number {
  return s === "result" ? 14 : s;
}

function stateOf(step: StepNum, current: CurrentStep, maxReached: CurrentStep): StepState {
  if (step === current) return "current";
  return order(step) <= order(maxReached) ? "completed" : "locked";
}

const STEP_PATHS: Record<StepNum, string> = {
  1: "/learn/worksheet/01",
  2: "/learn/worksheet/02",
  3: "/learn/worksheet/03",
  4: "/learn/worksheet/04",
  5: "/learn/worksheet/05",
  6: "/learn/worksheet/06",
  7: "/learn/worksheet/07",
  8: "/learn/worksheet/08",
  9: "/learn/worksheet/09",
  10: "/learn/worksheet/10",
  11: "/learn/worksheet/11",
  12: "/learn/worksheet/12",
  13: "/learn/worksheet/13",
};

/** 從 URL pathname 解析出目前在哪一卡 */
function stepFromPath(pathname: string, fallback: CurrentStep): CurrentStep {
  const m = pathname.match(/\/learn\/worksheet\/(\d{2})/);
  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 13) return n as StepNum;
  }
  if (pathname.includes("/learn/worksheet/result")) return "result";
  return fallback;
}

export function CardProgressStepper() {
  const maxReached = usePainCardStore((s) => s.card.current_step);
  const { pathname } = useLocation();
  const current = stepFromPath(pathname, maxReached);
  const resultState: StepState =
    current === "result"
      ? "current"
      : order(maxReached) >= 14
        ? "completed"
        : "locked";

  const currentDisplay =
    current === "result" ? "DONE" : String(current).padStart(2, "0");

  return (
    <nav
      aria-label="痛點訪談陪伴本進度"
      className="w-full border-b border-border-hairline bg-canvas-base"
    >
      {/* Mobile: 折疊文字 */}
      <div className="md:hidden flex items-center justify-between px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          Card <span className="text-text-primary tabular-nums">{currentDisplay}</span>
          {current !== "result" && ` / ${TOTAL}`}
        </span>
        <span className="text-[13px] text-text-secondary truncate max-w-[60%]">
          {current === "result" ? "Pain ID" : STEP_LABELS[current as StepNum]}
        </span>
      </div>

      {/* Desktop / Tablet: 水平 stepper */}
      <ol className="hidden md:flex items-start justify-between gap-0.5 px-6 py-5 max-w-7xl mx-auto overflow-x-auto">
        {STEPS.map((step, i) => {
          const state = stateOf(step, current, maxReached);
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step} className="flex items-start min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <StepDot step={step} state={state} />
                <span
                  className={cn(
                    "mt-2 font-mono text-[9px] uppercase tracking-[0.05em] truncate max-w-[64px] text-center",
                    state === "completed" && "text-text-secondary",
                    state === "current" && "text-text-primary",
                    state === "locked" && "text-text-tertiary",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-px w-4 mt-3.5 mx-0.5 transition-colors",
                    order(step) < order(maxReached)
                      ? "bg-text-primary/60"
                      : "bg-border-hairline",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
        {/* Result Pain ID 卡片 */}
        <li className="flex items-start">
          <div
            className={cn(
              "h-px w-4 mt-3.5 mr-0.5 transition-colors",
              order(maxReached) >= 14
                ? "bg-text-primary/60"
                : "bg-border-hairline",
            )}
            aria-hidden
          />
          <div className="flex flex-col items-center">
            <Link
              to="/learn/worksheet/result"
              aria-label="Pain ID 卡片 (結尾)"
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-medium transition-all duration-200",
                resultState === "completed" || resultState === "current"
                  ? "bg-text-primary text-text-inverse"
                  : "border border-border-hairline bg-canvas-raised text-text-tertiary hover:border-border-default",
              )}
            >
              ◆
            </Link>
            <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.05em] text-text-tertiary">
              Pain ID
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

const StepDot = memo(function StepDot({ step, state }: { step: StepNum; state: StepState }) {
  const baseClasses =
    "h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 font-mono text-[10px] tabular-nums";
  const label = String(step).padStart(2, "0");

  if (state === "locked") {
    return (
      <div
        aria-label={`Card ${label}（鎖定）`}
        className={cn(
          baseClasses,
          "border border-border-hairline bg-canvas-raised text-text-tertiary",
        )}
      >
        {label}
      </div>
    );
  }

  if (state === "completed") {
    return (
      <Link
        to={STEP_PATHS[step]}
        aria-label={`Card ${label}（已完成）`}
        className={cn(
          baseClasses,
          "border border-text-primary/40 bg-surface-active text-text-primary hover:bg-surface-active hover:border-text-primary",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
      </Link>
    );
  }

  // current
  return (
    <Link
      to={STEP_PATHS[step]}
      aria-current="step"
      aria-label={`Card ${label}（進行中）`}
      className={cn(baseClasses, "bg-text-primary text-text-inverse")}
    >
      {label}
    </Link>
  );
});
