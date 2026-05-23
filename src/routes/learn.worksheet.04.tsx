import { createFileRoute } from "@tanstack/react-router";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { usePainCardStore } from "@/store/painCard";
import type { DrillRound } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/04")({
  head: () => ({
    meta: [
      { title: "Card 1-B · 走進其中一條，慢慢往下問 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardOneBPage,
});

const INSTRUCTION = `我們選了一條路，現在開始往下走。

每一輪，你問一個更具體的問題，AI 陪你看一看，
然後你寫一句「我聽到了什麼」就好。

建議 3 輪，2 輪也可以走下一張。`;

function buildRoundPrompt(args: {
  verbatim: string;
  directionTitle: string;
  directionDescription: string;
  priorRoundsSummary: string;
  thisRoundQuestion: string;
}) {
  return `我們選了一條方向繼續往下走。

抱怨原話：
${args.verbatim}

我們這次選的方向是：
${args.directionTitle} — ${args.directionDescription}

到目前為止，我們已經聊過：
${args.priorRoundsSummary || "（這是第一輪）"}

這一輪，我想問的問題是：
${args.thisRoundQuestion}

想請你幫我做兩件事：
1. 用我已知的事實去回應這個問題，不要替我發明新的細節。
2. 結尾留下一個「下一輪可以再問」的開放式問題，不要直接給答案。

先別急著替我下結論、別替我推薦工具、別替我想 App。
我們還在往下聽，不是在做決定。`;
}

function emptyRound(n: 1 | 2 | 3): DrillRound {
  return {
    round: n,
    user_question: "",
    ai_response: "",
    user_reflection: "",
  };
}

function CardOneBPage() {
  const complaint = usePainCardStore((s) => s.card.complaint);
  const an = usePainCardStore((s) => s.card.ai_narrowing);
  const updateField = usePainCardStore((s) => s.updateField);

  const direction =
    an.directions.find((d) => d.id === an.picked_direction_id) ||
    an.directions[0] ||
    { id: "", title: "", description: "", why_it_matters: "" };

  const rounds = an.drill_rounds.length === 0 ? [emptyRound(1)] : an.drill_rounds;
  const ready =
    rounds.length >= 2 &&
    rounds.every(
      (r) => r.user_question.trim() && r.ai_response.trim() && r.user_reflection.trim(),
    );

  function setRound(idx: number, patch: Partial<DrillRound>) {
    const next = rounds.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    updateField("ai_narrowing.drill_rounds", next);
  }

  function addRound() {
    if (rounds.length >= 3) return;
    const nextNum = (rounds.length + 1) as 1 | 2 | 3;
    updateField("ai_narrowing.drill_rounds", [...rounds, emptyRound(nextNum)]);
  }

  function priorRoundsSummary(uptoIdx: number) {
    return rounds
      .slice(0, uptoIdx)
      .map((r) => `輪 ${r.round}：問「${r.user_question}」→ AI：${r.ai_response} → 我聽到：${r.user_reflection}`)
      .join("\n");
  }

  return (
    <CardScaffold
      step={4}
      title="Card 1-B · 走進其中一條，慢慢往下問"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少跑完 2 輪「問 → 聽 → 反思」，每輪都記得寫下你聽到了什麼。"
    >
      {rounds.map((round, idx) => (
        <CardBlock key={idx} title={`第 ${round.round} 輪`}>
          <TextareaField
            label="你這一輪想問的問題"
            value={round.user_question}
            onChange={(v) => setRound(idx, { user_question: v })}
            rows={2}
          />
          {round.user_question.trim() && (
            <AIPromptCopyBlock
              prompt={buildRoundPrompt({
                verbatim: complaint.verbatim,
                directionTitle: direction.title,
                directionDescription: direction.description,
                priorRoundsSummary: priorRoundsSummary(idx),
                thisRoundQuestion: round.user_question,
              })}
              response={round.ai_response}
              onResponseChange={(v) => setRound(idx, { ai_response: v })}
              title={`第 ${round.round} 輪 · 想請 AI 陪我看一看`}
            />
          )}
          <TextareaField
            label="我從這輪聽到了什麼"
            value={round.user_reflection}
            onChange={(v) => setRound(idx, { user_reflection: v })}
            rows={2}
          />
        </CardBlock>
      ))}
      {rounds.length < 3 && (
        <button
          type="button"
          onClick={addRound}
          className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
        >
          ＋ 再跑一輪
        </button>
      )}
    </CardScaffold>
  );
}
