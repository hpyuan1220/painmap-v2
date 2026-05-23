import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { TextareaField } from "@/components/worksheet/WorksheetFormPrimitives";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/05")({
  head: () => ({
    meta: [
      { title: "Card 3 · 聚焦痛點摘要 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardThreePage,
});

const INSTRUCTION = `把我們剛剛走過的路寫成一段約 60 字的摘要。

不是要你下結論，是把這趟路上聽到的東西，
先用自己的話收一次。`;

function CardThreePage() {
  const fp = usePainCardStore((s) => s.card.focused_pain);
  const updateField = usePainCardStore((s) => s.updateField);

  const summaryLen = fp.summary.trim().length;
  const ready =
    summaryLen >= 60 &&
    fp.in_their_own_words.trim().length > 0 &&
    fp.why_this_one.trim().length > 0;

  return (
    <CardScaffold
      step={5}
      title="Card 3 · 聚焦痛點摘要"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：寫一段約 60 字的摘要 + 用那個人的話再說一次 + 為什麼是這條路。"
    >
      <div className="flex flex-col gap-1">
        <TextareaField
          label="用你自己的話寫一段摘要"
          hint="60 字以上，把 Card 1-A / 1-B 走過的路收一次"
          value={fp.summary}
          onChange={(v) => updateField("focused_pain.summary", v)}
          rows={5}
        />
        <span className="text-[11px] text-text-tertiary self-end font-mono tabular-nums">
          {summaryLen} 字 / 建議 60+
        </span>
      </div>
      <TextareaField
        label="用那個人會講的話，再說一次"
        value={fp.in_their_own_words}
        onChange={(v) => updateField("focused_pain.in_their_own_words", v)}
        rows={3}
      />
      <TextareaField
        label="為什麼是這條路，不是另外兩條？"
        value={fp.why_this_one}
        onChange={(v) => updateField("focused_pain.why_this_one", v)}
        rows={3}
      />
    </CardScaffold>
  );
}
