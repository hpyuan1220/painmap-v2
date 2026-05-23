import { describe, expect, it } from "vitest";

import { parseCardGThemes } from "@/lib/parsers/cardGThemesParser";

describe("parseCardGThemes", () => {
  it("returns [] for empty input", () => {
    expect(parseCardGThemes("")).toEqual([]);
  });

  it("parses themes with supporting quotes", () => {
    const raw = `主題 1：被理解感的承載方式不同
- 「我不是看你寫多少，是看你有沒有看見我孩子」
- 「他寫得很短但我感覺被聽到」

主題 2：週末是承載焦慮的時刻
- 「我也是週六晚上崩潰」
- 「平日做不完的事壓到週末」

主題 3：少數家長吃掉多數時間
- 「30 個裡有 3 個特別難寫」
- 「我都先寫他們，剩下的就匆匆」`;

    const result = parseCardGThemes(raw);
    expect(result).toHaveLength(3);
    expect(result[0].theme).toBe("被理解感的承載方式不同");
    expect(result[0].supporting_quotes).toHaveLength(2);
    expect(result[0].supporting_quotes[0]).toContain("看見我孩子");
    expect(result[1].theme).toContain("承載焦慮");
    expect(result[2].supporting_quotes[1]).toContain("匆匆");
  });

  it("defaults user_kept to true for every parsed theme", () => {
    const raw = `主題 1：x
- 「q1」
主題 2：y
- 「q2」`;
    const result = parseCardGThemes(raw);
    expect(result.every((t) => t.user_kept === true)).toBe(true);
  });

  it("caps at 5 themes even when AI returns more", () => {
    const raw = `
主題 1：a
- 「q」
主題 2：b
- 「q」
主題 3：c
- 「q」
主題 4：d
- 「q」
主題 5：e
- 「q」
主題 6：f
- 「q」`;
    const result = parseCardGThemes(raw);
    expect(result).toHaveLength(5);
  });

  it("handles quotes prefixed with > (blockquote style)", () => {
    const raw = `主題 1：blockquote-quoted theme
> 第一句原話
> 第二句原話`;
    const result = parseCardGThemes(raw);
    expect(result[0].supporting_quotes).toEqual(["第一句原話", "第二句原話"]);
  });

  it("strips surrounding 「」 from theme and quotes", () => {
    const raw = `主題 1：「加引號的主題」
- 「加引號的引用」`;
    const result = parseCardGThemes(raw);
    expect(result[0].theme).toBe("加引號的主題");
    expect(result[0].supporting_quotes[0]).toBe("加引號的引用");
  });

  it("returns theme even when no supporting quotes were given", () => {
    const raw = `主題 1：a quoteless theme`;
    const result = parseCardGThemes(raw);
    expect(result).toHaveLength(1);
    expect(result[0].theme).toBe("a quoteless theme");
    expect(result[0].supporting_quotes).toEqual([]);
  });
});
