import { describe, expect, it } from "vitest";

import { parseCard4Solutions } from "@/lib/parsers/card4SolutionsParser";

describe("parseCard4Solutions", () => {
  it("returns [] for empty input", () => {
    expect(parseCard4Solutions("")).toEqual([]);
    expect(parseCard4Solutions("   \n\n  ")).toEqual([]);
  });

  it("parses '解法 N' headers with one-line descriptions", () => {
    const raw = `這是市場上常見的幾個解法：

解法 1：週末批次處理
週六固定 4 小時把整週素材一次寫完。

解法 2：學生分類分流
把 30 個學生分成 A/B 兩組，每週只深寫一組。

解法 3：模板化開頭結尾
固定句型省下措辭時間。`;

    const result = parseCard4Solutions(raw);
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe("週末批次處理");
    expect(result[0].description).toContain("週六固定");
    expect(result[1].label).toContain("分類分流");
    expect(result[2].label).toContain("模板化");
    expect(result.map((s) => s.id)).toEqual(["sol-1", "sol-2", "sol-3"]);
  });

  it("falls back to numeric headers when '解法' label is missing", () => {
    const raw = `1. Notion
一個可以自由排版的協作筆記本
2. Obsidian
本地優先、純文字 markdown 筆記
3. Roam Research
雙向連結網狀筆記`;

    const result = parseCard4Solutions(raw);
    expect(result).toHaveLength(3);
    expect(result[0].label).toBe("Notion");
    expect(result[1].label).toBe("Obsidian");
    expect(result[2].label).toBe("Roam Research");
  });

  it("caps at 5 solutions even when the AI returns more", () => {
    const raw = `解法 1：a
d
解法 2：b
d
解法 3：c
d
解法 4：d
d
解法 5：e
d
解法 6：f（多出來的）
d`;
    const result = parseCard4Solutions(raw);
    expect(result).toHaveLength(5);
    expect(result[4].label).toBe("e");
  });

  it("handles markdown-bold headers and bullet-prefixed descriptions", () => {
    const raw = `**解法 1**：Notion
- 一個可以自由排版的協作筆記本

**解法 2**：Obsidian
- 本地優先 markdown`;

    const result = parseCard4Solutions(raw);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Notion");
    expect(result[0].description).toContain("自由排版");
    expect(result[1].label).toBe("Obsidian");
  });

  it("returns whatever it can if AI gave fewer than 3", () => {
    const raw = `解法 1：只有這一個
這是描述。`;
    const result = parseCard4Solutions(raw);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("只有這一個");
    expect(result[0].description).toContain("這是描述");
  });

  it("strips '描述：' prefix from description line", () => {
    const raw = `解法 1：Notion
描述：自由排版的筆記本`;
    const result = parseCard4Solutions(raw);
    expect(result[0].description).toBe("自由排版的筆記本");
  });
});
