import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { usePainCardStore } from "@/store/painCard";
import type { AssumptionItem } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/11")({
  head: () => ({
    meta: [
      { title: "Card D · 自我假設清單 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardDPage,
});

const INSTRUCTION = `走進對話前，我們先把自己心裡的猜想攤開來看一看。

不是要你放棄這些猜想，
是要你記得：等一下對方說的話如果跟你不一樣，
不要急著解釋掉它。

這張卡片要你自己寫，不請 AI 看 — 因為 AI 會替你合理化。`;

function emptyItem(): AssumptionItem {
  return { assumption: "", evidence_so_far: "", what_would_change_my_mind: "" };
}

function CardDPage() {
  const a = usePainCardStore((s) => s.card.assumptions);
  const updateField = usePainCardStore((s) => s.updateField);

  const items = a.items.length === 0 ? [emptyItem(), emptyItem()] : a.items;
  const ready =
    items.length >= 2 &&
    items.every(
      (i) =>
        i.assumption.trim() &&
        i.evidence_so_far.trim() &&
        i.what_would_change_my_mind.trim(),
    ) &&
    a.biases_to_watch.trim().length > 0;

  function setItem(idx: number, patch: Partial<AssumptionItem>) {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    updateField("assumptions.items", next);
  }

  function addItem() {
    updateField("assumptions.items", [...items, emptyItem()]);
  }

  function removeItem(idx: number) {
    updateField(
      "assumptions.items",
      items.filter((_, i) => i !== idx),
    );
  }

  return (
    <CardScaffold
      step={11}
      title="Card D · 自我假設清單"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少 2 個假設（每個都附證據 + 修正條件）+ 一段偏見自我提醒。"
    >
      {items.map((item, idx) => (
        <CardBlock
          key={idx}
          title={`假設 ${idx + 1}`}
          onRemove={items.length > 2 ? () => removeItem(idx) : undefined}
        >
          <TextareaField
            label="我目前的假設"
            value={item.assumption}
            onChange={(v) => setItem(idx, { assumption: v })}
            rows={2}
          />
          <TextareaField
            label="我手上的證據"
            value={item.evidence_so_far}
            onChange={(v) => setItem(idx, { evidence_so_far: v })}
            rows={2}
          />
          <TextareaField
            label="訪談中要聽到什麼，我才會修正"
            value={item.what_would_change_my_mind}
            onChange={(v) => setItem(idx, { what_would_change_my_mind: v })}
            rows={2}
          />
        </CardBlock>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        ＋ 再加一個假設
      </button>

      <TextareaField
        label="偏見自我提醒：我容易帶哪些偏見"
        value={a.biases_to_watch}
        onChange={(v) => updateField("assumptions.biases_to_watch", v)}
        rows={4}
      />
    </CardScaffold>
  );
}
