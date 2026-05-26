import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requestFlowCoach } from "@/lib/flowCoach";
import type { FlowStepConfig } from "@/lib/worksheetFlowRegistry";
import { appendFlowTurn, ensureFlowSession, markAcceptedSuggestion } from "@/lib/flowRuntime";
import { usePainCardStore } from "@/store/painCard";
import type { FlowAiActionType, FlowAiTurn } from "@/types/painCard";

type Props = {
  flowId: string;
  stepKey: string;
  step: FlowStepConfig;
  fields: Array<{ label: string; value: string; targetPath?: string }>;
};

export function AiCoachPanel({ flowId, stepKey, step, fields }: Props) {
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const [busyAction, setBusyAction] = useState<FlowAiActionType | null>(null);
  const [deepOpen, setDeepOpen] = useState(false);
  const session = ensureFlowSession(card, stepKey);

  const runAction = async (actionType: FlowAiActionType, userMessage?: string) => {
    setBusyAction(actionType);
    const res = await requestFlowCoach({
      flowId,
      stepId: String(step.step).padStart(2, "0"),
      stepTitle: step.title,
      stepGoal: step.rule,
      actionType,
      currentCardFields: fields,
      acceptedAiOutputsSoFar: session.acceptedSuggestionIds,
      userMessage,
    });
    const turn: FlowAiTurn = {
      id: `${stepKey}-${Date.now()}`,
      created_at: new Date().toISOString(),
      actionType,
      observation: res.result.observation,
      challenge: res.result.challenge,
      followUpQuestions: res.result.followUpQuestions,
      suggestions: res.result.suggestions,
    };
    updateField("flow_ai_sessions", appendFlowTurn(card, stepKey, turn, userMessage ? "deep" : "inline"));
    setBusyAction(null);
  };

  const acceptSuggestion = (suggestionId: string, targetPath: string | null | undefined, value: string) => {
    if (targetPath) updateField(targetPath, value);
    updateField("flow_ai_sessions", markAcceptedSuggestion(card, stepKey, suggestionId));
  };

  const latestTurn = session.inlineTurns[session.inlineTurns.length - 1];

  return (
    <section className="rounded-md border border-border-hairline bg-canvas-raised p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">AI 痛點偵探</h2>
          <p className="mt-1 text-[14px] leading-[1.6] text-text-secondary">
            不是直接給答案，而是幫你看哪裡太大、太空、跳步，並把可採用內容寫回卡片。
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setDeepOpen((v) => !v)}>
          {deepOpen ? "收起深聊區" : "展開深聊區"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {step.actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant="outline"
            disabled={busyAction !== null}
            onClick={() => runAction(action.id)}
          >
            {busyAction === action.id ? "分析中..." : action.label}
          </Button>
        ))}
      </div>

      {latestTurn && (
        <div className="rounded-md border border-border-subtle p-4 space-y-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              偵探觀察
            </p>
            <p className="mt-1 text-[14px] leading-[1.7] text-text-primary">{latestTurn.observation}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              風險提醒
            </p>
            <p className="mt-1 text-[14px] leading-[1.7] text-text-primary">{latestTurn.challenge}</p>
          </div>
          {latestTurn.suggestions.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                可採用候選
              </p>
              {latestTurn.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="rounded-md border border-border-subtle p-3 space-y-3">
                  <p className="text-[14px] font-medium text-text-primary">{suggestion.label}</p>
                  <p className="text-[14px] leading-[1.7] text-text-secondary">{suggestion.value}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() =>
                        acceptSuggestion(suggestion.id, suggestion.targetPath, suggestion.value)
                      }
                    >
                      採用並寫回卡片
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {latestTurn.followUpQuestions.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                下一輪追問
              </p>
              <ul className="mt-2 space-y-1 text-[14px] leading-[1.7] text-text-secondary">
                {latestTurn.followUpQuestions.map((question) => (
                  <li key={question}>- {question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {deepOpen && (
        <AiDeepChatPanel
          busy={busyAction !== null}
          onSend={(message) => runAction("challenge_assumption", message)}
        />
      )}
    </section>
  );
}

function AiDeepChatPanel({
  busy,
  onSend,
}: {
  busy: boolean;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  return (
    <div className="rounded-md border border-border-subtle p-4 space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
        深聊區
      </p>
      <Textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="例如：我覺得我卡在這裡，但不確定是不是講太大。請幫我挑戰。"
      />
      <Button
        type="button"
        disabled={busy || message.trim().length < 6}
        onClick={() => {
          onSend(message);
          setMessage("");
        }}
      >
        {busy ? "分析中..." : "送出深聊追問"}
      </Button>
    </div>
  );
}
