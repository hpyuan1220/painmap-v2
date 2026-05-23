import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

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

function CardDPage() {
  const a = usePainCardStore((s) => s.card.assumptions);
  const ready =
    a.items.length >= 2 &&
    a.items.every(
      (i) =>
        i.assumption.trim() &&
        i.evidence_so_far.trim() &&
        i.what_would_change_my_mind.trim(),
    ) &&
    a.biases_to_watch.trim().length > 0;

  return (
    <CardScaffold
      step={11}
      title="Card D · 自我假設清單"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少 2 個假設（每個都附證據 + 修正條件）+ 一段偏見自我提醒。"
    >
      <WorksheetStub cardLabel="Card D · 自我假設清單" fieldPath="assumptions.{items[],biases_to_watch}" />
    </CardScaffold>
  );
}
