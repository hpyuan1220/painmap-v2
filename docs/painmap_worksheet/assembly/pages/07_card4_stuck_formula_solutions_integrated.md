# Card 4 · 把卡點輕輕說清楚 + AI 解法回看 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/07_card4_stuck_formula_solutions.md`
> **Schema**：`data_model.md` `stuck_formula_with_solutions`
> **Exit gate**：`exit_gates_matrix.md#card-4`
> **AI prompt**：`ai_prompt_library.md` §6（兩段：整理 + 提解法）

---

## 任務

實作 `/learn/worksheet/07`，使用者寫卡點公式 → AI 整理（選擇性）→ AI 列常見解法 → 使用者逐一回看寫 verdict + reason。

## 檔案

- **Route**：`src/routes/learn.worksheet.07.tsx`
- **Component folder**：`src/components/worksheet/card07/`
- **Validator**：`src/lib/cardFourValidators.ts`（重寫；合併舊 v1 workaround 邏輯）
- **Prompt loaders**：
  - `src/lib/prompts/card4_polish.prompt.ts`（§6.2 整理）
  - `src/lib/prompts/card4_solutions.prompt.ts`（§6.3 解法）
- **Parser**：`src/lib/parsers/card4SolutionsParser.ts`

## Instruction copy

```
Card 4 · 把卡點輕輕說清楚 + AI 解法回看

先用一句話把卡點寫下來：
「我每次要 ___，都會卡在 ___」

寫完之後，請 AI 列幾個市場上常見的解法。
我們不急著評論它們好或不好，
只想請你誠實寫一寫：如果用這個，你心裡那個卡住的感覺，會不會就消失？
```

## Form 結構

### 段 1：卡點公式

| Field | Type | Required |
| :-- | :-- | :-: |
| `user_draft` | Textarea (rows=3) | ✅ |

### 段 2：AI 整理（選擇性）

按鈕「想請 AI 陪我把卡點寫清楚」→ §6.2 prompt → 回填 `ai_polished` + `ai_clarifying_questions[]`。**不取代 user_draft**。

### 段 3：AI 提解法

按鈕「請 AI 列出市場上常見的幾個解法」→ §6.3 prompt → parser 解析為 `ai_solutions[]`（label + description，3-5 個）。

### 段 4：使用者回看

每個 ai_solution 對應一個 verdict 卡：

| Field | Type | Required |
| :-- | :-- | :-: |
| `verdict` | RadioGroup (helps / partial / no / unknown) | ✅ |
| `reason` | Textarea (rows=2) | ✅ ≥ 8 字 |

寫入 `user_solution_verdicts[]`。

## solution-mode 偵測（特殊規則）

- §6.3 的回應**不**觸發 solution-mode 提示（這次是主動請 AI 提解法）
- 但若 AI 開始推薦特定產品名 / SaaS 名 / 「我們可以做一個 ___」，照常提示

## L1 條件

- C4.1：user_draft 非空
- C4.2：user_solution_verdicts.length ≥ 3
- C4.3：每筆 reason 非空
- **L2** C4.h1：reason 不能只兩字（「沒用」「不行」），觸發軟性 hint

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] 兩段 AI 流程獨立運作
- [ ] Parser 把 AI 回應解析成 ai_solutions[]
- [ ] verdict + reason ≥ 3 個後解鎖
- [ ] solution-mode 偵測作用於 §6.3 推薦特定產品的情境
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
