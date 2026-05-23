import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { usePainCardStore } from "@/store/painCard";
import type { PainDiaryEntry } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/02")({
  head: () => ({
    meta: [
      { title: "Card A · 痛點現場日記 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardAPage,
});

const INSTRUCTION = `接下來幾天，當這個卡住的感覺又冒出來時，
隨手寫一兩句進來就好。

不用整理、不用美化，誠實的當下最有用。
我們建議 3 筆，但 1 筆也可以走下一張。`;

function emptyEntry(): PainDiaryEntry {
  return {
    timestamp: new Date().toISOString().slice(0, 16),
    location: "",
    mood: "",
    trigger: "",
    note: "",
  };
}

function CardAPage() {
  const entries = usePainCardStore((s) => s.card.pain_diary.entries);
  const updateField = usePainCardStore((s) => s.updateField);

  const list = entries.length === 0 ? [emptyEntry()] : entries;
  const ready =
    list.length >= 1 &&
    list.every((e) => e.timestamp && e.location.trim() && e.note.trim());

  function setEntry(idx: number, patch: Partial<PainDiaryEntry>) {
    const next = list.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    updateField("pain_diary.entries", next);
  }

  function addEntry() {
    updateField("pain_diary.entries", [...list, emptyEntry()]);
  }

  function removeEntry(idx: number) {
    updateField(
      "pain_diary.entries",
      list.filter((_, i) => i !== idx),
    );
  }

  return (
    <CardScaffold
      step={2}
      title="Card A · 痛點現場日記"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="我們需要至少 1 筆現場日記才能繼續。先把這頁存著，下次卡住時再回來。"
    >
      {list.map((entry, idx) => (
        <CardBlock
          key={idx}
          title={`現場 ${idx + 1}`}
          onRemove={list.length > 1 ? () => removeEntry(idx) : undefined}
        >
          <TextField
            label="時間"
            type="datetime-local"
            value={entry.timestamp}
            onChange={(v) => setEntry(idx, { timestamp: v })}
          />
          <TextField
            label="地點"
            hint="家、辦公室、通勤路上…"
            value={entry.location}
            onChange={(v) => setEntry(idx, { location: v })}
          />
          <TextField
            label="當下心情"
            hint="一兩個詞就好"
            value={entry.mood}
            onChange={(v) => setEntry(idx, { mood: v })}
          />
          <TextareaField
            label="是什麼觸發了這一刻？"
            value={entry.trigger}
            onChange={(v) => setEntry(idx, { trigger: v })}
            rows={2}
          />
          <TextareaField
            label="自由書寫"
            hint="原話或描述，誠實就好"
            value={entry.note}
            onChange={(v) => setEntry(idx, { note: v })}
            rows={3}
          />
        </CardBlock>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        ＋ 加一筆現場日記
      </button>
    </CardScaffold>
  );
}
