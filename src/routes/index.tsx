import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PainMap Worksheet — 一本陪你做質性研究的筆記本",
      },
      {
        name: "description",
        content:
          "13 張卡片陪你把一段卡住的故事慢慢聽清楚。從一句抱怨開始，走到一張可以帶走的 Pain ID 卡片。30 ~ 90 分鐘。不打分數，不評等，不替你判斷生意能不能做。資料只存在你的瀏覽器；少數語意判定請求會匿名經 OpenAI（不存後端、不收個資）。",
      },
      {
        property: "og:title",
        content: "PainMap Worksheet · 一本陪你做質性研究的筆記本",
      },
      {
        property: "og:description",
        content:
          "13 張卡片陪你把一段卡住的故事慢慢聽清楚。寫完帶走一張屬於你的 Pain ID 卡片。",
      },
    ],
  }),
  component: LandingPage,
});
