# Page Spec — Card 3 · 聚焦痛點摘要

> Canonical：`user_journey.md` §Card 3、`data_model.md` `focused_pain`、`exit_gates_matrix.md` Card 3、`ai_prompt_library.md` §4（選擇性 AI）

---

## [PAGE META]

```yaml
page_name: Card 3 · 聚焦痛點摘要
route_path: /learn/worksheet/05
page_type: form_card_ai                   # AI 選擇性介入
step_in_flow: 5
paincard_field_path: focused_pain
ai_prompt_section: ai_prompt_library.md#4
exit_gate_section: exit_gates_matrix.md#card-3
journey_section: user_journey.md#card-3
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 3 · 聚焦痛點摘要

把我們剛剛走過的路寫成一段約 60 字的摘要。

不是要你下結論，是把這趟路上聽到的東西，
先用自己的話收一次。
```

---

## [USER INPUT BLOCK]

| 欄位 | 元件 | required | placeholder |
| :-- | :-- | :-: | :-- |
| `focused_pain.summary` | Textarea (5 行) | ✅ | 「用你自己的話，60 字以上」 |
| `focused_pain.in_their_own_words` | Textarea (3 行) | ✅ | 「用那個人會講的話，再說一次」 |
| `focused_pain.why_this_one` | Textarea (3 行) | ✅ | 「為什麼是這條路，不是另外兩條？」 |

字數計（不擋前進，純參考）：summary 顯示「目前 N 字 / 建議 60+」

---

## [AI ASSIST BLOCK (選擇性)]

- **觸發**：使用者寫完 summary 後出現
- **按鈕文字**：「想請 AI 陪我看一看這段摘要」
- **prompt**：`ai_prompt_library.md` §4.2
- **變數插值**：對應 `complaint.verbatim`, picked direction + drill rounds 摘要, `focused_pain.summary`, `in_their_own_words`
- **response 處理**：純參考，**不**自動覆蓋使用者摘要

---

## [CONTINUE-WHEN-READY]

- **L1**：C3.1（summary ≥ 60 字）+ C3.2 + C3.3
- **next_button**：「走下一張卡 →」

軟性邀請（locked）：

```
走下一張卡前：
- 用你自己的話寫一段約 60 字的摘要
- 用那個人會說的話再說一次
- 寫一句為什麼是這條路（不是另外兩條）
```

---

## [DATA & API]

- **paincard_fields_read**: `complaint`, `ai_narrowing`
- **paincard_fields_write**: `focused_pain.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #2 Accomplishment — 走完前面 4 步後第一次「自己整理出一段摘要」的微感
- **Secondary**: #3 Empowerment — 用自己的話，不照抄 AI

---

## [ACCEPTANCE CRITERIA]

- [ ] 三個欄位 autosave 運作
- [ ] AI 按鈕僅作為對照，不覆蓋輸入
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
