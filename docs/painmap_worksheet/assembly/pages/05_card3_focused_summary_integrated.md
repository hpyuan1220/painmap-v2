# Card 3 · 聚焦痛點摘要 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/05_card3_focused_summary.md`
> **Schema**：`data_model.md` `focused_pain`
> **Exit gate**：`exit_gates_matrix.md#card-3`
> **AI prompt**：`ai_prompt_library.md` §4（選擇性）

---

## 任務

實作 `/learn/worksheet/05`，使用者把 Card 1-A / 1-B 走過的路寫成 60+ 字摘要 + 用那個人的話再說一次 + 為什麼是這條路。

## 檔案

- **Route**：`src/routes/learn.worksheet.05.tsx`
- **Component folder**：`src/components/worksheet/card05/`（v1 已有，內容全改）
- **Validator**：`src/lib/cardThreeValidators.ts`（重寫；舊 v1 內容刪除）
- **Prompt loader**：`src/lib/prompts/card3.prompt.ts`

## Instruction copy

```
Card 3 · 聚焦痛點摘要

把我們剛剛走過的路寫成一段約 60 字的摘要。

不是要你下結論，是把這趟路上聽到的東西，
先用自己的話收一次。
```

## Form 欄位

| Field | Type | Required |
| :-- | :-- | :-: |
| `focused_pain.summary` | Textarea (rows=5) | ✅ ≥ 60 字 |
| `focused_pain.in_their_own_words` | Textarea (rows=3) | ✅ |
| `focused_pain.why_this_one` | Textarea (rows=3) | ✅ |

字數計（不擋前進）：summary 顯示「目前 N 字 / 建議 60+」。

## AI block (選擇性)

- 觸發：summary 寫完後出現
- 按鈕：「想請 AI 陪我看一看這段摘要」
- Prompt：§4.2；變數見 §4.3
- 用途：AI 指出「替他想 vs 他自己會說」的句子，**不修改 summary**

## L1 條件

- C3.1：summary.length ≥ 60
- C3.2：in_their_own_words 非空
- C3.3：why_this_one 非空

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] 字數計顯示但不擋前進
- [ ] AI response 純參考，不覆蓋輸入
- [ ] 三欄全綠後解鎖
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
