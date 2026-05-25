import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { getLiteDirectionOptions } from "@/lib/painCardLite";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/01")({
  component: CardLite01Page,
});

function CardLite01Page() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const directions = getLiteDirectionOptions(card.complaint.verbatim);

  const next = () => {
    if (
      card.complaint.verbatim.trim().length < 10 ||
      card.complaint.source_name.trim().length < 1 ||
      (card.stuck_formula.ai_polished ?? "").trim().length < 10
    ) {
      return;
    }
    advanceStep(2);
    navigate({ to: "/learn/worksheet-lite/02" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero illustration="e1-knot-unraveling" alt="把模糊抱怨收進一條更清楚的線索" />
        <WorksheetCardHeader
          cardNumber={1}
          totalCards={6}
          aiStatus="enabled"
          title="抱怨先不要解，先收斂成一個方向"
          rule="先忠實寫下原句，再從 3 個更窄的方向裡挑 1 個。這張卡不是找答案，是決定先追哪一條線。"
          intro="沿用原本 worksheet 的節奏，但把 1A / 1B 的收斂動作合在同一張卡裡。"
        />

        <section className="space-y-8">
          <LiteField label="原句抱怨" helper="保留對方原來的口氣，至少 10 字。">
            <Textarea
              rows={4}
              value={card.complaint.verbatim}
              onChange={(e) => updateField("complaint.verbatim", e.target.value)}
              placeholder="例如：我每次整理客戶資訊都要翻 5 個地方，最後還是會漏掉。"
            />
          </LiteField>

          <LiteField label="是誰說的" helper="先保留真人名字，後面找真人時會接得上。">
            <Textarea
              rows={2}
              value={card.complaint.source_name}
              onChange={(e) => updateField("complaint.source_name", e.target.value)}
              placeholder="例如：Maggie，做社群代營運的朋友"
            />
          </LiteField>

          <div className="rounded-md border border-border-hairline bg-canvas-raised p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">AI 收斂漏斗</h2>
              <p className="mt-1 text-[14px] leading-[1.6] text-text-secondary">
                先用目前這句抱怨，往下挑一條最值得追的方向。
              </p>
            </div>
            <div className="grid gap-3">
              {directions.map((direction) => {
                const active = card.stuck_formula.ai_polished === direction;
                return (
                  <Button
                    key={direction}
                    type="button"
                    variant={active ? "default" : "outline"}
                    className="h-auto justify-start whitespace-normal py-3 text-left"
                    onClick={() => updateField("stuck_formula.ai_polished", direction)}
                  >
                    {direction}
                  </Button>
                );
              })}
            </div>
          </div>

          <LiteField label="為什麼選這個方向" helper="用一句話說你為什麼先查這條。">
            <Textarea
              rows={3}
              value={card.stuck_formula.ai_clarifying_answers[0]?.answer ?? ""}
              onChange={(e) =>
                updateField("stuck_formula.ai_clarifying_answers", [
                  {
                    question: "為什麼選這個方向",
                    answer: e.target.value,
                    reserved: false,
                  },
                ])
              }
              placeholder="例如：因為這條最接近我真的看過有人重複卡住的地方。"
            />
          </LiteField>

          <LiteFooterNav
            onNext={next}
            blockedMessage={
              card.complaint.verbatim.trim().length < 10 ||
              card.complaint.source_name.trim().length < 1 ||
              (card.stuck_formula.ai_polished ?? "").trim().length < 10
                ? "先寫下原句、來源名字，並選一個收斂方向。"
                : null
            }
          />
        </section>
      </main>
    </div>
  );
}
