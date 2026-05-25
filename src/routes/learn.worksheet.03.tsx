import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  RadioGroup,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { isCard1AReady } from "@/lib/cardValidators";
import { fetchAiDirections } from "@/lib/aiAssist";
import { parseCard1ADirections } from "@/lib/parsers/card1ADirectionsParser";
import { usePainCardStore } from "@/store/painCard";
import type { AiDirection } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/03")({
  head: () => ({
    meta: [
      { title: "Card 1-A · AI 替你打開三條路 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardOneAPage,
});

const INSTRUCTION = `把你前面寫的抱怨交給 AI，不是要它給解法，
而是請它替你打開 3 條你還沒注意到的方向。
讀完選一條最想往下聽的就好 — 其他兩條我們會替你留著。`;

function buildPrompt(
  complaint: {
    verbatim: string;
    source_name: string;
    source_relation: string;
    datetime: string;
    scene: string;
  },
  diaryNotes: string,
) {
  return `我這邊有一句最近聽到（或自己脫口而出）的抱怨，想請你陪我把它「打開」一下。

抱怨原話：
${complaint.verbatim}

說的人：
${complaint.source_name}（${complaint.source_relation}）

時間與場景：
${complaint.datetime}，${complaint.scene}

另外，我這幾天記下的幾段現場日記：
${diaryNotes || "（暫時還沒有日記）"}

想請你幫我做一件事：
從這段抱怨 + 日記出發，幫我打開 3 條值得繼續往下聽的方向。
每一條都告訴我：
- 方向的名字（一句話）
- 為什麼這條值得聽（一兩句話）

先別急著替我選一條、別替我推薦工具、別替我想 App，也不用替我打分數。
我只是想看到 3 條不同的可能性，等一下我自己選一條走。`;
}

function emptyDir(id: string): AiDirection {
  return { id, title: "", description: "", why_it_matters: "" };
}

type AiState = "idle" | "loading" | "filled" | "fallback";

function CardOneAPage() {
  const complaint = usePainCardStore((s) => s.card.complaint);
  const diaryEntries = usePainCardStore((s) => s.card.pain_diary.entries);
  const an = usePainCardStore((s) => s.card.ai_narrowing);
  const updateField = usePainCardStore((s) => s.updateField);

  const [aiState, setAiState] = useState<AiState>("idle");
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState("");

  const diaryNotes = diaryEntries
    .map((e) => `- [${e.timestamp}] ${e.location}：${e.note}`)
    .join("\n");

  const prompt = buildPrompt(complaint, diaryNotes);

  const directions =
    an.directions.length === 0
      ? [emptyDir("d1"), emptyDir("d2"), emptyDir("d3")]
      : an.directions;
  const ready = isCard1AReady(an);

  function setDir(idx: number, patch: Partial<AiDirection>) {
    const next = directions.map((d, i) => (i === idx ? { ...d, ...patch } : d));
    updateField("ai_narrowing.directions", next);
  }

  async function handleAskAi() {
    if (!complaint.verbatim.trim()) {
      setAiNote("先回到 Card 1 寫下那句抱怨，AI 才有東西可以打開。");
      return;
    }
    setAiState("loading");
    setAiNote(null);
    const result = await fetchAiDirections({
      complaint: complaint.verbatim,
      context: `${complaint.source_name}（${complaint.source_relation}），${complaint.datetime}，${complaint.scene}`,
      diaryNotes,
    });
    if (result.ok) {
      const padded = [...result.directions];
      while (padded.length < 3) padded.push(emptyDir(`d${padded.length + 1}`));
      updateField("ai_narrowing.directions", padded);
      setAiState("filled");
      setAiNote("AI 給了你三條方向，讀一讀、選一條，內容都可以再編輯。");
    } else {
      setAiState("fallback");
      setAiNote(
        result.reason === "not_configured"
          ? "這個網站還沒接上 AI 直連 — 沒關係，用下面的「複製貼上」一樣可以走完。"
          : "AI 直連暫時連不上 — 先用下面的「複製貼上」方式繼續。",
      );
    }
  }

  function handleAiResponseChange(value: string) {
    setAiResponse(value);
    if (!value.trim()) return;
    const parsed = parseCard1ADirections(value);
    if (parsed.length === 0) {
      setAiNote("在這段回應裡找不到「方向 1 / 2 / 3」的格式 — 你可以直接填到下面的三張卡。");
      return;
    }
    const padded: AiDirection[] = [...parsed];
    while (padded.length < 3) padded.push(emptyDir(`d${padded.length + 1}`));
    updateField("ai_narrowing.directions", padded);
    setAiNote(`已幫你填好 ${parsed.length} 條方向，可以再編輯。`);
  }

  return (
    <CardScaffold
      step={3}
      title="Card 1-A · AI 替你打開三條路"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：讓 AI（或複製貼上）給你三條方向，再從中選一條。"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAskAi}
            disabled={aiState === "loading"}
            className="inline-flex items-center justify-center rounded-md bg-text-primary px-5 py-2.5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-text-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {aiState === "loading" ? "AI 思考中…" : "✨ 讓 AI 替我打開三條路"}
          </button>
          {aiState !== "fallback" && (
            <button
              type="button"
              onClick={() => setAiState("fallback")}
              className="text-[13px] text-text-secondary hover:text-text-primary"
            >
              或自己複製貼上
            </button>
          )}
        </div>
        {aiNote && <p className="text-[13px] leading-relaxed text-text-secondary">{aiNote}</p>}
      </div>

      {aiState === "fallback" && (
        <AIPromptCopyBlock
          prompt={prompt}
          response={aiResponse}
          onResponseChange={handleAiResponseChange}
          title="想請 AI 替你打開三條路"
        />
      )}

      {directions.map((d, idx) => (
        <CardBlock key={d.id || idx} title={`第 ${idx + 1} 條路`}>
          <TextField
            label="方向的名字"
            value={d.title}
            onChange={(v) => setDir(idx, { title: v })}
          />
          <TextareaField
            label="為什麼這條值得聽"
            value={d.description}
            onChange={(v) => setDir(idx, { description: v })}
            rows={2}
          />
        </CardBlock>
      ))}

      <RadioGroup
        label="這次先走哪一條？"
        value={an.picked_direction_id}
        onChange={(v) => updateField("ai_narrowing.picked_direction_id", v)}
        options={directions.map((d, idx) => ({
          value: d.id || `d${idx + 1}`,
          label: d.title || `第 ${idx + 1} 條路`,
          description: d.description,
        }))}
      />
    </CardScaffold>
  );
}
