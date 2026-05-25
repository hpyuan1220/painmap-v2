import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { Textarea } from "@/components/ui/textarea";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/04")({
  component: CardLite04Page,
});

function CardLite04Page() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);

  const next = () => {
    if (
      card.ai_evidence.raw_response.trim().length < 20 ||
      card.ai_evidence.eight_answers.q5_public_evidence.trim().length < 10
    ) {
      return;
    }
    advanceStep(5);
    navigate({ to: "/learn/worksheet-lite/05" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero
          illustration="e15-evidence-stack"
          alt="把你真正放不下的事，拿去照市場裡有沒有人也在痛"
        />
        <WorksheetCardHeader
          cardNumber={4}
          totalCards={6}
          aiStatus="required"
          title="先列證據，不先下結論"
          rule="這張卡只做市場驗證。AI 可以幫你列出線索，但不要搶著給解法。"
          intro="把 Card 3 的那句『我真正放不下的是...』拿去看市場有沒有人也在講。"
        />

        <section className="space-y-8">
          <LiteField
            label="AI 找到的 3 條市場證據"
            helper="可以是社群討論、評論、文章摘要，重點是先蒐集。"
          >
            <Textarea
              rows={8}
              value={card.ai_evidence.raw_response}
              onChange={(e) => updateField("ai_evidence.raw_response", e.target.value)}
              placeholder="1. Reddit 某串有人抱怨...&#10;2. G2 評論提到...&#10;3. 社群討論裡有人說..."
            />
          </LiteField>

          <LiteField
            label="你的判斷：這些是同一個痛嗎？"
            helper="寫同 / 不同 / 部分相關，並說明為什麼。"
          >
            <Textarea
              rows={4}
              value={card.ai_evidence.eight_answers.q5_public_evidence}
              onChange={(e) =>
                updateField("ai_evidence.eight_answers.q5_public_evidence", e.target.value)
              }
              placeholder="例如：第 1 和第 3 條是同一個痛，第 2 條只部分相關，因為它講的是導入成本，不是交接失真。"
            />
          </LiteField>

          <LiteField label="一句總結" helper="小眾 / 普遍 / 我自己以為。">
            <Textarea
              rows={3}
              value={card.ai_evidence.eight_answers.q7_possible_fake_pains}
              onChange={(e) =>
                updateField("ai_evidence.eight_answers.q7_possible_fake_pains", e.target.value)
              }
              placeholder="例如：這比較像小眾但真實存在的痛，集中在多人交接又沒有統一流程的團隊。"
            />
          </LiteField>

          <LiteFooterNav
            onBack={() => navigate({ to: "/learn/worksheet-lite/03" })}
            onNext={next}
            blockedMessage={
              card.ai_evidence.raw_response.trim().length < 20
                ? "先把至少 3 條市場證據整理在這張卡上。"
                : null
            }
          />
        </section>
      </main>
    </div>
  );
}
