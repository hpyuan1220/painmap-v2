/**
 * painIdExport — Pain ID 卡片匯出 (v3.0)
 *
 * Generates markdown, JSON, or a printable HTML payload from a PainCard.
 * Replaces v2's `cardTenExport.ts`. Used by `/learn/worksheet/result`.
 *
 * No formatting opinions live here beyond layout — voice/tone follows
 * `docs/painmap_worksheet/references/voice_and_tone.md`. UI strings stay in components.
 */

import type { PainCard } from "@/types/painCard";

/** Generate a short, human-displayable pain id like `pid-20260523-a1b2c3`. */
export function generatePainId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8);
  return `pid-${yyyy}${mm}${dd}-${rand}`;
}

/** Check whether the card has enough content to be exported as a Pain ID. */
export function isReadyForExport(card: PainCard): boolean {
  return (
    card.result.story_one_liner.trim().length > 0 &&
    card.result.next_step_note.trim().length > 0 &&
    card.result.next_step_hint !== null
  );
}

/** Render the PainCard as a markdown document, using the layout from data_model.md §匯出格式. */
export function toMarkdown(card: PainCard): string {
  const lines: string[] = [];
  const painId = card.result.pain_id || "(unassigned)";

  lines.push(`# Pain ID · ${painId}`, "");
  lines.push("## 一句話的故事");
  lines.push(card.result.story_one_liner || "(尚未寫)", "");

  lines.push("## 抱怨原話");
  if (card.complaint.verbatim) {
    lines.push(`> ${card.complaint.verbatim}`);
    if (card.complaint.source_name || card.complaint.datetime) {
      const meta = [card.complaint.source_name, card.complaint.datetime]
        .filter(Boolean)
        .join("，");
      lines.push(`> — ${meta}`);
    }
  } else {
    lines.push("(尚未寫)");
  }
  lines.push("");

  if (card.focused_pain.summary) {
    lines.push("## 聚焦的痛點");
    lines.push(card.focused_pain.summary, "");
  }

  const em = card.empathy_map;
  if (em.think || em.feel || em.say || em.do || em.pain || em.gain) {
    lines.push("## 心情地圖");
    lines.push(`- 心裡想：${em.think || "—"}`);
    lines.push(`- 感受：${em.feel || "—"}`);
    lines.push(`- 嘴上說：${em.say || "—"}`);
    lines.push(`- 行為：${em.do || "—"}`);
    lines.push(`- 卡在：${em.pain || "—"}`);
    lines.push(`- 希望：${em.gain || "—"}`, "");
  }

  if (card.stuck_formula_with_solutions.user_draft) {
    lines.push("## 卡點公式");
    lines.push(card.stuck_formula_with_solutions.user_draft, "");
  }

  const pairs = card.contradiction.pairs;
  if (pairs.length > 0) {
    lines.push("## 取捨");
    for (const p of pairs) {
      lines.push(`- A：${p.side_a}　／　B：${p.side_b}`);
      lines.push(`  選 ${p.picked === "a" ? "A" : "B"}，因為：${p.reason}`);
    }
    lines.push("");
  }

  const sessions = card.interview.sessions;
  if (sessions.length > 0) {
    lines.push("## 訪過的人");
    for (const s of sessions) {
      lines.push(`- ${s.person_name}（${s.mode}，${s.datetime}）`);
      for (const q of s.key_quotes) {
        if (q.trim()) lines.push(`  > ${q}`);
      }
    }
    lines.push("");
  }

  if (card.post_interview_synthesis.user_summary) {
    lines.push("## 訪後沉澱");
    lines.push(card.post_interview_synthesis.user_summary, "");
  }

  if (card.result.next_step_note) {
    lines.push("## 我的下一步");
    lines.push(card.result.next_step_note, "");
  }

  return lines.join("\n");
}

/** Render the PainCard as raw JSON (full snapshot). */
export function toJson(card: PainCard): string {
  return JSON.stringify(card, null, 2);
}

/** Trigger a browser download for an export. */
export function downloadExport(
  card: PainCard,
  format: "markdown" | "json" | "pdf",
): void {
  const painId = card.result.pain_id || "pain-id";
  let blob: Blob;
  let filename: string;

  switch (format) {
    case "markdown": {
      blob = new Blob([toMarkdown(card)], { type: "text/markdown;charset=utf-8" });
      filename = `${painId}.md`;
      break;
    }
    case "json": {
      blob = new Blob([toJson(card)], { type: "application/json" });
      filename = `${painId}.json`;
      break;
    }
    case "pdf": {
      // MVP: PDF goes via browser print dialog from the Result page,
      // not a programmatic blob. Caller should `window.print()` instead.
      // Fall back to markdown if invoked directly.
      blob = new Blob([toMarkdown(card)], { type: "text/markdown;charset=utf-8" });
      filename = `${painId}.md`;
      break;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
