import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
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
  const ready =
    fp.summary.trim().length >= 60 &&
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
      <WorksheetStub cardLabel="Card 3 · 聚焦痛點摘要" fieldPath="focused_pain.*" />
    </CardScaffold>
  );
}
