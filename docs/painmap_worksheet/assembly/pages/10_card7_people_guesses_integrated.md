# Card 7 · 三個有名字的人 + 你心裡的猜想 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/10_card7_people_guesses.md`
> **Schema**：`data_model.md` `people_with_guesses`
> **Exit gate**：`exit_gates_matrix.md#card-7`
> **AI prompt**：`ai_prompt_library.md` §9（選擇性）

---

## 任務

實作 `/learn/worksheet/10`，使用者寫 3 個有名字 + 聯絡得到的人，每人寫 3-5 個預先猜的答案。

## 檔案

- **Route**：`src/routes/learn.worksheet.10.tsx`
- **Component folder**：`src/components/worksheet/card10/`（v1 已有，內容全改）
- **Validator**：`src/lib/cardSevenValidators.ts`（重寫）
- **Prompt loader**：`src/lib/prompts/card7.prompt.ts`

## Instruction copy

```
Card 7 · 三個有名字的人 + 你心裡的猜想

三個人都要有名字 + 聯絡得到。
每人寫 3-5 個你預先猜他會說的答案 —
不是要你猜對，是要你記得自己的預期，
等一下訪談時才能辨認「驚訝」。
```

## Form 結構

### 段 1：背景

`people_with_guesses.background` — Textarea (rows=3)，「這三個人的共同背景」

### 段 2：三個人（list.length === 3）

每人一張卡：

| Field | Type | Required |
| :-- | :-- | :-: |
| `name` | Input | ✅（L2 hint：不可代稱）|
| `contact` | Input | ✅（L2 hint：必須有 LINE/電話/Email/IG 任一）|
| `relation` | Input | ✅ |
| `why_pick_them` | Textarea (rows=2) | ✅ |
| `guessed_answers[]` | 動態 List | ✅ ≥ 3（建議 5）|

UI：Desktop 三欄並列，Mobile 堆疊。

## AI block (選擇性)

- 出現條件：3 人都填好、每人 ≥ 3 個 guessed_answers
- 按鈕：「想請 AI 陪我看一看我的猜想是不是太單一」
- Prompt：§9.2
- 變數：`focused_pain.summary`, `people_with_guesses.list[]` 串接
- AI 純參考，**不修改猜想**

## L1 條件

- C7.1：list.length === 3
- C7.2：每人四欄寫滿
- C7.3：每人 guessed_answers ≥ 3
- **L2** C7.h1（代稱）+ C7.h2（缺聯絡方式）

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] 3 人卡片 RWD
- [ ] guessed_answers 動態 CRUD
- [ ] L2 hint：代稱、缺聯絡方式
- [ ] AI 按鈕條件正確
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
