import { useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

import { CardHero } from "@/components/worksheet/CardHero";
import { WorksheetCardHeader } from "@/components/worksheet/WorksheetCardHeader";
import { LiteField } from "@/components/worksheet-lite/LiteField";
import { LiteFooterNav } from "@/components/worksheet-lite/LiteFooterNav";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AiCoachPanel } from "@/components/flow/AiCoachPanel";
import { getByPath, stringifyFieldValue } from "@/lib/flowRuntime";
import { getWorksheetFlowConfig, getWorksheetStepConfig } from "@/lib/worksheetFlowRegistry";
import { usePainCardStore } from "@/store/painCard";

export function FlowStepPage({ flowId, step }: { flowId: string; step: number }) {
  const navigate = useNavigate();
  const card = usePainCardStore((s) => s.card);
  const updateField = usePainCardStore((s) => s.updateField);
  const advanceStep = usePainCardStore((s) => s.advanceStep);
  const config = getWorksheetFlowConfig(flowId);
  const stepConfig = getWorksheetStepConfig(flowId, step);
  const nextStep = step + 1;
  const stepKey = `${flowId}:${String(step).padStart(2, "0")}`;

  const fields = useMemo(
    () =>
      stepConfig.fields.map((field) => ({
        label: field.label,
        value: stringifyFieldValue(getByPath(card, field.path)),
        targetPath: field.path,
      })),
    [card, stepConfig.fields],
  );

  useEffect(() => {
    if (card.active_flow_id !== flowId) {
      updateField("active_flow_id", flowId);
    }
  }, [card.active_flow_id, flowId, updateField]);

  const renderField = (field: (typeof stepConfig.fields)[number]) => {
    const value = getByPath(card, field.path);
    if (Array.isArray(value)) {
      const objectArray = value.some((item) => typeof item === "object" && item !== null);
      return (
        <Textarea
          rows={field.rows ?? 5}
          value={stringifyFieldValue(value)}
          onChange={(e) =>
            updateField(
              field.path,
              objectArray
                ? e.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [name = "", contact = "", relation = ""] = line.split("｜");
                      return {
                        name: name.trim(),
                        contact: contact.trim(),
                        relation: relation.trim(),
                      };
                    })
                : e.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
            )
          }
          placeholder={field.placeholder}
        />
      );
    }
    if (field.type === "input") {
      return (
        <Input
          value={String(value ?? "")}
          onChange={(e) => updateField(field.path, e.target.value)}
          placeholder={field.placeholder}
        />
      );
    }
    return (
      <Textarea
        rows={field.rows ?? 4}
        value={String(value ?? "")}
        onChange={(e) => updateField(field.path, e.target.value)}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-canvas-base">
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16 pb-32">
        <CardHero illustration={stepConfig.heroIllustration as never} alt={stepConfig.heroAlt} />
        <WorksheetCardHeader
          cardNumber={stepConfig.step}
          totalCards={stepConfig.totalSteps}
          aiStatus={stepConfig.aiStatus}
          title={stepConfig.title}
          rule={stepConfig.rule}
          intro={stepConfig.intro}
        />

        <section className="space-y-8">
          {stepConfig.fields.map((field) => (
            <LiteField key={field.key} label={field.label} helper={field.helper}>
              {renderField(field)}
            </LiteField>
          ))}

          <AiCoachPanel flowId={flowId} stepKey={stepKey} step={stepConfig} fields={fields} />

          <LiteFooterNav
            onBack={
              step > 1
                ? () => navigate({ to: `/learn/worksheet-lite/${String(step - 1).padStart(2, "0")}` as never, search: { flow: flowId } as never })
                : undefined
            }
            onNext={() => {
              advanceStep(Math.min(nextStep, 8) as never);
              if (step >= config.stepCount) {
                navigate({ to: "/learn/worksheet-lite/result", search: { flow: flowId } as never });
                return;
              }
              navigate({ to: `/learn/worksheet-lite/${String(nextStep).padStart(2, "0")}` as never, search: { flow: flowId } as never });
            }}
            nextLabel={step >= config.stepCount ? "產生結果卡" : "下一張卡"}
          />
        </section>
      </main>
    </div>
  );
}
