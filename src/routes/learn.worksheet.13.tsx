import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/13")({
  head: () => ({
    meta: [
      { title: "Card G · 訪後沉澱 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardGPage,
});

const INSTRUCTION = `把訪談裡的聲音整理成幾個主題。

AI 會替你聚類成 3-5 個主題，你逐一看：
保留哪些、重新命名哪些、丟掉哪些？

最後寫一段約 80 字的沉澱 — 用你自己的話，不是 AI 的話。`;

function CardGPage() {
  const pis = usePainCardStore((s) => s.card.post_interview_synthesis);
  const ready =
    pis.user_summary.trim().length >= 80 && pis.member_check_questions.length >= 1;

  return (
    <CardScaffold
      step={13}
      title="Card G · 訪後沉澱"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走到 Pain ID 卡片前：一段約 80 字的訪後沉澱 + 至少一個 member check 問題。"
      nextPath="/learn/worksheet/result"
      ctaLabel="走到結尾的 Pain ID 卡片 →"
    >
      <WorksheetStub cardLabel="Card G · 訪後沉澱" fieldPath="post_interview_synthesis.*" />
    </CardScaffold>
  );
}
