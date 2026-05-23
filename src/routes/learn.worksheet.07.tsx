import { createFileRoute } from "@tanstack/react-router";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  RadioGroup,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { isCard4Ready } from "@/lib/cardValidators";
import { usePainCardStore } from "@/store/painCard";
import type { AiSolution, SolutionVerdict } from "@/types/painCard";

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

function solutionsPrompt(stuckDraft: string) {
  return `這是我的卡點公式：
${stuckDraft || "（還沒寫）"}

想請你陪我做一件事：
列出市場上 3-5 個「常見的」解法（不是你推薦的，是常見的），
每個解法只要說：
- 解法的名字
- 一句話描述（不要寫成行銷文案）

別替我打分數、別替我推薦哪個最好、別替我設計新的解法。
我等一下會自己逐一回看，寫下「如果用這個，那個卡住的感覺會不會消失」。`;
}

function CardFourPage() {
  const s = usePainCardStore((store) => store.card.stuck_formula_with_solutions);
  const updateField = usePainCardStore((store) => store.updateField);

  const solutions = s.ai_solutions;
  const verdicts = s.user_solution_verdicts;

  const verdictsCompleted = solutions.filter((sol) => {
    const v = verdicts.find((x) => x.solution_id === sol.id);
    return v && v.reason.trim().length > 0;
  }).length;

  const ready = isCard4Ready(s);

  function getVerdict(solutionId: string): SolutionVerdict {
    return (
      verdicts.find((v) => v.solution_id === solutionId) || {
        solution_id: solutionId,
        verdict: "unknown",
        reason: "",
      }
    );
  }

  function setVerdict(solutionId: string, patch: Partial<SolutionVerdict>) {
    const existing = verdicts.find((v) => v.solution_id === solutionId);
    const next = existing
      ? verdicts.map((v) => (v.solution_id === solutionId ? { ...v, ...patch } : v))
      : [...verdicts, { solution_id: solutionId, verdict: "unknown" as const, reason: "", ...patch }];
    updateField("stuck_formula_with_solutions.user_solution_verdicts", next);
  }

  function addSolutionSlot() {
    const next: AiSolution = {
      id: `sol-${solutions.length + 1}`,
      label: "",
      description: "",
    };
    updateField("stuck_formula_with_solutions.ai_solutions", [...solutions, next]);
  }

  function setSolution(idx: number, patch: Partial<AiSolution>) {
    const next = solutions.map((sol, i) => (i === idx ? { ...sol, ...patch } : sol));
    updateField("stuck_formula_with_solutions.ai_solutions", next);
  }

  return (
    <CardScaffold
      step={7}
      title="Card 4 · 把卡點輕輕說清楚 + AI 解法回看"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：寫下卡點公式 + 至少對 3 個解法寫下「為什麼這個不夠」。"
    >
      <TextareaField
        label="卡點公式"
        hint="我每次要 ___，都會卡在 ___"
        value={s.user_draft}
        onChange={(v) => updateField("stuck_formula_with_solutions.user_draft", v)}
        rows={3}
      />

      <AIPromptCopyBlock
        prompt={solutionsPrompt(s.user_draft)}
        response=""
        onResponseChange={() => undefined}
        title="想請 AI 列幾個市場上常見的解法"
      />

      <p className="text-[13px] text-text-secondary">
        AI 給你幾個解法後，把它們填到下面，然後逐一寫下「如果用這個，卡住的感覺會不會就消失」。
      </p>

      {solutions.length === 0 && (
        <button
          type="button"
          onClick={addSolutionSlot}
          className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
        >
          ＋ 加一個解法
        </button>
      )}

      {solutions.map((sol, idx) => {
        const v = getVerdict(sol.id);
        return (
          <CardBlock key={sol.id} title={`解法 ${idx + 1}`}>
            <TextField
              label="解法名稱"
              value={sol.label}
              onChange={(val) => setSolution(idx, { label: val })}
            />
            <TextareaField
              label="一句話描述"
              value={sol.description}
              onChange={(val) => setSolution(idx, { description: val })}
              rows={2}
            />
            <RadioGroup<SolutionVerdict["verdict"]>
              label="如果用這個，卡住的感覺會不會就消失？"
              value={v.verdict}
              onChange={(val) => setVerdict(sol.id, { verdict: val })}
              options={[
                { value: "helps", label: "會 — 卡住感真的會消失" },
                { value: "partial", label: "一半一半 — 有幫助但不夠" },
                { value: "no", label: "不會 — 沒解到根本的卡點" },
                { value: "unknown", label: "還不確定" },
              ]}
            />
            <TextareaField
              label="為什麼？（具體說一兩句，不要只寫「沒用」）"
              value={v.reason}
              onChange={(val) => setVerdict(sol.id, { reason: val })}
              rows={2}
            />
          </CardBlock>
        );
      })}
      {solutions.length > 0 && (
        <button
          type="button"
          onClick={addSolutionSlot}
          className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
        >
          ＋ 再加一個解法
        </button>
      )}
    </CardScaffold>
  );
}
