import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  ListField,
  RadioGroup,
  TextField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { isCard8Ready } from "@/lib/cardValidators";
import { usePainCardStore } from "@/store/painCard";
import type { InterviewMode, InterviewSession } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/12")({
  head: () => ({
    meta: [
      { title: "Card 8 · 真人對話 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardEightPage,
});

const INSTRUCTION = `跟 Card 7 的三個人聊完之後，回來記錄你聽到了什麼。

一場對話也可以走下一張，但 3 場會讓你更看清楚
哪些是個別的、哪些是共通的。

不用寫成逐字稿，幾句印象深刻的原話就好。`;

function emptySession(): InterviewSession {
  return {
    person_name: "",
    datetime: new Date().toISOString().slice(0, 16),
    mode: "in_person",
    consent_recorded: false,
    key_quotes: [],
    surprises: [],
    confirmed_guesses: [],
    new_threads: [],
  };
}

function CardEightPage() {
  const sessions = usePainCardStore((s) => s.card.interview.sessions);
  const peopleList = usePainCardStore((s) => s.card.people_with_guesses.list);
  const updateField = usePainCardStore((s) => s.updateField);

  const list = sessions.length === 0 ? [emptySession()] : sessions;
  const ready = isCard8Ready({ sessions });

  function setSession(idx: number, patch: Partial<InterviewSession>) {
    const next = list.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    updateField("interview.sessions", next);
  }

  const knownNames = peopleList.map((p) => p.name).filter(Boolean);

  return (
    <CardScaffold
      step={12}
      title="Card 8 · 真人對話"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少寫下 1 場對話，每場至少記一句印象深刻的原話。"
    >
      {list.map((s, idx) => (
        <CardBlock
          key={idx}
          title={`對話 ${idx + 1}`}
          onRemove={
            list.length > 1
              ? () => updateField("interview.sessions", list.filter((_, i) => i !== idx))
              : undefined
          }
        >
          {knownNames.length > 0 ? (
            <RadioGroup
              label="對話對象（來自 Card 7）"
              value={s.person_name}
              onChange={(v) => setSession(idx, { person_name: v })}
              options={knownNames.map((n) => ({ value: n, label: n }))}
            />
          ) : (
            <TextField
              label="對話對象"
              value={s.person_name}
              onChange={(v) => setSession(idx, { person_name: v })}
            />
          )}
          <TextField
            label="時間"
            type="datetime-local"
            value={s.datetime}
            onChange={(v) => setSession(idx, { datetime: v })}
          />
          <RadioGroup<InterviewMode>
            label="對話方式"
            value={s.mode}
            onChange={(v) => setSession(idx, { mode: v })}
            options={[
              { value: "in_person", label: "面對面" },
              { value: "video_call", label: "視訊通話" },
              { value: "phone", label: "電話" },
              { value: "chat", label: "文字聊天" },
            ]}
          />
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={s.consent_recorded}
              onChange={(e) => setSession(idx, { consent_recorded: e.target.checked })}
              className="mt-1"
            />
            <span className="text-[14px] text-text-secondary">
              已取得對方做訪談記錄的同意（建議先取得對方同意再做記錄）
            </span>
          </label>
          <ListField
            label="印象深刻的原話"
            items={s.key_quotes}
            onChange={(v) => setSession(idx, { key_quotes: v })}
            itemPlaceholder="幾句他真的說過的話"
            addLabel="＋ 再加一句原話"
          />
          <ListField
            label="哪些是猜錯的（驚訝）"
            items={s.surprises}
            onChange={(v) => setSession(idx, { surprises: v })}
            addLabel="＋ 再加一條驚訝"
          />
          <ListField
            label="哪些是猜對的"
            items={s.confirmed_guesses}
            onChange={(v) => setSession(idx, { confirmed_guesses: v })}
            addLabel="＋ 再加一條"
          />
          <ListField
            label="新的線索"
            items={s.new_threads}
            onChange={(v) => setSession(idx, { new_threads: v })}
            addLabel="＋ 再加一條"
          />
        </CardBlock>
      ))}
      <button
        type="button"
        onClick={() => updateField("interview.sessions", [...list, emptySession()])}
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        ＋ 加一場對話
      </button>
    </CardScaffold>
  );
}
