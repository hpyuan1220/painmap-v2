import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  RadioGroup,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { isCard6Ready } from "@/lib/cardValidators";
import { usePainCardStore } from "@/store/painCard";
import type { AiTool, EvidenceEntry } from "@/types/painCard";

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

function emptyEvidence(): EvidenceEntry {
  return { source: "", quote: "", relevance: "" };
}

function CardSixPage() {
  const ae = usePainCardStore((s) => s.card.ai_evidence);
  const updateField = usePainCardStore((s) => s.updateField);

  const list = ae.evidences.length === 0 ? [emptyEvidence()] : ae.evidences;
  const ready = isCard6Ready(ae);

  function setEvidence(idx: number, patch: Partial<EvidenceEntry>) {
    const next = list.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    updateField("ai_evidence.evidences", next);
  }

  return (
    <CardScaffold
      step={9}
      title="Card 6 · 市場聲音的三段證據"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：找 3 段公開聲音 + 寫一句你的整體觀察。"
    >
      <RadioGroup<AiTool>
        label="你用了哪個工具找這些聲音？"
        value={ae.ai_tool}
        onChange={(v) => updateField("ai_evidence.ai_tool", v)}
        options={[
          { value: "chatgpt_dr" as const, label: "ChatGPT Deep Research" },
          { value: "perplexity" as const, label: "Perplexity" },
          { value: "claude" as const, label: "Claude" },
          { value: "gemini" as const, label: "Gemini" },
          { value: "in_app" as const, label: "其他（手動找）" },
        ]}
      />

      {list.map((e, idx) => (
        <CardBlock
          key={idx}
          title={`證據 ${idx + 1}`}
          onRemove={
            list.length > 1
              ? () => updateField("ai_evidence.evidences", list.filter((_, i) => i !== idx))
              : undefined
          }
        >
          <TextField
            label="來源"
            hint="網址 + 一句話描述"
            value={e.source}
            onChange={(v) => setEvidence(idx, { source: v })}
          />
          <TextareaField
            label="引用片段（不能只貼連結）"
            value={e.quote}
            onChange={(v) => setEvidence(idx, { quote: v })}
            rows={3}
          />
          <TextareaField
            label="為什麼這段跟我有關"
            value={e.relevance}
            onChange={(v) => setEvidence(idx, { relevance: v })}
            rows={2}
          />
        </CardBlock>
      ))}
      <button
        type="button"
        onClick={() => updateField("ai_evidence.evidences", [...list, emptyEvidence()])}
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        ＋ 加一段證據
      </button>

      <RadioGroup
        label="你的整體觀察"
        value={ae.landscape}
        onChange={(v) => updateField("ai_evidence.landscape", v)}
        options={[
          {
            value: "common_pain" as const,
            label: "看起來是 common pain",
            description: "外面有不少人說一樣的事",
          },
          {
            value: "niche_pain" as const,
            label: "看起來是 niche pain",
            description: "只有少數圈子在說",
          },
          {
            value: "unclear" as const,
            label: "目前還不夠清楚",
            description: "證據不夠，要再找",
          },
        ]}
      />
      <TextareaField
        label="一句話寫你看到了什麼"
        value={ae.landscape_note}
        onChange={(v) => updateField("ai_evidence.landscape_note", v)}
        rows={3}
      />
    </CardScaffold>
  );
}
