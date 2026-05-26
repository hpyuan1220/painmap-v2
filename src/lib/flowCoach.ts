import { runFlowCoach } from "@/lib/flowCoach.server";
import type { FlowAiActionType } from "@/types/painCard";

export type FlowCoachInput = {
  flowId: string;
  stepId: string;
  stepTitle: string;
  stepGoal: string;
  actionType: FlowAiActionType;
  currentCardFields: Array<{ label: string; value: string; targetPath?: string }>;
  acceptedAiOutputsSoFar: string[];
  userMessage?: string;
};

export async function requestFlowCoach(input: FlowCoachInput) {
  return runFlowCoach({ data: input });
}
