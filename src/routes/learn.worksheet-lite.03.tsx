import { createFileRoute } from "@tanstack/react-router";

import { FlowStepPage } from "@/components/flow/FlowStepPage";

export const Route = createFileRoute("/learn/worksheet-lite/03")({
  validateSearch: (search: Record<string, unknown>) => ({
    flow: search.flow === "ai-detective" ? "ai-detective" : "lite",
  }),
  component: WorksheetLiteStep03Page,
});

function WorksheetLiteStep03Page() {
  const { flow } = Route.useSearch();
  return <FlowStepPage flowId={flow} step={3} />;
}
