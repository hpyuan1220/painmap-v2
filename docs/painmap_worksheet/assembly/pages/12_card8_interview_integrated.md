# Card 8 · 真人對話 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/12_card8_interview.md`
> **Schema**：`data_model.md` `interview`
> **Exit gate**：`exit_gates_matrix.md#card-8`
> **AI prompt**：（無 — Card 8 永久禁用 AI）

---

## 任務

實作 `/learn/worksheet/12`，使用者記錄與 Card 7 三個人的真人對話（key_quotes、surprises、confirmed_guesses、new_threads）。

## 檔案

- **Route**：`src/routes/learn.worksheet.12.tsx`
- **Component folder**：`src/components/worksheet/card12/`
- **Validator**：`src/lib/cardEightValidators.ts`（重寫；v1 舊 interview_plan 邏輯刪除）

## Instruction copy

```
Card 8 · 真人對話

跟 Card 7 的三個人聊完之後，回來記錄你聽到了什麼。

一場對話也可以走下一張，但 3 場會讓你更看清楚
哪些是個別的、哪些是共通的。

不用寫成逐字稿，幾句印象深刻的原話就好。
```

## Form 結構

動態 sessions 列表。每場：

| Field | Type | Required |
| :-- | :-- | :-: |
| `person_name` | Select（從 `people_with_guesses.list` 帶入）| ✅ |
| `datetime` | DateTime | ✅ |
| `mode` | RadioGroup (in_person / video_call / phone / chat) | ✅ |
| `consent_recorded` | Checkbox | optional（軟性提示建議勾選） |
| `key_quotes[]` | 動態 List | ✅ ≥ 1 |
| `surprises[]` | 動態 List | optional |
| `confirmed_guesses[]` | 動態 List | optional |
| `new_threads[]` | 動態 List | optional |

「＋ 加一場對話」按鈕。

偵測 `people_with_guesses.list` 中尚未對話的人，顯示提示「{name} 還沒對話，要不要先記下來？」（軟性，不擋前進）。

## AI block

**不出現**。

## L1 條件

- C8.1：sessions.length ≥ 1
- C8.2：每場 person_name + datetime + mode + key_quotes 非空

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] sessions 動態 CRUD
- [ ] person_name 自動帶入 Card 7 list
- [ ] **沒有 AI 區塊**
- [ ] consent_recorded 不勾選不擋前進（但顯示「建議先取得對方同意」軟提示）
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
