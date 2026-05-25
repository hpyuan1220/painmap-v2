import { describe, expect, it } from "vitest";

import { parseCard6Evidences } from "@/lib/parsers/card6EvidencesParser";

describe("parseCard6Evidences", () => {
  it("returns [] for empty input", () => {
    expect(parseCard6Evidences("")).toEqual([]);
    expect(parseCard6Evidences("  \n\n  ")).toEqual([]);
  });

  it("parses '證據 N' blocks with tagged fields", () => {
    const raw = `這裡是市場上的三段相關討論：

證據 1
來源：https://www.dcard.tw/f/xxx/p/123
引用：「我每週六也要寫 30 個學生的評語，寫到崩潰」
為什麼相關：跟你描述的「週末壓力 + 30 學生」幾乎一樣

證據 2
來源：https://www.ptt.cc/bbs/teacher/M.123
引用：「家長已讀不回比寫評語還累」
為什麼相關：呼應你說的家長 LINE 焦慮

證據 3
來源：https://medium.com/edu/abc
引用：「老師的情緒勞動沒有人計算」
為什麼相關：把你說的具體 vs 不傷感情拉成更大的框`;

    const result = parseCard6Evidences(raw);
    expect(result).toHaveLength(3);
    expect(result[0].source).toContain("dcard.tw");
    expect(result[0].quote).toContain("30 個學生");
    expect(result[0].relevance).toContain("週末壓力");
    expect(result[1].source).toContain("ptt.cc");
    expect(result[2].quote).toContain("情緒勞動");
  });

  it("falls back to numeric headers", () => {
    const raw = `1. Reddit r/Teachers thread
引用：「Sundays are spent grading, every week」
相關性：matches your weekend-pressure shape

2. Edutopia article
引用：「Parent communication is unpaid labor」
相關性：names what you described`;

    const result = parseCard6Evidences(raw);
    expect(result).toHaveLength(2);
    expect(result[0].source).toContain("Reddit");
    expect(result[0].quote).toContain("Sundays");
    expect(result[1].source).toContain("Edutopia");
  });

  it("caps at 5 evidences", () => {
    const raw = `證據 1
引用：a
證據 2
引用：b
證據 3
引用：c
證據 4
引用：d
證據 5
引用：e
證據 6
引用：f (extra)`;
    const result = parseCard6Evidences(raw);
    expect(result).toHaveLength(5);
    expect(result[4].quote).toBe("e");
  });

  it("extracts URL from a markdown link in the header line", () => {
    const raw = `證據 1：[Reddit thread on grading](https://reddit.com/r/teachers/abc)
引用：「Sundays gone, every week」
相關性：weekend shape`;
    const result = parseCard6Evidences(raw);
    expect(result[0].source).toContain("reddit.com");
    expect(result[0].source).toContain("Reddit thread");
  });

  it("picks up untagged quoted segment as the quote", () => {
    const raw = `證據 1
https://example.com/forum/abc
「我每週六都在改作業，寫到不想看自己的字」
這跟你說的週末壓力一模一樣`;
    const result = parseCard6Evidences(raw);
    expect(result[0].source).toContain("example.com");
    expect(result[0].quote).toContain("每週六");
    expect(result[0].relevance).toContain("週末壓力");
  });

  it("returns whatever it can if AI gave fewer than 3", () => {
    const raw = `證據 1
來源：https://only-one.example
引用：「只有一段」
相關性：唯一一段`;
    const result = parseCard6Evidences(raw);
    expect(result).toHaveLength(1);
    expect(result[0].source).toContain("only-one");
    expect(result[0].quote).toBe("只有一段");
  });
});
