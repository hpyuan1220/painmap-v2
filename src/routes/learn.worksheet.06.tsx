import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/06")({
  head: () => ({
    meta: [
      { title: "Card B · 心情地圖 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardBPage,
});

const INSTRUCTION = `我們站到那個人的位置上看一看。
六個欄位都先簡單一句話就好，不用寫成段落。

他這個時候心裡在想什麼？身體上、表情上會出現什麼？
嘴上會說什麼、跟心裡想的一樣嗎？`;

function CardBPage() {
  const em = usePainCardStore((s) => s.card.empathy_map);
  const ready =
    em.think.trim() &&
    em.feel.trim() &&
    em.say.trim() &&
    em.do.trim() &&
    em.pain.trim() &&
    em.gain.trim();

  return (
    <CardScaffold
      step={6}
      title="Card B · 心情地圖"
      instruction={INSTRUCTION}
      readyToContinue={!!ready}
      notReadyHint="走下一張卡前：六個欄位都先寫一句話就好。"
    >
      <WorksheetStub cardLabel="Card B · 心情地圖" fieldPath="empathy_map.{think,feel,say,do,pain,gain}" />
    </CardScaffold>
  );
}
