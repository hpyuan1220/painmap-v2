# Page Spec — Card D · 自我假設清單 (NEW)

> Canonical：`user_journey.md` §Card D、`data_model.md` `assumptions`、`exit_gates_matrix.md` Card D

---

## [PAGE META]

```yaml
page_name: Card D · 自我假設清單
route_path: /learn/worksheet/11
page_type: form_card                       # 無 AI 介入
step_in_flow: 11
paincard_field_path: assumptions
ai_prompt_section: (無)
exit_gate_section: exit_gates_matrix.md#card-d
journey_section: user_journey.md#card-d
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card D · 自我假設清單

走進對話前，我們先把自己心裡的猜想攤開來看一看。

不是要你放棄這些猜想，
是要你記得：等一下對方說的話如果跟你不一樣，
不要急著解釋掉它。

這張卡片要你自己寫，不請 AI 看 — 因為 AI 會替你合理化。
```

---

## [USER INPUT BLOCK]

### 段 1：假設清單（items[]）

每筆 item：

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `assumption` | Textarea (2 行) | ✅，「我目前的假設」 |
| `evidence_so_far` | Textarea (2 行) | ✅，「我手上的證據」 |
| `what_would_change_my_mind` | Textarea (2 行) | ✅，「訪談中聽到什麼，我才會修正」 |

UI：可加多個 item，預設 2 個空 item。

### 段 2：偏見自我提醒

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `biases_to_watch` | Textarea (4 行) | ✅，「我容易帶哪些偏見」 |

---

## [AI ASSIST BLOCK]

**無**。Card D 永久禁用 AI 輔助 — 這張卡的價值在於使用者**自己**寫，AI 會傾向合理化使用者的觀點。

---

## [CONTINUE-WHEN-READY]

- **L1**：CD.1（≥ 2 個 items）+ CD.2（每筆三欄寫滿）+ CD.3（biases_to_watch 非空）

軟性邀請（locked）：

```
走下一張卡前：
- 至少 2 個假設，每個都附「我手上的證據」+「聽到什麼會修正」
- 一段自我提醒：我容易帶哪些偏見

這張卡寫得越誠實，下一張真人對話越能聽出驚訝。
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`, `people_with_guesses`, `empathy_map`
- **paincard_fields_write**: `assumptions.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #1 Epic Meaning — 「自我反思是質性研究的研究倫理」
- **Secondary**: #3 Empowerment — 你寫、你自己看，工具不替你判斷

---

## [ACCEPTANCE CRITERIA]

- [ ] items 動態 CRUD
- [ ] 三欄全寫滿後才算該筆完成
- [ ] AI 區塊**不出現**
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] 嗓音核對：不寫「請列出」「驗證假設」，改寫「想邀請你寫下」「攤開來看一看」
