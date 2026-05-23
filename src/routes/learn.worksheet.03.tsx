import { createFileRoute } from "@tanstack/react-router";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  RadioGroup,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
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

const INSTRUCTION = `把你寫的抱怨 + 日記貼給 AI，
不是要它替你想解法，而是請它替你打開幾條你可能還沒注意到的方向。

三條路裡，你最想再多聽哪一條？
其他兩條不會消失，這次先走一條而已。`;

function buildPrompt(complaint: {
  verbatim: string;
  source_name: string;
  source_relation: string;
  datetime: string;
  scene: string;
}, diaryNotes: string) {
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
- 這條方向在意的是什麼（一句話）

先別急著替我選一條、別替我推薦工具、別替我想 App。
也不用替我打分數、判斷這 3 條哪條是「真痛點」。
我只是想看到 3 條不同的可能性，等一下我自己選一條走。`;
}

function CardOneAPage() {
  const complaint = usePainCardStore((s) => s.card.complaint);
  const diaryEntries = usePainCardStore((s) => s.card.pain_diary.entries);
  const an = usePainCardStore((s) => s.card.ai_narrowing);
  const updateField = usePainCardStore((s) => s.updateField);

  const diaryNotes = diaryEntries
    .map((e) => `- [${e.timestamp}] ${e.location}：${e.note}`)
    .join("\n");

  const prompt = buildPrompt(complaint, diaryNotes);

  const directions =
    an.directions.length === 0
      ? [emptyDir("d1"), emptyDir("d2"), emptyDir("d3")]
      : an.directions;
  const ready = directions.length === 3 &&
    directions.every((d) => d.title.trim() && d.description.trim()) &&
    an.picked_direction_id !== null;

  function setDir(idx: number, patch: Partial<AiDirection>) {
    const next = directions.map((d, i) => (i === idx ? { ...d, ...patch } : d));
    updateField("ai_narrowing.directions", next);
  }

  return (
    <CardScaffold
      step={3}
      title="Card 1-A · AI 替你打開三條路"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：把 AI 給你的三條方向貼回來，並從中選一條（其他兩條我們會替你留著）。"
    >
      <AIPromptCopyBlock
        prompt={prompt}
        response=""
        onResponseChange={() => undefined}
        title="想請 AI 替你打開三條路"
      />

      <p className="text-[13px] text-text-secondary mt-2">
        AI 給你三條路之後，把它們的標題、描述、在意的事填到下面三張卡。
      </p>

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
          <TextareaField
            label="這條方向在意的是什麼"
            value={d.why_it_matters}
            onChange={(v) => setDir(idx, { why_it_matters: v })}
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

function emptyDir(id: string): AiDirection {
  return { id, title: "", description: "", why_it_matters: "" };
}
