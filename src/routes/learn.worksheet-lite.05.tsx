import { createFileRoute } from "@tanstack/react-router";

import { FlowStepPage } from "@/components/flow/FlowStepPage";

export const Route = createFileRoute("/learn/worksheet-lite/05")({
  validateSearch: (search: Record<string, unknown>) => ({
    flow: search.flow === "ai-detective" ? "ai-detective" : "lite",
  }),
  component: WorksheetLiteStep05Page,
});

function WorksheetLiteStep05Page() {
  const { flow } = Route.useSearch();
  return <FlowStepPage flowId={flow} step={5} />;
}
