/**
 * card1ADirectionsParser — parse AI's reply into `AiDirection[]`.
 *
 * Input: free-form text the user pastes back from ChatGPT / Claude / Perplexity / Gemini
 *        after sending the Card 1-A invitation prompt (`ai_prompt_library.md` §2.2).
 * Output: 0-3 directions with title + description + why_it_matters.
 *
 * Strategy: regex over a small set of recognisable shapes. AI outputs vary,
 * so the parser is intentionally lenient — falling back to "best effort"
 * rather than rejecting. The route component still gives the user the final
 * say (they can edit each field after parsing).
 *
 * Supported patterns (any one is enough):
 *   - "方向 1：「...」" / "方向 1: ..." / "1. ..." / "**方向 1**" headers
 *   - Optional 「為什麼值得聽：」/「Why it matters:」 line under each direction
 *   - Optional 「這條方向在意的是：」 line
 *
 * If a direction block is found without explicit "為什麼" / "在意" lines, the
 * parser splits on blank lines and assigns the next paragraph to description,
 * leaving why_it_matters empty.
 */

import type { AiDirection } from "@/types/painCard";

const DIRECTION_HEADER = /^\s*(?:\*\*\s*)?(?:方向|direction)\s*([1-3一二三])(?:\*\*)?\s*[：:、.．)]\s*(.+?)\s*$/im;
const NUMBERED_HEADER = /^\s*(?:\*\*\s*)?([1-3])\s*[）)\.．、)]\s*(.+?)\s*$/im;
const WHY_LINE = /^(?:為什麼值得聽|為何值得聽|why\s*it\s*matters)\s*[：:]\s*(.+)$/im;
const FOCUS_LINE = /^(?:這條方向在意的是|這條在意的是|focus(?:es)?(?:\s*on)?)\s*[：:]\s*(.+)$/im;

function stripQuotes(s: string): string {
  return s
    .replace(/^[「『"'《【\[(]+/, "")
    .replace(/[」』"'》】\])]+$/, "")
    .trim();
}

/**
 * Parse the full response and return up to 3 directions in original order.
 */
export function parseCard1ADirections(raw: string): AiDirection[] {
  if (!raw.trim()) return [];

  // Split into blocks: each block starts with a "方向 N" or numeric header.
  // We accept either shape; numeric headers are only counted if a "方向"
  // header has not already been seen (avoids picking up numbered bullets
  // inside a "為什麼" explanation).
  const lines = raw.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] | null = null;
  let usedExplicitHeader = false;

  for (const line of lines) {
    const isExplicit = DIRECTION_HEADER.test(line);
    const isNumbered = NUMBERED_HEADER.test(line);
    const startsNewBlock =
      isExplicit || (isNumbered && !usedExplicitHeader && blocks.length < 3);

    if (startsNewBlock) {
      if (isExplicit) usedExplicitHeader = true;
      current = [line];
      blocks.push(current);
    } else if (current) {
      current.push(line);
    }
    // Lines before the first header are dropped (likely AI's preamble).
  }

  return blocks.slice(0, 3).map((block, idx) => {
    const headerLine = block[0];
    const titleMatch = headerLine.match(DIRECTION_HEADER) ?? headerLine.match(NUMBERED_HEADER);
    const title = titleMatch ? stripQuotes(titleMatch[2] ?? "") : "";

    let description = "";
    let why = "";

    for (let i = 1; i < block.length; i++) {
      const line = block[i].trim();
      if (!line) continue;

      const whyMatch = line.match(WHY_LINE);
      if (whyMatch) {
        description = whyMatch[1].trim();
        continue;
      }
      const focusMatch = line.match(FOCUS_LINE);
      if (focusMatch) {
        why = focusMatch[1].trim();
        continue;
      }
      // Fallback: first non-tagged line becomes description if not set yet.
      if (!description) description = line;
      else if (!why) why = line;
    }

    return {
      id: `d${idx + 1}`,
      title,
      description,
      why_it_matters: why,
    };
  });
}
