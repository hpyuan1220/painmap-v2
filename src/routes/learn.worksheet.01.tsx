import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import { isCard1Ready } from "@/lib/cardValidators";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet/01")({
  head: () => ({
    meta: [
      { title: "Card 1 · 那句脫口而出的話 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardOnePage,
});

const INSTRUCTION = `先別整理、也別修飾。
把那句最近從你（或從你身邊的人）嘴裡跑出來的抱怨，原汁原味寫下來就好。

這張卡片只屬於你，AI 不會看，也不會幫你修。
等一下我們會慢慢一起回到這句話裡，聽聽看它在說什麼。`;

const NOT_READY_HINT = `走下一張卡前，我們想多聽你說兩件事：
- 這句話是誰說的？（一個你叫得出名字的人）
- 大概什麼時候、什麼場景下說的？

不用很完美，先把你記得的寫下來就好。`;

function CardOnePage() {
  const complaint = usePainCardStore((s) => s.card.complaint);
  const updateField = usePainCardStore((s) => s.updateField);

  const ready = isCard1Ready(complaint);

  return (
    <CardScaffold
      step={1}
      title="Card 1 · 那句脫口而出的話"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint={NOT_READY_HINT}
    >
      <Field
        label="那句脫口而出的話"
        hint="寫下他說過的那句話，不用修飾"
        value={complaint.verbatim}
        onChange={(v) => updateField("complaint.verbatim", v)}
        textarea
        rows={5}
      />
      <Field
        label="是誰說的"
        hint="一個你叫得出名字的人"
        value={complaint.source_name}
        onChange={(v) => updateField("complaint.source_name", v)}
      />
      <Field
        label="你跟他的關係"
        value={complaint.source_relation}
        onChange={(v) => updateField("complaint.source_relation", v)}
      />
      <Field
        label="大概什麼時候說的"
        hint="哪一天 / 哪一週都可以"
        value={complaint.datetime}
        onChange={(v) => updateField("complaint.datetime", v)}
      />
      <Field
        label="當時的場景"
        hint="他在做什麼、在哪裡"
        value={complaint.scene}
        onChange={(v) => updateField("complaint.scene", v)}
        textarea
        rows={3}
      />
    </CardScaffold>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
};

function Field({ label, hint, value, onChange, textarea, rows = 2 }: FieldProps) {
  const id = useId();
  const handleValueChange = (v: string) => onChange(v);
  const className =
    "w-full rounded-md border border-border-hairline bg-canvas-raised px-3 py-2.5 text-[15px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-primary";
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onInput={(e) => handleValueChange(e.currentTarget.value)}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={hint}
          className={className}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onInput={(e) => handleValueChange(e.currentTarget.value)}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={hint}
          className={className}
        />
      )}
    </div>
  );
}
