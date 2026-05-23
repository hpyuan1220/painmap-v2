import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { TextareaField } from "@/components/worksheet/WorksheetFormPrimitives";
import { isCardBReady } from "@/lib/cardValidators";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/06")({
  head: () => ({
    meta: [
      { title: "Card B · 心情地圖 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardBPage,
});

const INSTRUCTION = `我們站到那個人的位置上看一看。
六個欄位都先簡單一句話就好，不用寫成段落。

他這個時候心裡在想什麼？身體上、表情上會出現什麼？
嘴上會說什麼、跟心裡想的一樣嗎？`;

function CardBPage() {
  const em = usePainCardStore((s) => s.card.empathy_map);
  const updateField = usePainCardStore((s) => s.updateField);
  const ready = isCardBReady(em);

  return (
    <CardScaffold
      step={6}
      title="Card B · 心情地圖"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：六個欄位都先寫一句話就好。"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaField
          label="心裡想什麼"
          value={em.think}
          onChange={(v) => updateField("empathy_map.think", v)}
          rows={2}
        />
        <TextareaField
          label="感受"
          value={em.feel}
          onChange={(v) => updateField("empathy_map.feel", v)}
          rows={2}
        />
        <TextareaField
          label="嘴上會說什麼"
          value={em.say}
          onChange={(v) => updateField("empathy_map.say", v)}
          rows={2}
        />
        <TextareaField
          label="行為上會做什麼"
          value={em.do}
          onChange={(v) => updateField("empathy_map.do", v)}
          rows={2}
        />
        <TextareaField
          label="卡在哪"
          value={em.pain}
          onChange={(v) => updateField("empathy_map.pain", v)}
          rows={2}
        />
        <TextareaField
          label="希望得到"
          value={em.gain}
          onChange={(v) => updateField("empathy_map.gain", v)}
          rows={2}
        />
      </div>
    </CardScaffold>
  );
}
