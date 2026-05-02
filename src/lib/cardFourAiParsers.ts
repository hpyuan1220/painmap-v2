/**
 * Card 4 AI 回應掃描工具
 *
 * 設計：純函式，無副作用，可測試。
 *
 * 用途：
 * - detectSolutionModeWords：偵測 AI 回應中誤入「solution mode」的禁詞
 *   （例：「建議你開發 App」「應該做一個」），給 inline warning 用，不擋輸入。
 *
 * 歷史備註：早期曾包含 `parseAiAlternatives` 嘗試把 AI 回應自動拆解成
 * `ai_alternatives[]`。但 AI 輸出格式（bullet / 編號 / markdown / 段落）
 * 變化太大，正則拆解總留下垃圾項目（介紹語、結語、markdown 標記、拆碎的編號），
 * UX 比手動輸入還糟。已改為要求使用者讀完 AI 回應後逐項手動鍵入 — 與 Card 3 一致，
 * 也讓使用者邊輸入邊判斷哪些 AI 提案合理。
 */

/**
 * 偵測「solution mode」禁詞 — AI 不該叫使用者「去做新工具」「開發 App」，
 * 那破壞 worksheet 的鐵律（這階段只練判斷，不練做產品）。
 *
 * 命中時回傳清單給 UI 顯示 warning（黃色），不擋繼續。
 */
const SOLUTION_MODE_WORDS = [
  "建議你開發",
  "建議開發",
  "你應該做",
  "你應該開發",
  "可以開發",
  "推薦做",
  "建議做一個",
  "你可以做",
  "建議製作",
  "考慮做",
  "建議推出",
] as const;

export function detectSolutionModeWords(text: string): string[] {
  if (!text) return [];
  const compact = text.replace(/\s/g, "");
  return SOLUTION_MODE_WORDS.filter((w) => compact.includes(w));
}
