# Card A · 痛點現場日記 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/02_cardA_pain_diary.md`
> **Schema**：`data_model.md` `pain_diary`
> **Exit gate**：`exit_gates_matrix.md#card-a`
> **AI prompt**：`ai_prompt_library.md` §1（選擇性）

---

## 任務

實作 `/learn/worksheet/02`，使用者在接下來幾天記下 3-5 段「卡住的當下」日記。

## 檔案

- **Route**：`src/routes/learn.worksheet.02.tsx`
- **Component folder**：`src/components/worksheet/card02/`
- **Validator**：`src/lib/cardAValidators.ts`
- **Prompt loader**：`src/lib/prompts/cardA.prompt.ts`

## Instruction copy

```
Card A · 痛點現場日記

接下來幾天，當這個卡住的感覺又冒出來時，
隨手寫一兩句進來就好。

不用整理、不用美化，誠實的當下最有用。
我們建議 3 筆，但 1 筆也可以走下一張。
```

## Form 結構

動態 entries 列表（≥ 1, 建議 3）。每筆 entry：

| Field | Type | Required |
| :-- | :-- | :-: |
| `timestamp` | DateTimePicker | ✅ |
| `location` | Input | ✅ |
| `mood` | Input (短) | ✅ |
| `trigger` | Textarea (rows=2) | optional |
| `note` | Textarea (rows=3) | ✅ |
| `attachments[]` | (MVP 略) | optional |

每筆可摺疊。「＋ 加一筆現場日記」按鈕。

## AI block (選擇性)

- 出現條件：`entries.length ≥ 3`
- 按鈕文字：「想請 AI 陪我看一看這幾段日記」
- Prompt：載入 `prompts/cardA.prompt.ts`（取自 `ai_prompt_library.md` §1.2）
- 變數：全部 `pain_diary.entries[]` 串接
- Response：純參考，不修改任何欄位
- solution-mode 偵測：照常

## L1 條件

- CA.1：≥ 1 筆
- CA.2：每筆 timestamp + location + note 非空

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] entries 動態 CRUD
- [ ] AI 按鈕只在 ≥ 3 筆時出現
- [ ] AI response 純參考，不寫入 schema
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] solution-mode 偵測作用
