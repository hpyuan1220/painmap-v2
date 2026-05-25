import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getTradeoffOptions } from "@/lib/painCardLite";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/03")({
  component: CardLite03Page,
});

function CardLite03Page() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const tradeoffs = getTradeoffOptions(card.workaround.tool_name);

  const next = () => {
    if (
      !card.contradiction.sacrificed ||
      card.contradiction.side_a.trim().length < 8 ||
      card.contradiction.side_b.trim().length < 8 ||
      card.contradiction.sacrificed_reason.trim().length < 10
    ) {
      return;
    }
    advanceStep(4);
    navigate({ to: "/learn/worksheet-lite/04" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero
          illustration="e14-contradiction-scale"
          alt="兩邊都想保住，但一定有一邊一直被犧牲"
        />
        <WorksheetCardHeader
          cardNumber={3}
          totalCards={6}
          aiStatus="enabled"
          title="真正放不下的，不是表面答案，是你一直犧牲的那一邊"
          rule="每題都要選 A 或 B，最後再收成一句『我真正放不下的是...』。"
          intro="這張卡承接 proposal 的 TRIZ 兩難取捨，先釐清要驗證什麼，再去找市場證據。"
        />

        <section className="space-y-8">
          {tradeoffs.map((item, index) => (
            <div
              key={index}
              className="rounded-md border border-border-hairline bg-canvas-raised p-5 space-y-4"
            >
              <div>
                <h2 className="text-[16px] font-semibold text-text-primary">{item.prompt}</h2>
              </div>
              <RadioGroup
                value={index === 0 ? (card.contradiction.sacrificed ?? "") : ""}
                onValueChange={(value) => {
                  if (index === 0) updateField("contradiction.sacrificed", value);
                }}
                className="gap-3"
              >
                <label className="flex items-center gap-3 rounded-md border border-border-hairline p-3">
                  <RadioGroupItem value="a" />
                  <span>{item.a}</span>
                </label>
                <label className="flex items-center gap-3 rounded-md border border-border-hairline p-3">
                  <RadioGroupItem value="b" />
                  <span>{item.b}</span>
                </label>
              </RadioGroup>
              <LiteField label="理由">
                <Textarea
                  rows={3}
                  value={
                    index === 0
                      ? card.contradiction.side_a
                      : index === 1
                        ? card.contradiction.side_b
                        : ""
                  }
                  onChange={(e) => {
                    if (index === 0) updateField("contradiction.side_a", e.target.value);
                    if (index === 1) updateField("contradiction.side_b", e.target.value);
                    if (index === 2) updateField("contradiction.sacrificed_reason", e.target.value);
                  }}
                  placeholder="寫下你為什麼更在意這一邊。"
                />
              </LiteField>
            </div>
          ))}

          <LiteField label="我真正放不下的是..." helper="用一句完整的話收尾。">
            <Textarea
              rows={3}
              value={card.contradiction.sacrificed_reason}
              onChange={(e) => updateField("contradiction.sacrificed_reason", e.target.value)}
              placeholder="例如：我真正放不下的是交接時不要失真，因為一失真就要整組人回頭重做。"
            />
          </LiteField>

          <LiteFooterNav
            onBack={() => navigate({ to: "/learn/worksheet-lite/02" })}
            onNext={next}
            blockedMessage={
              !card.contradiction.sacrificed
                ? "先做一次明確取捨，再寫下你真正放不下的是什麼。"
                : null
            }
          />
        </section>
      </main>
    </div>
  );
}
