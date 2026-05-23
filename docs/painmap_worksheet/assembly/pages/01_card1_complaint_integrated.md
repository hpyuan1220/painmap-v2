# Card 1 · 那句脫口而出的話 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/01_card1_complaint.md`
> **Schema**：`data_model.md` `complaint`
> **Exit gate**：`exit_gates_matrix.md#card-1`
> **AI prompt**：（無 — Card 1 永久禁用 AI）

---

## 任務

實作 `/learn/worksheet/01`，使用者寫下一句脫口而出的抱怨原話 + 4 個 context 欄位。

## 檔案

- **Route**：`src/routes/learn.worksheet.01.tsx`
- **Component folder**：`src/components/worksheet/card01/` — 重新用 v2 命名建立
- **Validator**：`src/lib/cardOneValidators.ts`（重寫，移除舊 anti-fake 等命令式 hint，改成軟性提示）

## Instruction copy（直接使用）

```
Card 1 · 那句脫口而出的話

先別整理、也別修飾。
把那句最近從你（或從你身邊的人）嘴裡跑出來的抱怨，
原汁原味寫下來就好。

這張卡片只屬於你，AI 不會看，也不會幫你修。
等一下我們會慢慢一起回到這句話裡，聽聽看它在說什麼。
```

## Form 欄位（React Hook Form + Zod）

| Field | Type | Required | Placeholder |
| :-- | :-- | :-: | :-- |
| `complaint.verbatim` | Textarea (rows=5) | ✅ ≥ 10 字 | 「寫下他說過的那句話，不用修飾」 |
| `complaint.source_name` | Input | ✅ | 「一個你叫得出名字的人」 |
| `complaint.source_relation` | Input | ✅ | 「你跟他的關係」 |
| `complaint.datetime` | Date / Input | ✅ | 「大概什麼時候說的」 |
| `complaint.scene` | Textarea (rows=3) | ✅ | 「他當時在做什麼、在哪裡」 |

Zod schema 從 `data_model.md` `complaint` 子 schema 生成。

## L1 條件 + L2 hint

見 `exit_gates_matrix.md#card-1`：
- L1: C1.1–C1.5（5 欄非空 + verbatim ≥ 10 字）
- L2 hint:
  - C1.h1（反分析語）：偵測「我覺得 / 應該 / 也許 / 可能 / 大概」→ 軟性 hint「這幾個字讀起來像是你替他想的，要不要試著只留下他自己說過的話？」**不擋前進**
  - C1.h2（真名）：偵測「同學 A / 老師 B / 某人 / 朋友」→ 軟性 hint「想邀請你補上一個你叫得出名字的人」**不擋前進**

## CTA

「走下一張卡 →」（disabled until L1 ready）。
按下後：`updateCardField('current_step', 2)` → `navigate({ to: '/learn/worksheet/02' })`。

## Acceptance Criteria

- [ ] 5 欄完整 + autosave 5s debounce
- [ ] L1 全綠前 CTA 灰色
- [ ] L2 hint 出現但**不擋前進**
- [ ] 無 AI 區塊
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] 舊 v1 的 `AntiFakeCheckPanel.tsx` 內容改寫為 `voice_and_tone.md` §6 軟性 hint 風格
