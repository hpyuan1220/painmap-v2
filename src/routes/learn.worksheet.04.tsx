import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { CardBlock, TextareaField } from "@/components/worksheet/WorksheetFormPrimitives";
import { isCard1BReady } from "@/lib/cardValidators";
import { fetchAiDrill } from "@/lib/aiAssist";
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
每一輪你問一個更具體的問題，按一下讓 AI 陪你看看，
再寫一句「我聽到了什麼」。建議 3 輪，2 輪也可以走下一張。`;

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
  return { round: n, user_question: "", ai_response: "", user_reflection: "" };
}

function CardOneBPage() {
  const complaint = usePainCardStore((s) => s.card.complaint);
  const an = usePainCardStore((s) => s.card.ai_narrowing);
  const updateField = usePainCardStore((s) => s.updateField);

  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [fallbackIdx, setFallbackIdx] = useState<Set<number>>(new Set());
  const [noteIdx, setNoteIdx] = useState<Record<number, string>>({});

  const direction = an.directions.find((d) => d.id === an.picked_direction_id) ||
    an.directions[0] || { id: "", title: "", description: "", why_it_matters: "" };

  const rounds = an.drill_rounds.length === 0 ? [emptyRound(1)] : an.drill_rounds;
  const ready = isCard1BReady(an);

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
      .map(
        (r) =>
          `輪 ${r.round}：問「${r.user_question}」→ AI：${r.ai_response} → 我聽到：${r.user_reflection}`,
      )
      .join("\n");
  }

  function showFallback(idx: number) {
    setFallbackIdx((prev) => new Set(prev).add(idx));
  }

  async function handleAskAi(idx: number, round: DrillRound) {
    setLoadingIdx(idx);
    setNoteIdx((prev) => ({ ...prev, [idx]: "" }));
    const result = await fetchAiDrill({
      complaint: complaint.verbatim,
      directionTitle: direction.title,
      directionDescription: direction.description,
      priorRounds: priorRoundsSummary(idx),
      question: round.user_question,
    });
    setLoadingIdx(null);
    if (result.ok) {
      setRound(idx, { ai_response: result.aiResponse });
      setNoteIdx((prev) => ({ ...prev, [idx]: "AI 回應好了，讀完寫一句你聽到了什麼。" }));
    } else {
      showFallback(idx);
      setNoteIdx((prev) => ({
        ...prev,
        [idx]:
          result.reason === "not_configured"
            ? "AI 直連還沒開 — 用下面的複製貼上一樣可以。"
            : "AI 直連暫時連不上 — 改用下面的複製貼上。",
      }));
    }
  }

  return (
    <CardScaffold
      step={4}
      title="Card 1-B · 走進其中一條，慢慢往下問"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少跑完 2 輪「問 → 聽 → 反思」，每輪都記得寫下你聽到了什麼。"
    >
      {direction.title && (
        <p className="text-[13px] text-text-secondary">
          這次走的方向：<span className="text-text-primary">{direction.title}</span>
        </p>
      )}

      {rounds.map((round, idx) => (
        <CardBlock key={idx} title={`第 ${round.round} 輪`}>
          <TextareaField
            label="你這一輪想問的問題"
            value={round.user_question}
            onChange={(v) => setRound(idx, { user_question: v })}
            rows={2}
          />
          {round.user_question.trim() && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAskAi(idx, round)}
                  disabled={loadingIdx === idx}
                  className="inline-flex items-center justify-center rounded-md bg-text-primary px-4 py-2 text-[13px] font-medium text-text-inverse transition-colors hover:bg-text-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingIdx === idx ? "AI 思考中…" : "✨ 讓 AI 陪我看一看"}
                </button>
                {!fallbackIdx.has(idx) && (
                  <button
                    type="button"
                    onClick={() => showFallback(idx)}
                    className="text-[13px] text-text-secondary hover:text-text-primary"
                  >
                    或自己複製貼上
                  </button>
                )}
              </div>
              {noteIdx[idx] && (
                <p className="text-[13px] leading-relaxed text-text-secondary">{noteIdx[idx]}</p>
              )}
              {fallbackIdx.has(idx) && (
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
              {round.ai_response.trim() && !fallbackIdx.has(idx) && (
                <div className="rounded-md border border-border-hairline bg-canvas-raised p-3 text-[14px] leading-relaxed text-text-primary whitespace-pre-line">
                  {round.ai_response}
                </div>
              )}
            </div>
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
