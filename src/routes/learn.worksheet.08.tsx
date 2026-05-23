import { createFileRoute } from "@tanstack/react-router";

import { CardScaffold } from "@/components/worksheet/CardScaffold";
import {
  CardBlock,
  RadioGroup,
  TextField,
  TextareaField,
} from "@/components/worksheet/WorksheetFormPrimitives";
import { usePainCardStore } from "@/store/painCard";
import type { ContradictionPair } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet/08")({
  head: () => ({
    meta: [
      { title: "Card 5 · 取捨對話 — PainMap Worksheet" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardFivePage,
});

const INSTRUCTION = `每個卡住的故事裡通常都藏著「想要兩個東西，但只能選一個」的取捨。

寫一組就可以走下一張，但 3 組會讓你更看清楚自己的優先序。

「我想要 A，也想要 B。
 但如果一定要選，我會選 ___，因為 ___。」`;

function emptyPair(): ContradictionPair {
  return { side_a: "", side_b: "", picked: "a", reason: "" };
}

function CardFivePage() {
  const pairs = usePainCardStore((s) => s.card.contradiction.pairs);
  const updateField = usePainCardStore((s) => s.updateField);

  const list = pairs.length === 0 ? [emptyPair()] : pairs;
  const ready =
    list.length >= 1 &&
    list.every((p) => p.side_a.trim() && p.side_b.trim() && p.reason.trim());

  function setPair(idx: number, patch: Partial<ContradictionPair>) {
    const next = list.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    updateField("contradiction.pairs", next);
  }

  function addPair() {
    updateField("contradiction.pairs", [...list, emptyPair()]);
  }

  function removePair(idx: number) {
    updateField(
      "contradiction.pairs",
      list.filter((_, i) => i !== idx),
    );
  }

  return (
    <CardScaffold
      step={8}
      title="Card 5 · 取捨對話"
      instruction={INSTRUCTION}
      readyToContinue={ready}
      notReadyHint="走下一張卡前：至少寫一組取捨（A、B、選哪個、為什麼）。"
    >
      {list.map((pair, idx) => (
        <CardBlock
          key={idx}
          title={`取捨 ${idx + 1}`}
          onRemove={list.length > 1 ? () => removePair(idx) : undefined}
        >
          <TextField
            label="A 端：他想要這個"
            value={pair.side_a}
            onChange={(v) => setPair(idx, { side_a: v })}
          />
          <TextField
            label="B 端：他也想要這個"
            value={pair.side_b}
            onChange={(v) => setPair(idx, { side_b: v })}
          />
          <RadioGroup
            label="如果一定要選"
            value={pair.picked}
            onChange={(v) => setPair(idx, { picked: v })}
            options={[
              { value: "a" as const, label: "我會選 A" },
              { value: "b" as const, label: "我會選 B" },
            ]}
          />
          <TextareaField
            label="為什麼"
            value={pair.reason}
            onChange={(v) => setPair(idx, { reason: v })}
            rows={2}
          />
        </CardBlock>
      ))}
      <button
        type="button"
        onClick={addPair}
        className="self-start text-[13px] text-text-secondary hover:text-text-primary py-1"
      >
        ＋ 再加一組取捨
      </button>
    </CardScaffold>
  );
}
