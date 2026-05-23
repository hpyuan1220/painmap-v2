/**
 * cardGThemesParser — parse AI's reply into `ClusteredTheme[]` for Card G.
 *
 * Input: free-form text after sending the Card G invitation prompt
 *        (`ai_prompt_library.md` §10.2). AI is expected to return 3-5 themes,
 *        each with a name and 2-3 supporting quotes.
 * Output: themes with user_kept=true by default (user can opt-out per theme).
 *
 * Recognised shapes (any one suffices):
 *   - "主題 1：「...」" / "Theme 1: ..." / "1. ..." headers
 *   - Quote lines under each theme: "- 「...」" / "* ..." / "> ..."
 *
 * Anything between the header line and the first quote line is concatenated
 * into the theme name (handles AI putting the name on a second line).
 */

import type { ClusteredTheme } from "@/types/painCard";

const THEME_HEADER = /^\s*(?:\*\*\s*)?(?:主題|theme)\s*([1-9一二三四五六七八九])(?:\*\*)?\s*[：:、.．)]\s*(.+?)\s*$/im;
const NUMBERED_HEADER = /^\s*(?:\*\*\s*)?([1-9])\s*[）)\.．、)]\s*(.+?)\s*$/im;
const QUOTE_LINE = /^\s*(?:[-*•·]|>)\s+(.+)$/;

function stripQuotes(s: string): string {
  return s
    .replace(/^[「『"'《【\[(]+/, "")
    .replace(/[」』"'》】\])]+$/, "")
    .trim();
}

export function parseCardGThemes(raw: string): ClusteredTheme[] {
  if (!raw.trim()) return [];

  const lines = raw.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] | null = null;
  let usedExplicitHeader = false;

  for (const line of lines) {
    const isExplicit = THEME_HEADER.test(line);
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

  return blocks.slice(0, 5).map((block) => {
    const headerLine = block[0];
    const headerMatch =
      headerLine.match(THEME_HEADER) ?? headerLine.match(NUMBERED_HEADER);
    const theme = headerMatch ? stripQuotes(headerMatch[2] ?? "") : "";
    const supporting_quotes: string[] = [];

    for (let i = 1; i < block.length; i++) {
      const line = block[i];
      const quoteMatch = line.match(QUOTE_LINE);
      if (quoteMatch) {
        const q = stripQuotes(quoteMatch[1]);
        if (q) supporting_quotes.push(q);
      }
    }

    return {
      theme,
      supporting_quotes,
      user_kept: true,
    };
  });
}
