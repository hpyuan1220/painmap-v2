import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { Textarea } from "@/components/ui/textarea";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/02")({
  component: CardLite02Page,
});

function CardLite02Page() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const next = () => {
    if (
      card.workaround.tool_name.trim().length < 10 ||
      card.workaround.why_still_stuck.trim().length < 20 ||
      card.workaround.user_dissatisfactions.filter((item) => item.trim().length >= 8).length < 2
    ) {
      return;
    }
    advanceStep(3);
    navigate({ to: "/learn/worksheet-lite/03" });
  };

  const dissatisfactions = [...card.workaround.user_dissatisfactions];
  while (dissatisfactions.length < 2) dissatisfactions.push("");

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero illustration="e13-stuck-loop" alt="先承認現在怎麼硬撐，才找得到真正卡住的地方" />
        <WorksheetCardHeader
          cardNumber={2}
          totalCards={6}
          aiStatus="enabled"
          title="把焦點痛點，壓到一個真的卡住的步驟"
          rule="這張卡要把『方向』壓到『卡點』。不要泛泛地說難，而是寫出你以為的解法、試過哪些、現在卡在哪。"
          intro="原 proposal 的 Card 2：sub-issue + 卡關公式三問。"
        />

        <section className="space-y-8">
          <LiteField label="焦點痛點" helper="用一句話講清楚你現在追的是哪個具體卡點。">
            <Textarea
              rows={3}
              value={card.workaround.tool_name}
              onChange={(e) => updateField("workaround.tool_name", e.target.value)}
              placeholder="例如：我不是不知道要整理資料，我卡在每次交接前根本不知道哪份才是最新版。"
            />
          </LiteField>

          <LiteField label="我以為的解法是什麼" helper="先寫你原本直覺會怎麼解。">
            <Textarea
              rows={3}
              value={card.workaround.ai_alternatives[0] ?? ""}
              onChange={(e) => updateField("workaround.ai_alternatives", [e.target.value])}
              placeholder="例如：我以為只要做一份統一表格就會好。"
            />
          </LiteField>

          <LiteField label="試過哪些，為什麼沒用" helper="至少一句完整描述。">
            <Textarea
              rows={4}
              value={card.workaround.why_still_stuck}
              onChange={(e) => updateField("workaround.why_still_stuck", e.target.value)}
              placeholder="例如：我試過共用試算表，但每個人還是各自留自己的版本，所以最後還是得人工比對。"
            />
          </LiteField>

          <div className="grid gap-6 md:grid-cols-2">
            {dissatisfactions.slice(0, 2).map((value, index) => (
              <LiteField
                key={index}
                label={`AI 反問盲點 ${index + 1}`}
                helper="這裡不給答案，只幫你再挖深一點。"
              >
                <Textarea
                  rows={4}
                  value={value}
                  onChange={(e) => {
                    const nextList = [...dissatisfactions];
                    nextList[index] = e.target.value;
                    updateField("workaround.user_dissatisfactions", nextList);
                  }}
                  placeholder={
                    index === 0
                      ? "你現在真正動不了的那一步，到底是在判斷、協作，還是追蹤？"
                      : "如果這一步一直不改善，最常受影響的是誰？"
                  }
                />
              </LiteField>
            ))}
          </div>

          <LiteFooterNav
            onBack={() => navigate({ to: "/learn/worksheet-lite/01" })}
            onNext={next}
            blockedMessage={
              card.workaround.tool_name.trim().length < 10 ||
              card.workaround.why_still_stuck.trim().length < 20
                ? "先把焦點痛點和『為什麼現在還是卡住』寫具體。"
                : null
            }
          />
        </section>
      </main>
    </div>
  );
}
