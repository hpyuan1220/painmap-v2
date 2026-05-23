import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  ListField,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { usePainCardStore } from "@/store/painCard";
import type { PersonWithGuesses } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/10")({
  head: () => ({
    meta: [
      { title: "Card 7 · 三個有名字的人 + 你心裡的猜想 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardSevenPage,
});

const INSTRUCTION = `三個人都要有名字 + 聯絡得到。
每人寫 3-5 個你預先猜他會說的答案 —
不是要你猜對，是要你記得自己的預期，
等一下訪談時才能辨認「驚訝」。`;

function emptyPerson(): PersonWithGuesses {
  return {
    name: "",
    contact: "",
    relation: "",
    why_pick_them: "",
    guessed_answers: [],
  };
}

function CardSevenPage() {
  const pwg = usePainCardStore((s) => s.card.people_with_guesses);
  const ensurePeopleSlots = usePainCardStore((s) => s.ensurePeopleSlots);
  const updateField = usePainCardStore((s) => s.updateField);

  // Ensure exactly 3 slots on first render
  const list =
    pwg.list.length === 0
      ? [emptyPerson(), emptyPerson(), emptyPerson()]
      : pwg.list.length < 3
        ? [...pwg.list, ...Array.from({ length: 3 - pwg.list.length }, emptyPerson)]
        : pwg.list;

  if (pwg.list.length < 3) {
    // Side-effect: top up to 3
    setTimeout(() => ensurePeopleSlots(3), 0);
  }

  const ready =
    list.length === 3 &&
    list.every(
      (p) =>
        p.name.trim() &&
        p.contact.trim() &&
        p.relation.trim() &&
        p.why_pick_them.trim() &&
        p.guessed_answers.filter((a) => a.trim()).length >= 3,
    );

  function setPerson(idx: number, patch: Partial<PersonWithGuesses>) {
    const next = list.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    updateField("people_with_guesses.list", next);
  }

  return (
    <CardScaffold
      step={10}
      title="Card 7 · 三個有名字的人 + 你心裡的猜想"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：3 個有名字 + 聯絡得到的人，每人至少 3 個你預先猜的答案。"
    >
      <TextareaField
        label="這三個人的共同背景"
        hint="年齡 / 職業 / 地點 / 共通處境⋯"
        value={pwg.background}
        onChange={(v) => updateField("people_with_guesses.background", v)}
        rows={3}
      />
      {list.map((p, idx) => (
        <CardBlock key={idx} title={`第 ${idx + 1} 個人`}>
          <TextField
            label="姓名"
            hint="你叫得出名字的人，不是「同事 A」"
            value={p.name}
            onChange={(v) => setPerson(idx, { name: v })}
          />
          <TextField
            label="聯絡方式"
            hint="LINE / 電話 / Email / IG 任一"
            value={p.contact}
            onChange={(v) => setPerson(idx, { contact: v })}
          />
          <TextField
            label="你跟他的關係"
            value={p.relation}
            onChange={(v) => setPerson(idx, { relation: v })}
          />
          <TextareaField
            label="為什麼想找他聊"
            value={p.why_pick_them}
            onChange={(v) => setPerson(idx, { why_pick_them: v })}
            rows={2}
          />
          <ListField
            label="你預先猜他會說的答案（3-5 個）"
            hint="不是要猜對，是要記得自己的預期"
            items={p.guessed_answers}
            onChange={(v) => setPerson(idx, { guessed_answers: v })}
            itemPlaceholder="預想他會說的一句話"
            addLabel="＋ 再加一個猜想"
          />
        </CardBlock>
      ))}
    </CardScaffold>
  );
}
