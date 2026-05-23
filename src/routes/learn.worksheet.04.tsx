import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/04")({
  head: () => ({
    meta: [
      { title: "Card 1-B · 走進其中一條，慢慢往下問 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardOneBPage,
});

const INSTRUCTION = `我們選了一條路，現在開始往下走。

每一輪，你問一個更具體的問題，AI 陪你看一看，
然後你寫一句「我聽到了什麼」就好。

建議 3 輪，2 輪也可以走下一張。`;

function CardOneBPage() {
  const rounds = usePainCardStore((s) => s.card.ai_narrowing.drill_rounds);
  const ready =
    rounds.length >= 2 &&
    rounds.every(
      (r) => r.user_question.trim() && r.ai_response.trim() && r.user_reflection.trim(),
    );

  return (
    <CardScaffold
      step={4}
      title="Card 1-B · 走進其中一條，慢慢往下問"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少跑完 2 輪「問 → 聽 → 反思」，每輪都記得寫下你聽到了什麼。"
    >
      <WorksheetStub cardLabel="Card 1-B · 走進其中一條" fieldPath="ai_narrowing.drill_rounds[]" />
    </CardScaffold>
  );
}
