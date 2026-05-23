/**
 * Result · Pain ID 卡片頁
 *
 * 收尾頁 — 自動組裝 PainCard 為 markdown preview，
 * 使用者寫一句話的故事 + 下一步說明 + 選下一步 hint + 匯出。
 *
 * 替代 v2 的 Card 9 (verdict) + Card 10 (export) 兩頁。
 */

import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { MarkdownView } from "@/components/worksheet/MarkdownView";
import { usePainCardStore } from "@/store/painCard";
import {
  downloadExport,
  generatePainId,
  isReadyForExport,
  toMarkdown,
} from "@/lib/painIdExport";
import type { NextStepHint } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/result")({
  head: () => ({
    meta: [
      { title: "Pain ID 卡片 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

const INSTRUCTION = `今天先陪你走到這裡。

這張 Pain ID 卡片屬於你，可以放回口袋，
也可以下次回來再多聊幾段。

如果你準備好要試試看「72 小時把一個解法做出來給一個真人」，
我們有另一份 sprint manual 可以接著走。
但如果不是今天，那就不是今天。`;

const HINT_LABELS: Record<NextStepHint, string> = {
  continue_listening: "這條故事還想再多聽幾個聲音",
  pause_for_now: "先把這個放回口袋，過一陣子再回來看",
  ready_for_sprint: "這條故事準備好走進真實的 72 小時了",
};

function ResultPage() {
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const markAsCompleted = usePainCardStore((s) => s.markAsCompleted);

  // Auto-assign a pain_id on first visit
  useEffect(() => {
    if (!card.result.pain_id) {
      updateField("result.pain_id", generatePainId());
    }
  }, [card.result.pain_id, updateField]);

  const canExport = isReadyForExport(card);

  function handleDownload(format: "markdown" | "json") {
    updateField("result.export_format", format);
    updateField("result.exported_at", new Date().toISOString());
    markAsCompleted();
    downloadExport(card, format);
  }

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-12 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
          Pain ID · {card.result.pain_id || "—"}
        </h1>
        <p className="whitespace-pre-line text-[15px] sm:text-base leading-relaxed text-text-secondary">
          {INSTRUCTION}
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <label htmlFor="story-one-liner" className="text-[13px] font-medium text-text-secondary">
          一句話的故事
        </label>
        <input
          id="story-one-liner"
          type="text"
          value={card.result.story_one_liner}
          onChange={(e) => updateField("result.story_one_liner", e.target.value)}
          placeholder="用一句話告訴未來的自己：這趟路上你聽到了什麼？"
          className="w-full rounded-md border border-border-hairline bg-canvas-raised px-3 py-2.5 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary"
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-text-secondary">下一步</p>
        {(Object.keys(HINT_LABELS) as NextStepHint[]).map((hint) => (
          <label key={hint} className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="next-step-hint"
              checked={card.result.next_step_hint === hint}
              onChange={() => updateField("result.next_step_hint", hint)}
              className="mt-1"
            />
            <span className="text-[15px] text-text-primary">{HINT_LABELS[hint]}</span>
          </label>
        ))}
        <textarea
          rows={3}
          value={card.result.next_step_note}
          onChange={(e) => updateField("result.next_step_note", e.target.value)}
          placeholder="想多寫一點關於你的下一步嗎？"
          className="mt-2 w-full rounded-md border border-border-hairline bg-canvas-raised px-3 py-2.5 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary"
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-text-secondary">預覽</p>
        <div className="rounded-lg border border-border-hairline bg-canvas-raised p-5">
          <MarkdownView>{toMarkdown(card)}</MarkdownView>
        </div>
      </section>

      <footer className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleDownload("markdown")}
          disabled={!canExport}
          className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-text-primary text-text-inverse hover:bg-text-primary/90"
        >
          帶這張 Pain ID 卡片走（.md） →
        </button>
        <button
          type="button"
          onClick={() => handleDownload("json")}
          disabled={!canExport}
          className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 border border-border-default bg-canvas-base text-text-primary hover:bg-canvas-raised"
        >
          下載 JSON 快照
        </button>
      </footer>
    </main>
  );
}
