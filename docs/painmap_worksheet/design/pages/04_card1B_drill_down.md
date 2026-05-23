# Page Spec — Card 1-B · 走進其中一條，慢慢往下問 (NEW)

> Canonical：`user_journey.md` §Card 1-B、`data_model.md` `ai_narrowing.drill_rounds`、`exit_gates_matrix.md` Card 1-B、`ai_prompt_library.md` §3

---

## [PAGE META]

```yaml
page_name: Card 1-B · 走進其中一條，慢慢往下問
route_path: /learn/worksheet/04
page_type: form_card_ai
step_in_flow: 4
paincard_field_path: ai_narrowing.drill_rounds
ai_prompt_section: ai_prompt_library.md#3
exit_gate_section: exit_gates_matrix.md#card-1-b
journey_section: user_journey.md#card-1-b
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 1-B · 走進其中一條，慢慢往下問

我們選了一條路，現在開始往下走。

每一輪，你問一個更具體的問題，AI 陪你看一看，
然後你寫一句「我聽到了什麼」就好。

建議 3 輪，2 輪也可以走下一張。
```

---

## [USER INPUT BLOCK — 多輪 drill_rounds 列表]

每輪 entry 是一個 drill_round：

| 欄位 | 元件 | required | 注意 |
| :-- | :-- | :-: | :-- |
| `round` | (自動 1/2/3) | – | 由系統編號 |
| `user_question` | Textarea (2 行) | ✅ | 「你這一輪想問的問題」 |
| AI 按鈕：「請 AI 陪我看一看」 | – | – | 觸發 AI prompt |
| `ai_response` | Textarea (從 AI 貼回) | ✅ | 標籤「把 AI 的回應貼回來」 |
| `user_reflection` | Textarea (2 行) | ✅ | 「我從這輪聽到了什麼？」 |

UI 行為：
- 每輪是一個可摺疊卡片
- 完成一輪後，自動加下一輪的空輪
- 達 3 輪可手動結束，或繼續加（無上限，但 ≥ 3 後 CTA 解鎖）

---

## [AI ASSIST BLOCK]

- **prompt 原文**：`ai_prompt_library.md` §3.2
- **變數插值**（每輪重新組裝）：
  - `[貼上 complaint.verbatim]` ← Card 1
  - `[貼上 picked_direction.title / description]` ← Card 1-A
  - `[貼上 drill_rounds[]...]` ← 已完成的輪次串接
  - `[使用者本輪問題]` ← 本輪 user_question
- **solution-mode 偵測**：同 Card 1-A

---

## [CONTINUE-WHEN-READY]

- **L1**：C1B.1（≥ 2 輪，建議 3）+ C1B.2（每輪三欄非空）
- **next_button**：「走下一張卡 →」

軟性邀請（locked）：

```
走下一張卡前：
- 至少跑完 2 輪「問 → 聽 → 反思」
- 每輪都記得寫下你聽到了什麼（一句話就好）
```

---

## [DATA & API]

- **paincard_fields_read**: `complaint`, `ai_narrowing.directions`, `ai_narrowing.picked_direction_id`
- **paincard_fields_write**: `ai_narrowing.drill_rounds[]`

---

## [OCTALYSIS HOOKS]

- **Primary**: #3 Empowerment — 你問什麼、聽什麼，工具不替你問
- **Secondary**: #2 Accomplishment — 一輪一輪的進展感（但無「進度條 / 闖關」UI）

---

## [ACCEPTANCE CRITERIA]

- [ ] 多輪 CRUD 完整
- [ ] AI 按鈕只在 user_question 非空時啟用
- [ ] solution-mode 偵測作用於每輪
- [ ] L1 全綠後 next 解鎖（≥ 2 輪）
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
