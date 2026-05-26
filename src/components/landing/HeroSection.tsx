/**
 * HeroSection — landing 第一屏 (Editorial 5/7 split).
 *
 * Editorial principles:
 * - lg+: illustration occupies left 7 cols (≈58vw), copy occupies right 5 cols
 * - Mobile: illustration full-bleed on top, copy stacked below
 * - Headline scaled to clamp(56px, 8vw, 128px) so it fills 5-col gutter on desktop
 *   without overflow, while staying punchy on mobile
 * - Pure monochrome canvas + dot-dim texture (v1.2 §10 allowed exception)
 * - Sequence fade-in on illustration → title → subtitle → CTAs
 */
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Illustration } from "@/components/Illustration";
import { usePainCardStore } from "@/store/painCard";

export function HeroSection() {
  const navigate = useNavigate();
  const createCard = usePainCardStore((s) => s.createCard);

  const handleStart = (flow: "lite" | "ai-detective") => {
    createCard();
    navigate({ to: "/learn/worksheet-lite/01", search: { flow } as never });
  };

  const openExample = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("example-paincard")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.location.hash = "example-paincard-open";
  };

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-canvas-base"
    >
      <div aria-hidden className="absolute inset-0 bg-dot-dim opacity-50" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border-hairline" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 section-2xl">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Illustration: mobile full-bleed top; lg+ left 7 cols */}
          <div className="col-span-12 lg:col-span-7 lg:order-1 animate-grok-fade-up">
            <Illustration
              name="e11-listening-vessel"
              alt="一隻手心捧著像空容器的耳朵 — 等著被填滿的傾聽"
              aspect="4/3"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="border-0 bg-transparent"
            />
          </div>

          {/* Copy: mobile stacked below; lg+ right 5 cols */}
          <div className="col-span-12 lg:col-span-5 lg:order-2">
            <h1
              id="hero-headline"
              className="font-display font-bold leading-[0.92] tracking-[-0.05em] text-text-primary animate-grok-fade-up text-[clamp(56px,8vw,128px)]"
              style={{ animationDelay: "120ms" }}
            >
              痛點 ID Card
            </h1>

            <p
              className="mt-8 max-w-prose text-lg sm:text-xl leading-[1.55] text-text-secondary animate-grok-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              一個 PainMap app，裡面有不同 flow。你可以選 6 卡快速版，也可以選 8 卡 AI
              偵探版，讓 AI 不只回答，而是真的幫你釐清、挑戰、再寫回卡片。
            </p>

            <div
              className="mt-10 flex flex-col gap-4 animate-grok-fade-up"
              style={{ animationDelay: "360ms" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => handleStart("lite")}
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-md bg-text-primary px-7 text-[15px] font-medium text-text-inverse transition-colors duration-200 hover:bg-text-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-primary focus-visible:outline-offset-2"
                >
                  開始 6-card flow
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStart("ai-detective")}
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-md border border-border-hairline bg-canvas-raised px-7 text-[15px] font-medium text-text-primary transition-colors duration-200 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-primary focus-visible:outline-offset-2"
                >
                  開始 8-card AI detective
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <a
                  href="#example-paincard"
                  onClick={openExample}
                  className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  查看範例 ID card
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
                <p className="text-[13px] leading-[1.7] text-text-tertiary">
                  6-card 適合快速收斂。8-card 適合讓 AI 更深地挑戰假設與寫回卡片。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
