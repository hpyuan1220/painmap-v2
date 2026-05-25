import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PainMap Worksheet — 6 張卡把一句抱怨收斂成可訪談的真痛點",
      },
      {
        name: "description",
        content:
          "6 張卡片陪你走過一次 condensed 真痛點判斷。從一句抱怨開始，收斂方向、拆出卡點、做取捨、看市場證據，再落到 3 個真人與訪談題。核心資料只在你的瀏覽器。",
      },
      {
        property: "og:title",
        content: "PainMap Worksheet · 6 張卡走完一次 condensed 真痛點判斷",
      },
      {
        property: "og:description",
        content: "從一句抱怨開始，走完 6 張卡片，寫下一張屬於你自己的 condensed pain ID card。",
      },
    ],
  }),
  component: LandingPage,
});
