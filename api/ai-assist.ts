/**
 * /api/ai-assist — Vercel Edge function powering the worksheet's "讓 AI 幫我" buttons.
 *
 * Hybrid design: the frontend always tries this endpoint first. When no
 * OPENAI_API_KEY is configured (local dev, or a deploy without the secret) it
 * returns 501 so the UI can fall back to the copy-paste flow. The API key never
 * reaches the browser — it stays server-side here.
 *
 * Two tasks:
 *  - kind: "directions" → open a vague complaint into 3 listening directions.
 *  - kind: "drill"      → respond to one narrowing question, end with an open question.
 *
 * The model is told NOT to propose products/apps/solutions or score the pain —
 * it only helps the user *listen* and narrow, matching the PainMap method.
 */

export const config = { runtime: "edge" };

type DirectionsBody = {
  kind: "directions";
  complaint: string;
  context?: string;
  diaryNotes?: string;
};

type DrillBody = {
  kind: "drill";
  complaint: string;
  directionTitle: string;
  directionDescription: string;
  priorRounds?: string;
  question: string;
};

type RequestBody = DirectionsBody | DrillBody;

const MODEL = (typeof process !== "undefined" && process.env.OPENAI_MODEL) || "gpt-4o-mini";

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const GUARDRAILS =
  "你在陪一位創業者「打開」一句模糊的抱怨，幫他往下聽、把痛點收窄。" +
  "規則：不要替他想解法、不要推薦工具或 App、不要替他打分數或判斷真假，只幫他看見可能性與更具體的問題。" +
  "全部用繁體中文回覆。";

function buildDirectionsMessages(b: DirectionsBody) {
  const user = [
    "這是我最近聽到（或自己脫口而出）的一句抱怨：",
    b.complaint,
    b.context ? `\n背景：${b.context}` : "",
    b.diaryNotes ? `\n我這幾天的現場日記：\n${b.diaryNotes}` : "",
    "\n請從這段抱怨出發，幫我打開 3 條值得繼續往下聽的不同方向。",
    '只輸出 JSON，格式：{"directions":[{"title":"方向名（一句話）","description":"為什麼這條值得聽（一兩句）","why_it_matters":"這條方向在意的是什麼（一句話）"}]}，directions 長度必須為 3。',
  ]
    .filter(Boolean)
    .join("\n");
  return [
    { role: "system", content: GUARDRAILS },
    { role: "user", content: user },
  ];
}

function buildDrillMessages(b: DrillBody) {
  const user = [
    "我們選了一條方向繼續往下走。",
    `抱怨原話：${b.complaint}`,
    `選的方向：${b.directionTitle} — ${b.directionDescription}`,
    b.priorRounds ? `到目前為止聊過：\n${b.priorRounds}` : "（這是第一輪）",
    `這一輪我想問：${b.question}`,
    "請用我已知的事實回應這個問題，不要發明新細節；結尾留一個「下一輪可以再問」的開放式問題，不要直接給答案。",
    '只輸出 JSON，格式：{"ai_response":"你的回應（含結尾的開放式問題）"}。',
  ].join("\n");
  return [
    { role: "system", content: GUARDRAILS },
    { role: "user", content: user },
  ];
}

async function callOpenAI(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`openai_${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("openai_empty_response");
  return JSON.parse(content) as Record<string, unknown>;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const apiKey = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined;
  if (!apiKey) return json({ error: "ai_not_configured" }, 501);

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  try {
    if (body.kind === "directions") {
      if (!body.complaint?.trim()) return json({ error: "missing_complaint" }, 400);
      const parsed = await callOpenAI(apiKey, buildDirectionsMessages(body));
      const raw = Array.isArray(parsed.directions) ? parsed.directions : [];
      const directions = raw.slice(0, 3).map((d, i) => {
        const obj = (d ?? {}) as Record<string, unknown>;
        return {
          id: `d${i + 1}`,
          title: String(obj.title ?? "").trim(),
          description: String(obj.description ?? "").trim(),
          why_it_matters: String(obj.why_it_matters ?? "").trim(),
        };
      });
      if (directions.length === 0) return json({ error: "no_directions" }, 502);
      return json({ directions }, 200);
    }

    if (body.kind === "drill") {
      if (!body.question?.trim()) return json({ error: "missing_question" }, 400);
      const parsed = await callOpenAI(apiKey, buildDrillMessages(body));
      const aiResponse = String(parsed.ai_response ?? "").trim();
      if (!aiResponse) return json({ error: "no_response" }, 502);
      return json({ ai_response: aiResponse }, 200);
    }

    return json({ error: "unknown_kind" }, 400);
  } catch (err) {
    return json({ error: "ai_failed", detail: String(err).slice(0, 200) }, 502);
  }
}
