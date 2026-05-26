import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";
import { z } from "zod";

const ActionSchema = z.enum([
  "narrow_scope",
  "challenge_assumption",
  "find_gap",
  "rewrite_candidate",
  "next_step",
]);

const RequestSchema = z.object({
  flowId: z.string(),
  stepId: z.string(),
  stepTitle: z.string(),
  stepGoal: z.string(),
  actionType: ActionSchema,
  currentCardFields: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      targetPath: z.string().optional(),
    }),
  ),
  acceptedAiOutputsSoFar: z.array(z.string()).default([]),
  userMessage: z.string().optional(),
});

const ResponseSchema = z.object({
  observation: z.string(),
  challenge: z.string(),
  followUpQuestions: z.array(z.string()).default([]),
  suggestions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
      targetPath: z.string().nullable().optional(),
    }),
  ),
});

function getEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]) return process.env[key];
  const value = (globalThis as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function buildFallback(data: z.infer<typeof RequestSchema>) {
  const combined = data.currentCardFields
    .map((field) => `${field.label}: ${field.value}`.trim())
    .filter(Boolean)
    .join("\n");
  const firstTarget = data.currentCardFields.find((field) => field.targetPath)?.targetPath ?? null;

  const narrow =
    combined.length > 120
      ? combined.slice(0, 120)
      : combined || "你現在的內容還太少，先補一個具體場景再繼續。";

  return {
    observation: "我先根據你這張卡目前的內容做了一次收斂檢查。",
    challenge:
      data.actionType === "challenge_assumption"
        ? "你現在的描述可能還混著抱怨、解法和推測，先把它縮到一個具體情境會更好判斷。"
        : "這張卡還有一些地方可以更具體，尤其是人物、場景和卡住的那一步。",
    followUpQuestions: [
      "最近一次真的發生是在什麼情境？",
      "這裡最受影響的是誰？",
    ],
    suggestions: [
      {
        id: `${data.stepId}-fallback-1`,
        label: "候選收斂版本",
        value: narrow,
        targetPath: firstTarget,
      },
    ],
  };
}

function buildPrompt(data: z.infer<typeof RequestSchema>) {
  return `你是 PainMap 的「痛點偵探」。

你的工作不是直接給解法，而是幫使用者把痛點講得更清楚、更可驗證。

本輪 flow: ${data.flowId}
本輪 step: ${data.stepId} / ${data.stepTitle}
本輪任務: ${data.stepGoal}
AI 動作: ${data.actionType}

目前卡片內容：
${data.currentCardFields.map((field) => `- ${field.label}: ${field.value || "（空）"}`).join("\n")}

已被採用的 AI 結果：
${data.acceptedAiOutputsSoFar.join("\n") || "（無）"}

${data.userMessage ? `使用者補充訊息：${data.userMessage}` : ""}

請輸出 JSON，格式必須是：
{
  "observation": "一句觀察",
  "challenge": "一句挑戰或提醒",
  "followUpQuestions": ["問題1", "問題2"],
  "suggestions": [
    {
      "id": "unique-id",
      "label": "候選標籤",
      "value": "可被採用寫回卡片的內容",
      "targetPath": "建議寫回的欄位 path 或 null"
    }
  ]
}

要求：
- 用繁體中文
- 不要給產品解法
- 重點是抓假痛、太大、太空、跳步、缺證據
- suggestions 最多 3 個
- 如果內容太少，也要給出追問與一個可用的收斂版本`;
}

export const runFlowCoach = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RequestSchema.parse(input))
  .handler(async ({ data }: { data: z.infer<typeof RequestSchema> }) => {
    const apiKey = getEnv("OPENAI_API_KEY");
    if (!apiKey) return { ok: true, result: buildFallback(data), source: "fallback" as const };

    try {
      const client = new OpenAI({ apiKey });
      const completion = await client.responses.create({
        model: getEnv("OPENAI_MODEL") ?? "gpt-4.1-mini",
        input: buildPrompt(data),
        text: {
          format: {
            type: "json_schema",
            name: "flow_coach_response",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                observation: { type: "string" },
                challenge: { type: "string" },
                followUpQuestions: { type: "array", items: { type: "string" } },
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      id: { type: "string" },
                      label: { type: "string" },
                      value: { type: "string" },
                      targetPath: { type: ["string", "null"] },
                    },
                    required: ["id", "label", "value", "targetPath"],
                  },
                },
              },
              required: ["observation", "challenge", "followUpQuestions", "suggestions"],
            },
          },
        },
      });

      const raw = completion.output_text;
      const parsed = ResponseSchema.parse(JSON.parse(raw));
      return { ok: true, result: parsed, source: "llm" as const };
    } catch {
      return { ok: true, result: buildFallback(data), source: "fallback" as const };
    }
  });
