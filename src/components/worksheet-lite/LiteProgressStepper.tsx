import { Link, useLocation, useSearch } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { getWorksheetFlowConfig } from "@/lib/worksheetFlowRegistry";
import { cn } from "@/lib/utils";
import { usePainCardStore } from "@/store/painCard";

export function LiteProgressStepper() {
  const search = useSearch({ strict: false });
  const flowId = search.flow === "ai-detective" ? "ai-detective" : "lite";
  const flow = getWorksheetFlowConfig(flowId);
  const steps = flow.steps.map((item) => item.step);
  const maxReached = usePainCardStore((s) => Math.min(s.card.current_step, flow.stepCount));
  const { pathname } = useLocation();
  const match = pathname.match(/\/learn\/worksheet-lite\/(\d{2})/);
  const current = match ? Number(match[1]) : maxReached;
  const onResult = pathname.includes("/learn/worksheet-lite/result");

  return (
    <nav className="w-full border-b border-border-hairline bg-canvas-base" aria-label="Flow 進度">
      <div className="md:hidden flex items-center justify-between px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          Card{" "}
          <span className="text-text-primary">
            {String(onResult ? flow.stepCount : current).padStart(2, "0")}
          </span>
          {` / ${String(flow.stepCount).padStart(2, "0")}`}
        </span>
        <span className="text-[13px] text-text-secondary truncate max-w-[60%]">
          {flow.steps.find((item) => item.step === (onResult ? flow.stepCount : current))?.label}
        </span>
      </div>

      <ol className="hidden md:flex items-start justify-between gap-1 px-8 py-5 max-w-6xl mx-auto">
        {steps.map((step, index) => {
          const completed = step < current || onResult || step < maxReached;
          const active = !onResult && step === current;
          return (
            <li key={step} className="flex-1 flex items-start min-w-0">
              <div className="flex flex-col items-center min-w-0 flex-1">
                <Link
                  to={`/learn/worksheet-lite/${String(step).padStart(2, "0")}` as never}
                  search={{ flow: flowId } as never}
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
                  {flow.steps.find((item) => item.step === step)?.label}
                </span>
              </div>
              {index < steps.length - 1 && (
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
            to="/learn/worksheet-lite/result"
            search={{ flow: flowId } as never}
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
