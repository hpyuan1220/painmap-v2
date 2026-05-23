# Card 5 · 取捨對話 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/08_card5_tradeoffs.md`
> **Schema**：`data_model.md` `contradiction.pairs`
> **Exit gate**：`exit_gates_matrix.md#card-5`
> **AI prompt**：`ai_prompt_library.md` §7（選擇性）

---

## 任務

實作 `/learn/worksheet/08`，使用者寫 1-3 組「想要 A 也想要 B，但只能選一個 + 為什麼」的取捨。

## 檔案

- **Route**：`src/routes/learn.worksheet.08.tsx`
- **Component folder**：`src/components/worksheet/card08/`
- **Validator**：`src/lib/cardFiveValidators.ts`（重寫，v1 邏輯部分可保留）
- **Prompt loader**：`src/lib/prompts/card5.prompt.ts`

## Instruction copy

```
Card 5 · 取捨對話

每個卡住的故事裡通常都藏著「想要兩個東西，但只能選一個」的取捨。

寫一組就可以走下一張，但 3 組會讓你更看清楚自己的優先序。

句型：
「我想要 A，也想要 B。
 但如果一定要選，我會選 ___，因為 ___。」
```

## Form 結構

動態 pairs 列表。每組：

| Field | Type | Required |
| :-- | :-- | :-: |
| `side_a` | Input | ✅ |
| `side_b` | Input | ✅ |
| `picked` | RadioGroup (a/b) | ✅ |
| `reason` | Textarea (rows=2) | ✅ |

「＋ 加一組取捨」按鈕。預設給 1 組空 pair。

## AI block (選擇性)

- 按鈕：「想請 AI 陪我把取捨寫清楚」
- Prompt：§7.2
- 變數：`focused_pain.summary`, `empathy_map`
- AI 只列可能的 A/B 組合，**不替使用者選** `picked` 或寫 `reason`

## L1 條件

- C5.1：pairs.length ≥ 1
- C5.2：每組四欄寫滿

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] 多組 CRUD
- [ ] AI 提案不自動寫入 pairs
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
