# Card G · 訪後沉澱 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/13_cardG_post_synthesis.md`
> **Schema**：`data_model.md` `post_interview_synthesis`
> **Exit gate**：`exit_gates_matrix.md#card-g`
> **AI prompt**：`ai_prompt_library.md` §10

---

## 任務

實作 `/learn/worksheet/13`，使用者請 AI 把訪談聲音聚類成 3-5 個主題 → 逐一保留/重命名/丟棄 → 自己寫 80+ 字沉澱 + member check 問題。

## 檔案

- **Route**：`src/routes/learn.worksheet.13.tsx`
- **Component folder**：`src/components/worksheet/card13/` (NEW)
- **Validator**：`src/lib/cardGValidators.ts` (NEW)
- **Prompt loader**：`src/lib/prompts/cardG.prompt.ts` (NEW)
- **Parser**：`src/lib/parsers/cardGThemesParser.ts` (NEW)

## Instruction copy

```
Card G · 訪後沉澱

把訪談裡的聲音整理成幾個主題。

AI 會替你聚類成 3-5 個主題，你逐一看：
保留哪些、重新命名哪些、丟掉哪些？

最後寫一段約 80 字的沉澱 —
用你自己的話，不是 AI 的話。
```

## Form 結構

### 段 1：AI 主題聚類

- 按鈕：「請 AI 陪我把訪談聲音整理成主題」
- Prompt：§10.2
- 變數：`focused_pain.summary`, `assumptions.items[]`, `interview.sessions[]`
- Parser 解析為 `ai_clustered_themes[]`（每筆 theme + supporting_quotes）
- solution-mode 偵測：照常

### 段 2：主題逐一檢視

每筆 `ai_clustered_themes[]` 顯示為一張卡：

| 顯示 / 編輯 | 內容 |
| :-- | :-- |
| theme | （顯示 / 可改名）|
| supporting_quotes | 顯示（可折疊）|
| `user_kept` | Toggle |
| `user_renamed_to` | Input（選填）|

### 段 3：使用者自寫沉澱

| Field | Type | Required |
| :-- | :-- | :-: |
| `user_summary` | Textarea (rows=6) | ✅ ≥ 80 字 |

### 段 4：member check 問題

| Field | Type | Required |
| :-- | :-- | :-: |
| `member_check_questions[]` | 動態 List | ✅ ≥ 1 |

## L1 條件

- CG.1：user_summary.length ≥ 80
- CG.2：member_check_questions.length ≥ 1

## CTA

「走到結尾的 Pain ID 卡片 →」

按下後：`updateCardField('current_step', 'result')` → `navigate({ to: '/learn/worksheet/result' })`。

## Acceptance Criteria

- [ ] AI parser 解析 ≤ 5 個主題
- [ ] 每個主題可保留 / 重命名 / 丟棄
- [ ] user_summary 字數計顯示但不擋前進
- [ ] member_check_questions ≥ 1 才解鎖
- [ ] solution-mode 偵測作用
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
