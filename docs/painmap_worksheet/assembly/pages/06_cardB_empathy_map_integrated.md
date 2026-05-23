# Card B · 心情地圖 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/06_cardB_empathy_map.md`
> **Schema**：`data_model.md` `empathy_map`
> **Exit gate**：`exit_gates_matrix.md#card-b`
> **AI prompt**：`ai_prompt_library.md` §5（選擇性）

---

## 任務

實作 `/learn/worksheet/06`，使用者填 Think / Feel / Say / Do / Pain / Gain 六宮格 empathy map。

## 檔案

- **Route**：`src/routes/learn.worksheet.06.tsx`
- **Component folder**：`src/components/worksheet/card06/`
- **Validator**：`src/lib/cardBValidators.ts`
- **Prompt loader**：`src/lib/prompts/cardB.prompt.ts`

## Instruction copy

```
Card B · 心情地圖

我們站到那個人的位置上看一看。
六個欄位都先簡單一句話就好，不用寫成段落。

他這個時候心裡在想什麼？身體上、表情上會出現什麼？
嘴上會說什麼、跟心裡想的一樣嗎？
```

## Form 結構

2x3 grid（Desktop）/ 1x6 stack（Mobile）。每格一行 textarea：

| Field | Label |
| :-- | :-- |
| `empathy_map.think` | 心裡想什麼 |
| `empathy_map.feel` | 感受 |
| `empathy_map.say` | 嘴上會說什麼 |
| `empathy_map.do` | 行為上會做什麼 |
| `empathy_map.pain` | 卡在哪 |
| `empathy_map.gain` | 希望得到 |

## AI block (選擇性)

- 出現條件：六欄皆非空
- 按鈕：「想請 AI 陪我把心情地圖看一遍」
- Prompt：`ai_prompt_library.md` §5.2
- 變數：`empathy_map`, `people_with_guesses.list[0]`
- 用途：AI 指出 say vs think 落差最大的格子，**不修改**

## L1 條件

- CB.1：六欄皆非空

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] 六宮格 RWD（2x3 desktop / 1x6 mobile）
- [ ] AI 按鈕僅在六欄滿時啟用
- [ ] 嗓音核對：不寫「使用者畫像」「persona」，改寫「他這個人」
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
