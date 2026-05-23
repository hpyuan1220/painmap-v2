import { createFileRoute } from "@tanstack/react-router";

import { AIPromptCopyBlock } from "@/components/worksheet/AIPromptCopyBlock";
import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  ListField,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { isCardGReady } from "@/lib/cardValidators";
import { parseCardGThemes } from "@/lib/parsers/cardGThemesParser";
import { usePainCardStore } from "@/store/painCard";
import type { ClusteredTheme, InterviewSession, AssumptionItem } from "@/types/painCard";
import { useState } from "react";

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

function buildPrompt(
  focusedSummary: string,
  assumptions: AssumptionItem[],
  sessions: InterviewSession[],
) {
  const sessionsText = sessions
    .map(
      (s, i) => `
場次 ${i + 1}（${s.person_name}，${s.mode}，${s.datetime}）：
- 印象深刻的原話：${s.key_quotes.filter((q) => q.trim()).join("； ") || "—"}
- 驚訝的地方：${s.surprises.filter((x) => x.trim()).join("； ") || "—"}
- 猜對的：${s.confirmed_guesses.filter((x) => x.trim()).join("； ") || "—"}
- 新的線索：${s.new_threads.filter((x) => x.trim()).join("； ") || "—"}`,
    )
    .join("\n");

  const assumptionsText = assumptions
    .map((a) => `- 假設：${a.assumption}；證據：${a.evidence_so_far}；修正條件：${a.what_would_change_my_mind}`)
    .join("\n");

  return `我剛跟幾個人聊完，這邊有對話記錄。
想請你陪我把這些聲音整理成幾個主題 — 但**只能用我寫下來的話**，
不要替我發明新的細節，也不要替我下結論。

我聚焦的痛點摘要：
${focusedSummary || "（暫時還沒寫）"}

我訪談前的自我假設：
${assumptionsText || "（暫時還沒寫）"}

訪談對話記錄：
${sessionsText || "（暫時還沒寫）"}

想請你幫我做兩件事：
1. 把訪談裡的聲音聚類成 3-5 個主題。每個主題附：
   - 主題名（一個短語）
   - 連結到原話的引用（2-3 段）
2. 列出 3 個我可能想回頭跟受訪者再 confirm 的問題（member check）。

別替我打分數、別替我下「這是真痛點」「這是假痛點」、別替我規劃下一步。
我自己會看完你整理的主題，決定要保留、重命名還是丟掉，
然後自己寫一段沉澱。`;
}

function emptyTheme(): ClusteredTheme {
  return { theme: "", supporting_quotes: [], user_kept: true };
}

function CardGPage() {
  const card = usePainCardStore((s) => s.card);
  const pis = card.post_interview_synthesis;
  const updateField = usePainCardStore((s) => s.updateField);
  const [aiResponse, setAiResponse] = useState("");
  const [parseHint, setParseHint] = useState<string | null>(null);

  const themes = pis.ai_clustered_themes.length === 0 ? [emptyTheme()] : pis.ai_clustered_themes;

  function handleAiResponseChange(value: string) {
    setAiResponse(value);
    if (!value.trim()) {
      setParseHint(null);
      return;
    }
    const parsed = parseCardGThemes(value);
    if (parsed.length === 0) {
      setParseHint("我們在這段回應裡找不到「主題 1 / 2 / 3」的標題格式 — 沒關係，你可以自己填到下面的主題卡。");
      return;
    }
    updateField("post_interview_synthesis.ai_clustered_themes", parsed);
    setParseHint(`已幫你整理出 ${parsed.length} 個主題到下面。每個都可以保留、重命名或丟掉。`);
  }
  const summaryLen = pis.user_summary.trim().length;
  const ready = isCardGReady(pis);

  const prompt = buildPrompt(
    card.focused_pain.summary,
    card.assumptions.items,
    card.interview.sessions,
  );

  function setTheme(idx: number, patch: Partial<ClusteredTheme>) {
    const next = themes.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    updateField("post_interview_synthesis.ai_clustered_themes", next);
  }

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
      <AIPromptCopyBlock
        prompt={prompt}
        response={aiResponse}
        onResponseChange={handleAiResponseChange}
        title="想請 AI 陪我把訪談聲音整理成主題"
      />

      {parseHint && (
        <p className="text-[13px] leading-relaxed text-text-secondary">
          {parseHint}
        </p>
      )}

      <p className="text-[13px] text-text-secondary">
        AI 給你 3-5 個主題後，貼回上方。下面會自動填入，你可以保留、重命名，或丟掉。
      </p>

      {themes.map((t, idx) => (
        <CardBlock
          key={idx}
          title={`主題 ${idx + 1}`}
          onRemove={
            themes.length > 1
              ? () =>
                  updateField(
                    "post_interview_synthesis.ai_clustered_themes",
                    themes.filter((_, i) => i !== idx),
                  )
              : undefined
          }
        >
          <TextField
            label="主題名"
            value={t.theme}
            onChange={(v) => setTheme(idx, { theme: v })}
          />
          <ListField
            label="支持這個主題的原話"
            items={t.supporting_quotes}
            onChange={(v) => setTheme(idx, { supporting_quotes: v })}
            addLabel="＋ 再加一條引用"
          />
          <TextField
            label="想重新命名嗎？（選填）"
            hint="留空則保留原名"
            value={t.user_renamed_to || ""}
            onChange={(v) => setTheme(idx, { user_renamed_to: v })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={t.user_kept}
              onChange={(e) => setTheme(idx, { user_kept: e.target.checked })}
            />
            <span className="text-[14px] text-text-secondary">保留這個主題</span>
          </label>
        </CardBlock>
      ))}
      <button
        type="button"
        onClick={() =>
          updateField("post_interview_synthesis.ai_clustered_themes", [...themes, emptyTheme()])
        }
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        ＋ 再加一個主題
      </button>

      <div className="flex flex-col gap-1">
        <TextareaField
          label="用你自己的話寫一段沉澱"
          hint="80 字以上，不是 AI 的話"
          value={pis.user_summary}
          onChange={(v) => updateField("post_interview_synthesis.user_summary", v)}
          rows={6}
        />
        <span className="text-[11px] text-text-tertiary self-end font-mono tabular-nums">
          {summaryLen} 字 / 建議 80+
        </span>
      </div>

      <ListField
        label="想回頭跟受訪者再 confirm 的問題（member check）"
        items={pis.member_check_questions}
        onChange={(v) => updateField("post_interview_synthesis.member_check_questions", v)}
        addLabel="＋ 再加一個問題"
      />
    </CardScaffold>
  );
}
