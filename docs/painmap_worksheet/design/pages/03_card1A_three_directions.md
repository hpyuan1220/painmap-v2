# Page Spec — Card 1-A · AI 替你打開三條路 (NEW)

> Canonical：`user_journey.md` §Card 1-A、`data_model.md` `ai_narrowing.directions`、`exit_gates_matrix.md` Card 1-A、`ai_prompt_library.md` §2

---

## [PAGE META]

```yaml
page_name: Card 1-A · AI 替你打開三條路
route_path: /learn/worksheet/03
page_type: form_card_ai
step_in_flow: 3
paincard_field_path: ai_narrowing.directions, ai_narrowing.picked_direction_id
ai_prompt_section: ai_prompt_library.md#2
exit_gate_section: exit_gates_matrix.md#card-1-a
journey_section: user_journey.md#card-1-a
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 1-A · AI 替你打開三條路

把你寫的抱怨 + 日記貼給 AI，
不是要它替你想解法，而是請它替你打開幾條你可能還沒注意到的方向。

三條路裡，你最想再多聽哪一條？
其他兩條不會消失，這次先走一條而已。
```

---

## [AI ASSIST BLOCK]

- **prompt 原文**：`ai_prompt_library.md` §2.2
- **變數插值**（見 §2.3）：
  - `[貼上 Card 1 的 complaint.verbatim]` ← `complaint.verbatim`
  - `[貼上 complaint.source_name / relation / datetime / scene]` ← Card 1 各欄位
  - `[貼上 Card A 的 pain_diary entries]` ← `pain_diary.entries[]`（若空填「（暫時還沒有日記）」）
- **response_textarea**：標籤「把 AI 回的三條方向貼回來」
- **parser**：解析回應，自動填入 `ai_narrowing.directions[]`（最多 3 筆，每筆 title + description + why_it_matters）
- **solution-mode 偵測**：觸發時顯示 `voice_and_tone.md` §6.2 訊息 + 「重新試一次」按鈕

---

## [USER INPUT BLOCK — 選一條路]

- **元件**：3 個 radio card，每個顯示 AI 給的 title + description + why_it_matters
- **欄位**：`ai_narrowing.picked_direction_id`
- **嗓音**：選擇時不顯示「你選對了 / 選錯了」，僅顯示「這次先走這條」

---

## [CONTINUE-WHEN-READY]

- **L1**：C1A.1（directions.length === 3）+ C1A.2（picked_direction_id 非 null）
- **next_button**：「走下一張卡 →」

軟性邀請（locked）：

```
走下一張卡前：
- 把 AI 給你的三條方向貼回來
- 從三條裡選一條，這次先走它（其他兩條我們會替你留著）
```

---

## [DATA & API]

- **paincard_fields_read**: `complaint`, `pain_diary`
- **paincard_fields_write**: `ai_narrowing.directions[]`, `ai_narrowing.picked_direction_id`

---

## [OCTALYSIS HOOKS]

- **Primary**: #3 Empowerment — 「三條路你選」而非「AI 替你選」
- **Secondary**: #2 Accomplishment — 看到自己抱怨被打開成多條，獲得「我聽到的比想像多」的微感

---

## [ACCEPTANCE CRITERIA]

- [ ] prompt 變數插值正確
- [ ] parser 把 AI 回應解析成 3 筆 direction（fallback：若 < 3，顯示 hint 但仍可保留）
- [ ] 三個 radio card 視覺平等（不暗示哪個是「對的」）
- [ ] solution-mode 偵測 ≥ 90% recall
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
