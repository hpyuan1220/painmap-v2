/**
 * card4SolutionsParser — parse AI's reply into `AiSolution[]`.
 *
 * Input: free-form text the user pastes back from ChatGPT / Claude / Gemini
 *        after sending the Card 4 prompt (asks for 3-5 common solutions, each
 *        with a name + one-sentence description).
 * Output: up to 5 solutions with label + description. Caller adds verdicts.
 *
 * Strategy mirrors card1ADirectionsParser: lenient regex matching. AI outputs
 * vary so we fall back to "best effort" — the route still lets the user edit
 * each field.
 *
 * Supported patterns:
 *   - "解法 1：…" / "解法 1: …" / "**解法 1**" headers
 *   - "1. …" / "1) …" / "1、…" numbered list headers
 *   - Description picked up from the next non-empty line, with optional
 *     "描述：" / "說明：" / "description:" tag stripping
 */

import type { AiSolution } from "@/types/painCard";

const SOLUTION_HEADER = /^\s*(?:\*\*\s*)?(?:解法|solution)\s*([1-9一二三四五六七八九])(?:\*\*)?\s*[：:、.．)]\s*(.+?)\s*$/im;
const NUMBERED_HEADER = /^\s*(?:\*\*\s*)?([1-9])\s*[）)\.．、]\s*(.+?)\s*$/im;
const DESC_LINE = /^[-•\s]*(?:描述|說明|description|desc)\s*[：:]\s*(.+)$/im;

function stripQuotes(s: string): string {
  return s
    .replace(/^[「『"'《【\[(\-•\s*]+/, "")
    .replace(/[」』"'》】\])\s*]+$/, "")
    .trim();
}

export function parseCard4Solutions(raw: string): AiSolution[] {
  if (!raw.trim()) return [];

  const lines = raw.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] | null = null;
  let usedExplicitHeader = false;

  for (const line of lines) {
    const isExplicit = SOLUTION_HEADER.test(line);
    const isNumbered = NUMBERED_HEADER.test(line);
    const startsNewBlock =
      isExplicit || (isNumbered && !usedExplicitHeader && blocks.length < 5);

    if (startsNewBlock) {
      if (isExplicit) usedExplicitHeader = true;
      current = [line];
      blocks.push(current);
    } else if (current) {
      current.push(line);
    }
  }

  return blocks.slice(0, 5).map((block, idx) => {
    const headerLine = block[0];
    const titleMatch = headerLine.match(SOLUTION_HEADER) ?? headerLine.match(NUMBERED_HEADER);
    const label = titleMatch ? stripQuotes(titleMatch[2] ?? "") : "";

    let description = "";
    for (let i = 1; i < block.length; i++) {
      const line = block[i].trim();
      if (!line) continue;
      const descMatch = line.match(DESC_LINE);
      if (descMatch) {
        description = descMatch[1].trim();
        break;
      }
      if (!description) {
        description = stripQuotes(line);
      }
    }

    return {
      id: `sol-${idx + 1}`,
      label,
      description,
    };
  });
}
