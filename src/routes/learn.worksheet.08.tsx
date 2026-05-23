import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/08")({
  head: () => ({
    meta: [
      { title: "Card 5 · 取捨對話 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardFivePage,
});

const INSTRUCTION = `每個卡住的故事裡通常都藏著「想要兩個東西，但只能選一個」的取捨。

寫一組就可以走下一張，但 3 組會讓你更看清楚自己的優先序。

「我想要 A，也想要 B。
 但如果一定要選，我會選 ___，因為 ___。」`;

function CardFivePage() {
  const pairs = usePainCardStore((s) => s.card.contradiction.pairs);
  const ready =
    pairs.length >= 1 &&
    pairs.every((p) => p.side_a.trim() && p.side_b.trim() && p.reason.trim());

  return (
    <CardScaffold
      step={8}
      title="Card 5 · 取捨對話"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少寫一組取捨（A、B、選哪個、為什麼）。"
    >
      <WorksheetStub cardLabel="Card 5 · 取捨對話" fieldPath="contradiction.pairs[]" />
    </CardScaffold>
  );
}
