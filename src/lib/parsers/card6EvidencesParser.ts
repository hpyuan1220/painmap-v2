/**
 * card6EvidencesParser — parse AI's reply into `EvidenceEntry[]`.
 *
 * Input: free-form text the user pastes back from ChatGPT Deep Research /
 *        Perplexity / Claude / Gemini after sending the Card 6 prompt
 *        asking for 3-5 pieces of public-discourse evidence about their pain.
 * Output: up to 5 EvidenceEntry items with source + quote + relevance.
 *
 * Strategy mirrors other parsers: lenient regex, "best effort," the route
 * still lets the user edit every field after parsing.
 *
 * Supported patterns:
 *   - "證據 N：…" / "**證據 N**" / "Evidence N" headers
 *   - "1. …" / "1) …" numeric fallback headers
 *   - Field lines tagged with 來源/引用/原文/相關性/為什麼相關/source/quote/relevance
 *   - Markdown link `[label](url)` extracted into source
 *   - 「…」or "…" quoted segments treated as quote when no explicit tag exists
 */

import type { EvidenceEntry } from "@/types/painCard";

const EVIDENCE_HEADER =
  /^\s*(?:\*\*\s*)?(?:證據|evidence)\s*([1-9一二三四五六七八九])(?:\*\*)?\s*(?:[：:、.．)]\s*(.+?))?\s*$/im;
const NUMBERED_HEADER = /^\s*(?:\*\*\s*)?([1-9])\s*[）)\.．、]\s*(.+?)\s*$/im;
const SOURCE_LINE = /^[-•\s]*(?:來源|出處|source|link|連結)\s*[：:]\s*(.+)$/im;
const QUOTE_LINE = /^[-•\s]*(?:引用|原話|原文|片段|quote)\s*[：:]\s*(.+)$/im;
const RELEVANCE_LINE =
  /^[-•\s]*(?:相關性|為什麼相關|為什麼跟我有關|跟我有關|relevance|why)\s*[：:]\s*(.+)$/im;
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
const URL_BARE = /(https?:\/\/[^\s)）」』]+)/;
const QUOTED_SEGMENT = /[「『"]([^「『"」』"]{4,})[」』"]/;

function strip(s: string): string {
  return s
    .replace(/^[-•*\s\[(「『"《【]+/, "")
    .replace(/[\s)\]」』"》】]+$/, "")
    .trim();
}

export function parseCard6Evidences(raw: string): EvidenceEntry[] {
  if (!raw.trim()) return [];

  const lines = raw.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] | null = null;
  let usedExplicitHeader = false;

  for (const line of lines) {
    const isExplicit = EVIDENCE_HEADER.test(line);
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
    let source = "";
    let quote = "";
    let relevance = "";

    const headerLine = block[0];
    const headerMatch =
      headerLine.match(EVIDENCE_HEADER) ?? headerLine.match(NUMBERED_HEADER);
    const headerTail = headerMatch ? strip(headerMatch[2] ?? "") : "";

    if (headerTail) {
      const md = headerTail.match(MARKDOWN_LINK);
      if (md) {
        source = `${md[2]} — ${md[1]}`;
      } else if (URL_BARE.test(headerTail)) {
        source = headerTail;
      } else {
        source = headerTail;
      }
    }

    for (let i = 1; i < block.length; i++) {
      const line = block[i].trim();
      if (!line) continue;

      const sourceMatch = line.match(SOURCE_LINE);
      if (sourceMatch && !source) {
        const inner = sourceMatch[1];
        const md = inner.match(MARKDOWN_LINK);
        source = md ? `${md[2]} — ${md[1]}` : inner.trim();
        continue;
      }
      const quoteMatch = line.match(QUOTE_LINE);
      if (quoteMatch && !quote) {
        quote = strip(quoteMatch[1]);
        continue;
      }
      const relMatch = line.match(RELEVANCE_LINE);
      if (relMatch && !relevance) {
        relevance = relMatch[1].trim();
        continue;
      }

      // Untagged line: try to infer
      if (!quote) {
        const q = line.match(QUOTED_SEGMENT);
        if (q) {
          quote = q[1].trim();
          continue;
        }
      }
      if (!source && URL_BARE.test(line)) {
        source = line;
        continue;
      }
      if (!relevance) {
        relevance = strip(line);
      }
    }

    return { source, quote, relevance };
  });
}
