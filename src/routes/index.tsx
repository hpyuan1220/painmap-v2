import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PainMap Worksheet — 多 flow 痛點釐清工具",
      },
      {
        name: "description",
        content:
          "同一個 PainMap app 裡支援多種 worksheet flow。你可以選 6-card 快速版，或 8-card AI detective 版，讓 AI 幫你釐清、挑戰、寫回卡片。",
      },
      {
        property: "og:title",
        content: "PainMap Worksheet · 多 flow 痛點釐清工具",
      },
      {
        property: "og:description",
        content: "從一句抱怨開始，選擇最適合你的 worksheet flow，讓 AI 幫你更清楚地驗證痛點。",
      },
    ],
  }),
  component: LandingPage,
});
