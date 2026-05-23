/**
 * useResumeCard — Landing 是否顯示「歡迎回來」卡片。
 *
 * v3.0 規則：
 * - 當 status 不是 'completed' 且使用者已經輸入了任何資料
 *   (complaint.verbatim 非空 或 current_step > 1) 視為「未完成」。
 * - SSR 階段不能讀 LocalStorage，必須等 hydration 完成再判斷，否則 SSR/CSR mismatch。
 */

import { usePainCardStore } from "@/store/painCard";
import { STEP_TITLES, type CurrentStep } from "@/types/painCard";

export type ResumeInfo = {
  showResume: boolean;
  currentStep: CurrentStep;
  cardName: string;
  createdAt: string;
  updatedAt: string;
};

function nameForStep(step: CurrentStep): string {
  if (step === "result") return "Pain ID 卡片";
  return STEP_TITLES[step];
}

function stepOrder(step: CurrentStep): number {
  return step === "result" ? 14 : step;
}

export function useResumeCard(): ResumeInfo {
  const card = usePainCardStore((s) => s.card);
  const hydrated = usePainCardStore((s) => s.hydrated);

  if (!hydrated) {
    return {
      showResume: false,
      currentStep: 1,
      cardName: nameForStep(1),
      createdAt: card.created_at,
      updatedAt: card.updated_at,
    };
  }

  const finished = card.status === "completed";
  const hasContent =
    !!card.complaint.verbatim.trim() || stepOrder(card.current_step) > 1;

  return {
    showResume: !finished && hasContent,
    currentStep: card.current_step,
    cardName: nameForStep(card.current_step),
    createdAt: card.created_at,
    updatedAt: card.updated_at,
  };
}
