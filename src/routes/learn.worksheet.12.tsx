import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/12")({
  head: () => ({
    meta: [
      { title: "Card 8 · 真人對話 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardEightPage,
});

const INSTRUCTION = `跟 Card 7 的三個人聊完之後，回來記錄你聽到了什麼。

一場對話也可以走下一張，但 3 場會讓你更看清楚
哪些是個別的、哪些是共通的。

不用寫成逐字稿，幾句印象深刻的原話就好。`;

function CardEightPage() {
  const sessions = usePainCardStore((s) => s.card.interview.sessions);
  const ready =
    sessions.length >= 1 &&
    sessions.every(
      (s) =>
        s.person_name.trim() &&
        s.datetime.trim() &&
        s.mode &&
        s.key_quotes.length >= 1 &&
        s.key_quotes.some((q) => q.trim()),
    );

  return (
    <CardScaffold
      step={12}
      title="Card 8 · 真人對話"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少寫下 1 場對話，每場至少記一句印象深刻的原話。"
    >
      <WorksheetStub cardLabel="Card 8 · 真人對話" fieldPath="interview.sessions[]" />
    </CardScaffold>
  );
}
