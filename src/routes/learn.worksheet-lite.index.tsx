import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/worksheet-lite/")({
  beforeLoad: () => {
    throw redirect({ to: "/learn/worksheet-lite/01" });
  },
  component: () => null,
});
