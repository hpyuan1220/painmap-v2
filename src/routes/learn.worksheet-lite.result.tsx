import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getWorksheetFlowConfig } from "@/lib/worksheetFlowRegistry";
import { usePainCardStore } from "@/store/painCard";

export const Route = createFileRoute("/learn/worksheet-lite/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    flow: search.flow === "ai-detective" ? "ai-detective" : "lite",
  }),
  component: WorksheetLiteResultPage,
});

function WorksheetLiteResultPage() {
  const navigate = useNavigate();
  const { flow } = Route.useSearch();
  const config = getWorksheetFlowConfig(flow);
  const card = usePainCardStore((s) => s.card);
  const createCard = usePainCardStore((s) => s.createCard);

  return (
    <main className="bg-canvas-base min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            PainMap / {config.title} result
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-text-primary">
            你的 {config.title} pain card
          </h1>
          <p className="max-w-2xl text-[16px] leading-[1.7] text-text-secondary">
            這張結果卡整理了你在 flow 中最後留下來、並真正採用回卡片的內容。
          </p>
        </div>

        <section className="rounded-xl border border-border-hairline bg-canvas-raised p-6 sm:p-8 space-y-6">
          <ResultBlock title="原句抱怨" body={card.complaint.verbatim} />
          <ResultBlock title="目前收斂版本" body={card.stuck_formula.ai_polished ?? ""} />
          <ResultBlock title="焦點卡點" body={card.workaround.tool_name} />
          <ResultBlock title="現在為什麼還卡" body={card.workaround.why_still_stuck} />
          <ResultBlock title="我真正放不下的是..." body={card.contradiction.sacrificed_reason} />
          <ResultBlock title="市場證據摘要" body={card.ai_evidence.raw_response} pre />
          <ResultBlock title="市場判斷" body={card.ai_evidence.eight_answers.q7_possible_fake_pains} />
          <ResultBlock title="這輪想確認什麼" body={card.verdict.reason_100w} />
          <ResultBlock title="最有把握的證據" body={card.verdict.most_confident_evidence} />
          <ResultBlock title="最沒把握的地方" body={card.verdict.least_confident} />
        </section>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => {
              createCard();
              navigate({ to: "/learn/worksheet-lite/01", search: { flow } as never });
            }}
          >
            再做一次 {config.title}
          </Button>
          <Button asChild variant="outline">
            <Link to="/">回首頁</Link>
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
