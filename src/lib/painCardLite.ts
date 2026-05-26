import { usePainCardStore } from "@/store/painCard";
import type { CurrentStep, Judgment, PainCard } from "@/types/painCard";

export const LITE_TOTAL_STEPS = 6;

export const LITE_STEP_LABELS: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "方向",
  2: "卡點",
  3: "取捨",
  4: "證據",
  5: "真人",
  6: "訪談",
};

export const LITE_STEP_PATHS = {
  1: "/learn/worksheet-lite/01",
  2: "/learn/worksheet-lite/02",
  3: "/learn/worksheet-lite/03",
  4: "/learn/worksheet-lite/04",
  5: "/learn/worksheet-lite/05",
  6: "/learn/worksheet-lite/06",
  result: "/learn/worksheet-lite/result",
} as const;

export function startNewPainCardLite(): { id: string; path: "/learn/worksheet-lite/01" } {
  const store = usePainCardStore.getState();
  store.createCard();
  store.updateField("active_flow_id", "lite");
  const id = usePainCardStore.getState().card.id;
  return { id, path: "/learn/worksheet-lite/01" };
}

export function getLiteDirectionOptions(verbatim: string): string[] {
  const seed = verbatim.trim() || "這句抱怨";
  return [
    `流程太碎，${seed}背後卡的是反覆切換與重做`,
    `資訊太亂，${seed}背後卡的是判斷前沒有清楚依據`,
    `協作太慢，${seed}背後卡的是人與人之間交接失真`,
  ];
}

export function getTradeoffOptions(focusPain: string) {
  const pain = focusPain.trim() || "這個卡點";
  return [
    {
      a: "省時間",
      b: "更放心",
      prompt: `面對「${pain}」時，你更放不下哪一邊？`,
    },
    {
      a: "自己先做完",
      b: "讓別人一起參與",
      prompt: "如果只能保一個，你更在意哪個？",
    },
    {
      a: "標準一致",
      b: "因人調整",
      prompt: "這個痛點最終逼你犧牲的是哪個？",
    },
  ];
}

export function getInterviewReasonOptions() {
  return ["他正在經歷這個痛", "他剛走過這個痛", "他在這個領域做生意", "他是反例", "他是決策者"];
}

export function getLiteResultVerdict(judgment: Judgment | null) {
  if (judgment === "true_pain") return "普遍或小眾真痛";
  if (judgment === "pending_interview") return "還需要真人訪談確認";
  if (judgment === "fake_pain") return "目前比較像自己以為";
  return "尚未判斷";
}

export function isLiteFlowComplete(card: PainCard): boolean {
  return (
    card.complaint.verbatim.trim().length >= 10 &&
    card.complaint.source_name.trim().length > 0 &&
    (card.stuck_formula.ai_polished ?? "").trim().length >= 10 &&
    card.workaround.why_still_stuck.trim().length >= 20 &&
    card.contradiction.sacrificed_reason.trim().length >= 10 &&
    card.ai_evidence.raw_response.trim().length >= 20 &&
    card.people.list.filter((p) => p.name.trim() && p.contact.trim()).length >= 3 &&
    card.interview_plan.questions.filter((q) => q.trim().length >= 8).length >= 3 &&
    card.verdict.judgment !== null
  );
}

export function stepFromLitePath(pathname: string, fallback: CurrentStep): CurrentStep {
  const match = pathname.match(/\/learn\/worksheet-lite\/(\d{2})/);
  if (match) {
    const step = Number(match[1]);
    if (step >= 1 && step <= 6) return step as CurrentStep;
  }
  return fallback;
}
