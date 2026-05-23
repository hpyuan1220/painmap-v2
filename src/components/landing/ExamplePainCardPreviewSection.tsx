/**
 * ExamplePainCardPreviewSection — v3 「這趟路長什麼樣」 preview.
 *
 * Replaces v2's 9-card modal with a tighter 13-step preview that lists every card
 * (Card 1, A, 1-A, 1-B, 3, B, 4, 5, 6, 7, D, 8, G, Result) with a one-line "what
 * happens here" + AI involvement marker.
 *
 * Voice follows voice_and_tone.md — no 真痛點 / 假痛點 framing, no 「分數」, just an
 * honest preview of the journey so users know what they're stepping into.
 */
import { Illustration } from "@/components/Illustration";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionFade } from "./SectionFade";

type StepPreview = {
  step: string;          // "01", "02"... "Result"
  cardLabel: string;     // "Card 1", "Card A", "Card 1-A"...
  title: string;
  oneLiner: string;
  ai: "none" | "optional" | "core";
};

const STEPS: StepPreview[] = [
  { step: "01", cardLabel: "Card 1", title: "那句脫口而出的話", oneLiner: "把抱怨原話寫下來，不修飾。", ai: "none" },
  { step: "02", cardLabel: "Card A", title: "痛點現場日記", oneLiner: "下次卡住的時候，順手寫下時間、地點、心情。", ai: "optional" },
  { step: "03", cardLabel: "Card 1-A", title: "AI 替你打開三條路", oneLiner: "請 AI 從你的抱怨打開 3 個可能的方向，你選一條。", ai: "core" },
  { step: "04", cardLabel: "Card 1-B", title: "走進其中一條，慢慢往下問", oneLiner: "跟 AI 來回 2-3 輪，每一輪寫一句你聽到了什麼。", ai: "core" },
  { step: "05", cardLabel: "Card 3", title: "聚焦痛點摘要", oneLiner: "用自己的話寫一段約 60 字的摘要。", ai: "optional" },
  { step: "06", cardLabel: "Card B", title: "心情地圖", oneLiner: "站到那個人的位置上，寫他在想、感受、說、做什麼。", ai: "optional" },
  { step: "07", cardLabel: "Card 4", title: "卡點公式 + AI 解法回看", oneLiner: "「我每次要 ___，卡在 ___」+ AI 列常見解法、你逐一回看。", ai: "core" },
  { step: "08", cardLabel: "Card 5", title: "取捨對話", oneLiner: "「想要 A 也想要 B，但如果一定要選 ___，因為 ___」。", ai: "optional" },
  { step: "09", cardLabel: "Card 6", title: "市場聲音的三段證據", oneLiner: "找 3 段公開聲音，寫為什麼跟你的故事有關。", ai: "core" },
  { step: "10", cardLabel: "Card 7", title: "三個有名字的人 + 你心裡的猜想", oneLiner: "3 個你叫得出名字、聯絡得到的人，每人預先猜 3-5 個答案。", ai: "optional" },
  { step: "11", cardLabel: "Card D", title: "自我假設清單", oneLiner: "走進對話前，把自己心裡的猜想攤開來看一看。", ai: "none" },
  { step: "12", cardLabel: "Card 8", title: "真人對話", oneLiner: "跟那 3 個人聊完之後，回來記錄你聽到了什麼。", ai: "none" },
  { step: "13", cardLabel: "Card G", title: "訪後沉澱", oneLiner: "AI 替你把訪談聲音整理成主題，你決定保留、重命名、丟掉。", ai: "core" },
  { step: "Pain ID", cardLabel: "Result", title: "Pain ID 卡片", oneLiner: "一張你親手寫完的卡片，匯出帶走。", ai: "none" },
];

function AiBadge({ ai }: { ai: StepPreview["ai"] }) {
  if (ai === "none") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
        <span aria-hidden className="h-1 w-1 rounded-full bg-text-tertiary" />
        no AI
      </span>
    );
  }
  if (ai === "optional") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] text-text-secondary">
        <span aria-hidden className="h-1 w-1 rounded-full bg-text-secondary" />
        AI optional
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.06em] text-text-primary">
      <span aria-hidden className="h-1 w-1 rounded-full bg-text-primary" />
      AI core
    </span>
  );
}

export function ExamplePainCardPreviewSection() {
  return (
    <SectionFade
      ariaLabelledBy="example-paincard-title"
      className="relative border-t border-border-hairline bg-canvas-base"
    >
      <a id="example-paincard" className="absolute -top-24" aria-hidden />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 section-lg">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Heading + illustration anchor */}
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow variant="numbered" index={3} className="mb-6">
              The Journey
            </Eyebrow>
            <h2
              id="example-paincard-title"
              className="font-display font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary text-[clamp(28px,4.5vw,52px)]"
            >
              這趟路長什麼樣
            </h2>
            <p className="mt-6 max-w-[28em] text-base sm:text-lg leading-[1.7] text-text-secondary">
              13 張卡片 + 一張帶得走的 Pain ID 卡片。
              不是每張卡都用 AI — 有些只屬於你自己。
            </p>
            <div className="hidden lg:block lg:mt-12 lg:sticky lg:top-24">
              <Illustration
                name="e11-listening-vessel"
                alt="13 張卡片是一段陪伴的步道"
                aspect="4/3"
                sizes="40vw"
                className="border-0 bg-transparent"
              />
            </div>
          </div>

          {/* Step list: right 7 cols on lg+ */}
          <ol className="col-span-12 lg:col-span-7 flex flex-col">
            {STEPS.map((s, idx) => (
              <li
                key={s.step}
                className="grid grid-cols-[3rem_1fr_auto] gap-4 items-start py-5 border-b border-border-hairline last:border-b-0"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-text-tertiary pt-1 tabular-nums">
                  {s.step}
                </span>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[15px] font-medium text-text-primary">
                    <span className="text-text-tertiary mr-2 font-mono text-[12px] uppercase tracking-[0.06em]">
                      {s.cardLabel}
                    </span>
                    {s.title}
                  </p>
                  <p className="text-[13px] leading-[1.6] text-text-secondary">{s.oneLiner}</p>
                </div>
                <div className="pt-1.5">
                  <AiBadge ai={s.ai} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionFade>
  );
}
