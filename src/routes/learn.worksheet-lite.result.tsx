import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { getLiteResultVerdict, isLiteFlowComplete, startNewPainCardLite } from "@/lib/painCardLite";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/result")({
  component: WorksheetLiteResultPage,
});

function WorksheetLiteResultPage() {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);

  useEffect(() => {
    if (!isLiteFlowComplete(card)) {
      navigate({ to: "/learn/worksheet-lite/01" });
    }
  }, [card, navigate]);

  if (!isLiteFlowComplete(card)) return null;

  return (
    <main className="bg-canvas-base min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            PainMap / 6-card condensed result
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-text-primary">
            你的 condensed pain ID card
          </h1>
          <p className="max-w-2xl text-[16px] leading-[1.7] text-text-secondary">
            保留原本 PainMap 的語氣與版型，但把核心判斷壓成 6 張卡，讓你更快走到真人訪談前。
          </p>
        </div>

        <section className="rounded-xl border border-border-hairline bg-canvas-raised p-6 sm:p-8 space-y-6">
          <ResultBlock title="1. 原句抱怨" body={card.complaint.verbatim} />
          <ResultBlock title="2. 選定方向" body={card.stuck_formula.ai_polished ?? ""} />
          <ResultBlock title="3. 焦點卡點" body={card.workaround.tool_name} />
          <ResultBlock title="4. 真正放不下的是" body={card.contradiction.sacrificed_reason} />
          <ResultBlock
            title="5. 市場判斷"
            body={card.ai_evidence.eight_answers.q7_possible_fake_pains}
          />
          <ResultBlock
            title="6. 3 個真人"
            body={card.people.list
              .map((person) => `${person.name}｜${person.contact}｜${person.relation}`)
              .join("\n")}
            pre
          />
          <ResultBlock title="7. 訪談題" body={card.interview_plan.questions.join("\n")} pre />
          <ResultBlock title="8. 最終判斷" body={getLiteResultVerdict(card.verdict.judgment)} />
          <ResultBlock title="9. 這輪想確認什麼" body={card.verdict.reason_100w} />
        </section>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => {
              const { path } = startNewPainCardLite();
              navigate({ to: path });
            }}
          >
            再做一張 6-card
          </Button>
          <Button asChild variant="outline">
            <Link to="/">回首頁</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/learn/worksheet/01">看原版 9-card 流程</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function ResultBlock({ title, body, pre = false }: { title: string; body: string; pre?: boolean }) {
  return (
    <section className="space-y-2">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
        {title}
      </h2>
      {pre ? (
        <pre className="whitespace-pre-wrap text-[15px] leading-[1.7] text-text-primary font-sans">
          {body}
        </pre>
      ) : (
        <p className="text-[15px] leading-[1.7] text-text-primary">{body}</p>
      )}
    </section>
  );
}
