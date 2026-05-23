import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/02")({
  head: () => ({
    meta: [
      { title: "Card A · 痛點現場日記 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardAPage,
});

const INSTRUCTION = `接下來幾天，當這個卡住的感覺又冒出來時，
隨手寫一兩句進來就好。

不用整理、不用美化，誠實的當下最有用。
我們建議 3 筆，但 1 筆也可以走下一張。`;

function CardAPage() {
  const entries = usePainCardStore((s) => s.card.pain_diary.entries);
  const ready = entries.length >= 1;

  return (
    <CardScaffold
      step={2}
      title="Card A · 痛點現場日記"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="我們需要至少 1 筆現場日記才能繼續。先把這頁存著，下次卡住時再回來。"
    >
      <WorksheetStub cardLabel="Card A · 痛點現場日記" fieldPath="pain_diary.entries[]" />
    </CardScaffold>
  );
}
