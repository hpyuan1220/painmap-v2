/**
 * CardScaffold — shared layout shell for v3 worksheet card pages.
 *
 * Renders: page title + soft instruction + slot for card-specific UI + continue button.
 *
 * UI strings come from caller (so each route stays on-brand per
 * `docs/painmap_worksheet/references/voice_and_tone.md`). This component owns
 * only structure + the "走下一張卡 →" CTA mechanism.
 */

import { useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";

import { usePainCardStore } from "@/store/painCard";
import type { CurrentStep } from "@/types/painCard";

type Props = {
  /** Step number for this card (1..13 or 'result'). */
  step: CurrentStep;
  /** Display title (e.g. "Card 1 · 那句脫口而出的話"). */
  title: string;
  /** Soft instruction copy. Multi-paragraph allowed via newlines. */
  instruction: string;
  /** Card-specific UI (form fields, AI block, etc.). */
  children?: ReactNode;
  /** Whether the card has enough content; incomplete cards show a hint but can still continue. */
  readyToContinue: boolean;
  /** Soft hint shown when not ready. Optional — defaults to a gentle prompt. */
  notReadyHint?: string;
  /** Next route path. Defaults to step+1 calculated from current step. */
  nextPath?: string;
  /** Override CTA label (e.g. last card uses「走到結尾的 Pain ID 卡片 →」). */
  ctaLabel?: string;
};

function defaultNextPath(step: CurrentStep): string {
  if (step === "result") return "/learn/worksheet/result";
  if (step >= 13) return "/learn/worksheet/result";
  const next = (step + 1) as Exclude<CurrentStep, "result">;
  return `/learn/worksheet/${String(next).padStart(2, "0")}`;
}

export function CardScaffold(props: Props) {
  const { step, title, instruction, children, readyToContinue, notReadyHint, nextPath, ctaLabel } =
    props;

  const navigate = useNavigate();
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const targetPath = nextPath ?? defaultNextPath(step);
  const label = ctaLabel ?? "走下一張卡 →";

  function handleContinue() {
    if (step !== "result") {
      const next = step >= 13 ? "result" : ((step + 1) as CurrentStep);
      advanceStep(next);
    }
    navigate({ to: targetPath });
  }

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-12 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="whitespace-pre-line text-[15px] sm:text-base leading-relaxed text-text-secondary">
          {instruction}
        </p>
      </header>

      {children && <section className="flex flex-col gap-6">{children}</section>}

      <footer className="sticky bottom-0 -mx-5 sm:-mx-8 px-5 sm:px-8 pt-4 pb-6 border-t border-border-hairline bg-canvas-base">
        {!readyToContinue && notReadyHint && (
          <p className="mb-3 text-[13px] leading-relaxed text-text-tertiary whitespace-pre-line">
            {notReadyHint}
          </p>
        )}
        <button
          type="button"
          onClick={handleContinue}
          aria-label={label}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-medium text-[15px] transition-colors bg-text-primary text-text-inverse hover:bg-text-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40 focus-visible:ring-offset-2"
        >
          {label}
        </button>
      </footer>
    </main>
  );
}
