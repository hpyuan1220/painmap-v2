# Card 1-B · 走進其中一條，慢慢往下問 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/04_card1B_drill_down.md`
> **Schema**：`data_model.md` `ai_narrowing.drill_rounds`
> **Exit gate**：`exit_gates_matrix.md#card-1-b`
> **AI prompt**：`ai_prompt_library.md` §3

---

## 任務

實作 `/learn/worksheet/04`，使用者跟 AI 進行 2-3 輪「往下問」對話，每輪寫問題、貼 AI 回應、寫一句反思。

## 檔案

- **Route**：`src/routes/learn.worksheet.04.tsx`
- **Component folder**：`src/components/worksheet/card04/`（v1 已有，內容全改）
- **Validator**：`src/lib/cardOneBValidators.ts`
- **Prompt loader**：`src/lib/prompts/card1B.prompt.ts`

## Instruction copy

```
Card 1-B · 走進其中一條，慢慢往下問

我們選了一條路，現在開始往下走。
每一輪，你問一個更具體的問題，AI 陪你看一看，
然後你寫一句「我聽到了什麼」就好。

建議 3 輪，2 輪也可以走下一張。
```

## Form 結構 — drill_rounds 列表

每輪是一張可摺疊卡片：

| Field | Required |
| :-- | :-: |
| `round` (自動編號 1/2/3) | – |
| `user_question` (Textarea rows=2) | ✅ |
| AI 按鈕 | – |
| `ai_response` (Textarea, AI 貼回) | ✅ |
| `user_reflection` (Textarea rows=2) | ✅，「我從這輪聽到了什麼？」 |

完成一輪後自動加下一輪空輪。≥ 3 輪可結束，但 2 輪即可解鎖 CTA。

## AI block (每輪一次)

- Prompt: `ai_prompt_library.md` §3.2，**每輪重新組裝**
- 變數：`complaint.verbatim`, `picked_direction.{title,description}`, 已完成的 `drill_rounds[]` 串接, 本輪 `user_question`
- solution-mode 偵測：照常

## L1 條件

- C1B.1：`drill_rounds.length ≥ 2`
- C1B.2：每輪三欄非空

## CTA

「走下一張卡 →」

## Acceptance Criteria

- [ ] 多輪 CRUD 完整
- [ ] AI 按鈕僅在當輪 `user_question` 非空時啟用
- [ ] 每輪 prompt 自動帶入之前輪次的歷史
- [ ] L1 達到後 next 解鎖
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
