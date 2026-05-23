import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { WorksheetStub } from "@/components/worksheet/WorksheetStub";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/07")({
  head: () => ({
    meta: [
      { title: "Card 4 · 卡點公式 + AI 解法回看 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardFourPage,
});

const INSTRUCTION = `先用一句話把卡點寫下來：「我每次要 ___，都會卡在 ___」

寫完之後，請 AI 列幾個市場上常見的解法。
我們不急著評論它們好或不好，
只想請你誠實寫一寫：如果用這個，你心裡那個卡住的感覺，會不會就消失？`;

function CardFourPage() {
  const s = usePainCardStore((store) => store.card.stuck_formula_with_solutions);
  const ready =
    s.user_draft.trim().length > 0 &&
    s.user_solution_verdicts.length >= 3 &&
    s.user_solution_verdicts.every((v) => v.reason.trim().length > 0);

  return (
    <CardScaffold
      step={7}
      title="Card 4 · 把卡點輕輕說清楚 + AI 解法回看"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：寫下卡點公式 + 至少對 3 個解法寫下「為什麼這個不夠」。"
    >
      <WorksheetStub cardLabel="Card 4 · 卡點公式 + AI 解法回看" fieldPath="stuck_formula_with_solutions.*" />
    </CardScaffold>
  );
}
