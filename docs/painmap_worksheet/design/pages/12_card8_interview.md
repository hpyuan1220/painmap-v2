# Page Spec — Card 8 · 真人對話

> Canonical：`user_journey.md` §Card 8、`data_model.md` `interview`、`exit_gates_matrix.md` Card 8

---

## [PAGE META]

```yaml
page_name: Card 8 · 真人對話
route_path: /learn/worksheet/12
page_type: form_card                       # 無 AI 介入
step_in_flow: 12
paincard_field_path: interview
ai_prompt_section: (無)
exit_gate_section: exit_gates_matrix.md#card-8
journey_section: user_journey.md#card-8
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 8 · 真人對話

跟 Card 7 的三個人聊完之後，回來記錄你聽到了什麼。

一場對話也可以走下一張，但 3 場會讓你更看清楚
哪些是個別的、哪些是共通的。

不用寫成逐字稿，幾句印象深刻的原話就好。
```

---

## [USER INPUT BLOCK — sessions[]]

每筆 session：

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `person_name` | Select (從 `people_with_guesses.list` 帶入) | ✅ |
| `datetime` | DateTime | ✅ |
| `mode` | RadioGroup (in_person / video_call / phone / chat) | ✅ |
| `consent_recorded` | Checkbox | optional，但建議勾選 |
| `key_quotes[]` | 動態 List (Textarea 每筆) | ✅，≥ 1 條 |
| `surprises[]` | 動態 List | optional，但建議 ≥ 1 |
| `confirmed_guesses[]` | 動態 List | optional |
| `new_threads[]` | 動態 List | optional |

UI：
- 每場 session 是一張可摺疊卡片
- 「＋ 加一場對話」按鈕
- 偵測 `people_with_guesses.list` 中尚未對話的人，顯示提示「{name} 還沒對話，要不要先記下來？」

---

## [AI ASSIST BLOCK]

**無**。Card 8 永久禁用 AI 輔助 — 這張卡是真人對話的記錄，AI 不應介入。
（Card G 的 AI 介入會在訪後沉澱時才出現。）

---

## [CONTINUE-WHEN-READY]

- **L1**：C8.1（≥ 1 場）+ C8.2（每場 person_name + datetime + mode + key_quotes 非空）

軟性邀請（locked）：

```
走下一張卡前：
- 至少寫下 1 場對話
- 每場至少記得一句印象深刻的原話

如果你還沒約到人，先把這頁存著，
等聊完再回來填。沒有時間限制。
```

---

## [DATA & API]

- **paincard_fields_read**: `people_with_guesses`, `assumptions`
- **paincard_fields_write**: `interview.sessions[]`

---

## [OCTALYSIS HOOKS]

- **Primary**: #5 Social Influence — 真實對話帶來「我聽到了人」的核心 aha
- **Secondary**: #1 Epic Meaning — 質性研究的核心動作

---

## [ACCEPTANCE CRITERIA]

- [ ] sessions 動態 CRUD
- [ ] person_name 自動帶入 Card 7 的 list
- [ ] AI 區塊**不出現**
- [ ] consent_recorded 不勾選不擋前進，但顯示軟性提示「建議先取得對方同意再做記錄」
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
