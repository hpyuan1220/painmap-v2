import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/10")({
  head: () => ({
    meta: [
      { title: "Card 7 · 三個有名字的人 + 你心裡的猜想 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardSevenPage,
});

const INSTRUCTION = `三個人都要有名字 + 聯絡得到。
每人寫 3-5 個你預先猜他會說的答案 —
不是要你猜對，是要你記得自己的預期，
等一下訪談時才能辨認「驚訝」。`;

function CardSevenPage() {
  const pwg = usePainCardStore((s) => s.card.people_with_guesses);
  const ready =
    pwg.list.length === 3 &&
    pwg.list.every(
      (p) =>
        p.name.trim() &&
        p.contact.trim() &&
        p.relation.trim() &&
        p.why_pick_them.trim() &&
        p.guessed_answers.length >= 3,
    );

  return (
    <CardScaffold
      step={10}
      title="Card 7 · 三個有名字的人 + 你心裡的猜想"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：3 個有名字 + 聯絡得到的人，每人至少 3 個你預先猜的答案。"
    >
      <WorksheetStub cardLabel="Card 7 · 三個有名字的人 + 你心裡的猜想" fieldPath="people_with_guesses.list[]" />
    </CardScaffold>
  );
}
