# Card 6 · 市場聲音的三段證據 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/09_card6_market_evidence.md`
> **Schema**：`data_model.md` `ai_evidence`
> **Exit gate**：`exit_gates_matrix.md#card-6`
> **AI prompt**：`ai_prompt_library.md` §8

---

## 任務

實作 `/learn/worksheet/09`，使用者用 ChatGPT Deep Research / Perplexity 等找 3 段公開證據 + 寫 landscape 觀察。

## 檔案

- **Route**：`src/routes/learn.worksheet.09.tsx`
- **Component folder**：`src/components/worksheet/card09/`
- **Validator**：`src/lib/cardSixHelpers.ts`（部分可重用 v1）
- **Prompt loader**：`src/lib/prompts/card6.prompt.ts`
- **Parser**：`src/lib/parsers/card6EvidenceParser.ts`

## Instruction copy

```
Card 6 · 市場聲音的三段證據

找 3 段你在外面聽到的聲音 — 可以是論壇、新聞、訪談、學術文章。
每段都寫一句「為什麼這段跟我手上的故事有關」。

別替我打分數、別替我下「common pain / niche pain」這類判斷 —
那個讓你自己看完 3 段之後寫。
```

## Form 結構

### 段 1：AI 工具選擇

`ai_evidence.ai_tool`：RadioGroup（chatgpt_dr / claude / perplexity / gemini / in_app）

### 段 2：AI 按鈕

「請 AI 陪我去找市場聲音的三段證據」→ §8.2 prompt → parser 解析為 `evidences[]`

### 段 3：證據列表（≥ 3）

每筆：

| Field | Type | Required |
| :-- | :-- | :-: |
| `source` | Input (URL + 描述) | ✅ |
| `quote` | Textarea (rows=3) | ✅，**不可只是 URL** |
| `relevance` | Textarea (rows=2) | ✅ |

### 段 4：使用者觀察

| Field | Type | Required |
| :-- | :-- | :-: |
| `landscape` | RadioGroup (common_pain / niche_pain / unclear) | ✅ |
| `landscape_note` | Textarea (rows=3) | ✅ |

## L1 條件

- C6.1：evidences.length ≥ 3
- C6.2：每段三欄寫滿
- C6.3：landscape_note 非空
- **L2** C6.h1：quote 純連結時軟性 hint

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] AI 工具選擇正確帶入 prompt
- [ ] Parser 解析 ≤ 3 筆 evidence
- [ ] L2 hint：quote 偵測純 URL
- [ ] landscape 不顯示「正確答案」
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
