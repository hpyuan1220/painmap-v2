# Card D · 自我假設清單 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/11_cardD_assumptions.md`
> **Schema**：`data_model.md` `assumptions`
> **Exit gate**：`exit_gates_matrix.md#card-d`
> **AI prompt**：（無 — Card D 永久禁用 AI）

---

## 任務

實作 `/learn/worksheet/11`，使用者寫至少 2 個自我假設 + 偏見自省。**這張卡不請 AI 看**，因為 AI 會傾向合理化使用者的觀點。

## 檔案

- **Route**：`src/routes/learn.worksheet.11.tsx`
- **Component folder**：`src/components/worksheet/card11/` (NEW)
- **Validator**：`src/lib/cardDValidators.ts` (NEW)

## Instruction copy

```
Card D · 自我假設清單

走進對話前，我們先把自己心裡的猜想攤開來看一看。

不是要你放棄這些猜想，
是要你記得：等一下對方說的話如果跟你不一樣，
不要急著解釋掉它。

這張卡片要你自己寫，不請 AI 看 —
因為 AI 會替你合理化。
```

## Form 結構

### 段 1：假設清單（items[]）

動態列表，預設 2 個空 item。每筆：

| Field | Type | Required |
| :-- | :-- | :-: |
| `assumption` | Textarea (rows=2) | ✅ |
| `evidence_so_far` | Textarea (rows=2) | ✅ |
| `what_would_change_my_mind` | Textarea (rows=2) | ✅ |

### 段 2：偏見自我提醒

| Field | Type | Required |
| :-- | :-- | :-: |
| `biases_to_watch` | Textarea (rows=4) | ✅ |

## AI block

**不出現**。這張卡的核心價值是使用者**自己**寫。

## L1 條件

- CD.1：items.length ≥ 2
- CD.2：每筆三欄寫滿
- CD.3：biases_to_watch 非空

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] items 動態 CRUD
- [ ] **沒有 AI 區塊**
- [ ] 三欄全寫滿後該筆才完成
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] 嗓音核對：不寫「請列出」「驗證假設」，改寫「想邀請你寫下」「攤開來看一看」
