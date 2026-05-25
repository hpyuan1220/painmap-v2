/**
 * aiAssist — thin client for the /api/ai-assist Edge function.
 *
 * Hybrid contract: callers try these helpers first. A `{ ok: false }` result
 * (no key configured, network error, or a bad response) means "fall back to the
 * copy-paste flow" — never throws, so the UI stays usable without a backend.
 */

import type { AiDirection } from "@/types/painCard";

type Fail = { ok: false; reason: "not_configured" | "error" | "network" };

export type DirectionsResult = { ok: true; directions: AiDirection[] } | Fail;
export type DrillResult = { ok: true; aiResponse: string } | Fail;

async function postAi(payload: unknown): Promise<Response | null> {
  try {
    return await fetch("/api/ai-assist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return null;
  }
}

export async function fetchAiDirections(input: {
  complaint: string;
  context?: string;
  diaryNotes?: string;
}): Promise<DirectionsResult> {
  const res = await postAi({ kind: "directions", ...input });
  if (!res) return { ok: false, reason: "network" };
  if (res.status === 501) return { ok: false, reason: "not_configured" };
  if (!res.ok) return { ok: false, reason: "error" };
  try {
    const data = (await res.json()) as { directions?: AiDirection[] };
    if (!data.directions?.length) return { ok: false, reason: "error" };
    return { ok: true, directions: data.directions };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export async function fetchAiDrill(input: {
  complaint: string;
  directionTitle: string;
  directionDescription: string;
  priorRounds?: string;
  question: string;
}): Promise<DrillResult> {
  const res = await postAi({ kind: "drill", ...input });
  if (!res) return { ok: false, reason: "network" };
  if (res.status === 501) return { ok: false, reason: "not_configured" };
  if (!res.ok) return { ok: false, reason: "error" };
  try {
    const data = (await res.json()) as { ai_response?: string };
    if (!data.ai_response) return { ok: false, reason: "error" };
    return { ok: true, aiResponse: data.ai_response };
  } catch {
    return { ok: false, reason: "error" };
  }
}
