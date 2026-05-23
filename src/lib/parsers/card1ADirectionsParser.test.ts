import { describe, expect, it } from "vitest";

import { parseCard1ADirections } from "@/lib/parsers/card1ADirectionsParser";

describe("parseCard1ADirections", () => {
  it("returns [] for empty input", () => {
    expect(parseCard1ADirections("")).toEqual([]);
    expect(parseCard1ADirections("   \n\n  ")).toEqual([]);
  });

  it("parses the canonical 林老師 example from ai_prompt_library §2.5", () => {
    const raw = `我從這段抱怨裡看到 3 條可能的方向，等你選：

方向 1：「整週的零散資料變成週末壓力源」
為什麼值得聽：你提到資料「散在週間 7 次」，但你都選擇在週末一次處理。
這條方向在意的是：是不是有「來不及消化的素材」累積這件事在發生？

方向 2：「具體 vs 不傷感情的兩難」
為什麼值得聽：你提到要「寫得具體」，但又有家長感受要顧。
這條方向在意的是：你是不是每週六其實是在做「翻譯」這件事。

方向 3：「30 個學生裡的少數特例耗掉多數時間」
為什麼值得聽：30 個學生不會每個都一樣難寫，但你寫成「30 個」的總量感。
這條方向在意的是：是不是少數幾個學生佔了多數的撰寫時間？`;

    const result = parseCard1ADirections(raw);

    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("整週的零散資料變成週末壓力源");
    expect(result[0].description).toContain("散在週間 7 次");
    expect(result[0].why_it_matters).toContain("來不及消化");
    expect(result[1].title).toBe("具體 vs 不傷感情的兩難");
    expect(result[2].title).toContain("少數特例");

    // Each direction must have a stable id usable as a radio value
    expect(result.map((d) => d.id)).toEqual(["d1", "d2", "d3"]);
  });

  it("falls back to numeric headers when '方向' is missing", () => {
    const raw = `1. 整週零散資料變成週末壓力
這是一個關於累積感的問題。

2. 具體 vs 不傷感情
你在做翻譯，不是寫作。

3. 少數特例佔多數時間
30 個學生不是平均分布的。`;

    const result = parseCard1ADirections(raw);
    expect(result).toHaveLength(3);
    expect(result[0].title).toContain("零散資料");
    expect(result[1].title).toContain("具體");
    expect(result[2].title).toContain("少數特例");
  });

  it("caps at 3 directions even when the AI returns 4+", () => {
    const raw = `方向 1：第一條
desc1
方向 2：第二條
desc2
方向 3：第三條
desc3
方向 4：第四條（多出來的）
desc4`;
    const result = parseCard1ADirections(raw);
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("第一條");
    expect(result[2].title).toBe("第三條");
  });

  it("returns whatever it can if the AI gave fewer than 3", () => {
    const raw = `方向 1：只有這一條方向
為什麼值得聽：因為原話只有一個切面。`;
    const result = parseCard1ADirections(raw);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("只有這一條方向");
    expect(result[0].description).toContain("只有一個切面");
  });

  it("handles markdown bold around the header", () => {
    const raw = `**方向 1**：被加粗的標題
為什麼值得聽：bold-friendly`;
    const result = parseCard1ADirections(raw);
    expect(result[0].title).toBe("被加粗的標題");
  });

  it("does not pick up numbered bullets inside the why-it-matters body", () => {
    const raw = `方向 1：第一條
為什麼值得聽：原話裡有三件事，分別是
1. 資料散
2. 時間集中
3. 寫完很累
這條方向在意的是：累積感`;
    const result = parseCard1ADirections(raw);
    expect(result).toHaveLength(1);
    expect(result[0].why_it_matters).toBe("累積感");
  });
});
