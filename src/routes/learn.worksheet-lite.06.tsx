import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { usePainCardStore } from "@/store/painCard";
import type { Judgment } from "@/types/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/06")({
  component: CardLite06Page,
});

function CardLite06Page() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const questions = [...card.interview_plan.questions];
  while (questions.length < 3) questions.push("");

  const next = () => {
    if (
      questions.some((question) => question.trim().length < 8) ||
      !card.verdict.judgment ||
      card.verdict.reason_100w.trim().length < 12
    ) {
      return;
    }
    updateField("interview_plan.questions", questions);
    updateField("verdict.next_action", "interview");
    advanceStep(6);
    navigate({ to: "/learn/worksheet-lite/result" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero
          illustration="e10-interviewer-portrait"
          alt="帶著問題去問真人，而不是帶著答案去推銷"
        />
        <WorksheetCardHeader
          cardNumber={6}
          totalCards={6}
          aiStatus="enabled"
          title="把訪談題寫好，再誠實做一次真假判斷"
          rule="問題要拿來驗證這個痛存不存在，不是拿來偷問對方會不會買。"
          intro="這張卡把訪談腳本和 verdict 合在一起，完成後直接產出 condensed 版 ID card。"
        />

        <section className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {questions.slice(0, 3).map((question, index) => (
              <LiteField key={index} label={`訪談題 ${index + 1}`}>
                <Textarea
                  rows={4}
                  value={question}
                  onChange={(e) => {
                    questions[index] = e.target.value;
                    updateField("interview_plan.questions", [...questions]);
                  }}
                  placeholder="例如：你最近一次遇到這件事是什麼時候？當時你怎麼處理？"
                />
              </LiteField>
            ))}
          </div>

          <LiteField label="真假判斷">
            <RadioGroup
              value={card.verdict.judgment ?? ""}
              onValueChange={(value) => updateField("verdict.judgment", value as Judgment)}
              className="gap-3"
            >
              <label className="flex items-center gap-3 rounded-md border border-border-hairline p-3">
                <RadioGroupItem value="pending_interview" />
                <span>小眾真痛或還需訪談確認</span>
              </label>
              <label className="flex items-center gap-3 rounded-md border border-border-hairline p-3">
                <RadioGroupItem value="true_pain" />
                <span>普遍真痛</span>
              </label>
              <label className="flex items-center gap-3 rounded-md border border-border-hairline p-3">
                <RadioGroupItem value="fake_pain" />
                <span>目前比較像我自己以為</span>
              </label>
            </RadioGroup>
          </LiteField>

          <LiteField
            label="我要去問這 3 個人，是想確認..."
            helper="用一句話把這輪訪談的意圖寫清楚。"
          >
            <Textarea
              rows={3}
              value={card.verdict.reason_100w}
              onChange={(e) => updateField("verdict.reason_100w", e.target.value)}
              placeholder="例如：我想確認交接資訊失真到底是普遍問題，還是只發生在某些多人協作的小團隊。"
            />
          </LiteField>

          <LiteFooterNav
            onBack={() => navigate({ to: "/learn/worksheet-lite/05" })}
            onNext={next}
            nextLabel="產生 6 卡 ID Card"
            blockedMessage={!card.verdict.judgment ? "先完成 3 題訪談題，並選一個最終判斷。" : null}
          />
        </section>
      </main>
    </div>
  );
}
