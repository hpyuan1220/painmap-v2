import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/worksheet-lite/")({
  validateSearch: (search: Record<string, unknown>) => ({
    flow: search.flow === "ai-detective" ? "ai-detective" : "lite",
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/learn/worksheet-lite/01", search });
  },
  component: () => null,
});
