import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/09")({
  head: () => ({
    meta: [
      { title: "Card 6 · 市場聲音的三段證據 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardSixPage,
});

const INSTRUCTION = `找 3 段你在外面聽到的聲音 — 可以是論壇、新聞、訪談、學術文章。
每段都寫一句「為什麼這段跟我手上的故事有關」。

別替我打分數、別替我下「common pain / niche pain」這類判斷 —
那個讓你自己看完 3 段之後寫。`;

function CardSixPage() {
  const ae = usePainCardStore((s) => s.card.ai_evidence);
  const ready =
    ae.evidences.length >= 3 &&
    ae.evidences.every((e) => e.source.trim() && e.quote.trim() && e.relevance.trim()) &&
    ae.landscape_note.trim().length > 0;

  return (
    <CardScaffold
      step={9}
      title="Card 6 · 市場聲音的三段證據"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：找 3 段公開聲音 + 寫一句你的整體觀察。"
    >
      <WorksheetStub cardLabel="Card 6 · 市場聲音的三段證據" fieldPath="ai_evidence.{evidences[],landscape_note}" />
    </CardScaffold>
  );
}
