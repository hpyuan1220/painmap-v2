import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/03")({
  head: () => ({
    meta: [
      { title: "Card 1-A · AI 替你打開三條路 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardOneAPage,
});

const INSTRUCTION = `把你寫的抱怨 + 日記貼給 AI，
不是要它替你想解法，而是請它替你打開幾條你可能還沒注意到的方向。

三條路裡，你最想再多聽哪一條？
其他兩條不會消失，這次先走一條而已。`;

function CardOneAPage() {
  const { directions, picked_direction_id } = usePainCardStore((s) => s.card.ai_narrowing);
  const ready = directions.length === 3 && picked_direction_id !== null;

  return (
    <CardScaffold
      step={3}
      title="Card 1-A · AI 替你打開三條路"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：把 AI 給你的三條方向貼回來，並從中選一條（其他兩條我們會替你留著）。"
    >
      <WorksheetStub
        cardLabel="Card 1-A · AI 替你打開三條路"
        fieldPath="ai_narrowing.directions[], ai_narrowing.picked_direction_id"
      />
    </CardScaffold>
  );
}
