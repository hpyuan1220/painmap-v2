# Card 1-A · AI 替你打開三條路 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/03_card1A_three_directions.md`
> **Schema**：`data_model.md` `ai_narrowing.directions`, `picked_direction_id`
> **Exit gate**：`exit_gates_matrix.md#card-1-a`
> **AI prompt**：`ai_prompt_library.md` §2

---

## 任務

實作 `/learn/worksheet/03`，使用者請外部 AI 從抱怨原話 + 日記出發，回傳 3 條值得繼續往下聽的方向，使用者選一條。

## 檔案

- **Route**：`src/routes/learn.worksheet.03.tsx`
- **Component folder**：`src/components/worksheet/card03/`（v1 已有此資料夾，內容全改）
- **Validator**：`src/lib/cardOneAValidators.ts`
- **Prompt loader**：`src/lib/prompts/card1A.prompt.ts`
- **Parser**：`src/lib/parsers/card1AParser.ts`（從 AI response 解析出 3 個 direction）

## Instruction copy

```
Card 1-A · AI 替你打開三條路

把你寫的抱怨 + 日記貼給 AI，
不是要它替你想解法，而是請它替你打開幾條你可能還沒注意到的方向。

三條路裡，你最想再多聽哪一條？
其他兩條不會消失，這次先走一條而已。
```

## AI block

- Prompt: 載入 `prompts/card1A.prompt.ts`（取自 `ai_prompt_library.md` §2.2）
- 變數插值（見 §2.3）：`complaint.*`, `pain_diary.entries[]`（若空填「（暫時還沒有日記）」）
- Response textarea label：「把 AI 回的三條方向貼回來」
- Parser 解析為 `ai_narrowing.directions[]`（每筆 title + description + why_it_matters）
- solution-mode 偵測：照常

## User input — 選一條

3 個 radio card（一條方向 = 一張卡）。
寫入 `ai_narrowing.picked_direction_id`。

UI 嗓音：選擇時不出現「你選對 / 選錯」，僅顯示「這次先走這條」。

## L1 條件

- C1A.1：directions.length === 3
- C1A.2：picked_direction_id !== null

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] AI prompt 變數插值正確
- [ ] Parser fallback：若 AI 給 < 3 條，顯示 hint「AI 只給了 N 條，要再試一次嗎？」（不擋前進）
- [ ] 三個 radio card 視覺平等
- [ ] solution-mode 偵測 ≥ 90% recall
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
