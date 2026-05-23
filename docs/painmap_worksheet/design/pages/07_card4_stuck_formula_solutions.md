# Page Spec — Card 4 · 把卡點輕輕說清楚 + AI 解法回看

> Canonical：`user_journey.md` §Card 4、`data_model.md` `stuck_formula_with_solutions`、`exit_gates_matrix.md` Card 4、`ai_prompt_library.md` §6

---

## [PAGE META]

```yaml
page_name: Card 4 · 把卡點輕輕說清楚 + AI 解法回看
route_path: /learn/worksheet/07
page_type: form_card_ai
step_in_flow: 7
paincard_field_path: stuck_formula_with_solutions
ai_prompt_section: ai_prompt_library.md#6
exit_gate_section: exit_gates_matrix.md#card-4
journey_section: user_journey.md#card-4
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 4 · 把卡點輕輕說清楚 + AI 解法回看

先用一句話把卡點寫下來：
「我每次要 ___，都會卡在 ___」

寫完之後，請 AI 列幾個市場上常見的解法。
我們不急著評論它們好或不好，
只想請你誠實寫一寫：如果用這個，你心裡那個卡住的感覺，會不會就消失？
```

---

## [USER INPUT BLOCK]

### 段 1：卡點公式

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `user_draft` | Textarea (3 行) | ✅ |

### 段 2：AI 整理（選擇性）

- 按鈕「想請 AI 陪我把卡點寫清楚」→ 觸發 `ai_prompt_library.md` §6.2 prompt
- 回應：`ai_polished` + `ai_clarifying_questions[]`
- 純參考，不取代 `user_draft`

### 段 3：AI 提解法

- 按鈕「請 AI 列出市場上常見的幾個解法」→ 觸發 §6.3 prompt
- 回應：解析為 `ai_solutions[]`（label + description）

### 段 4：使用者回看解法

每個 ai_solution 對應一個 verdict 卡：

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `verdict` (helps/partial/no/unknown) | RadioGroup | ✅ |
| `reason` | Textarea (2 行) | ✅，且 ≥ 8 字（L2 hint） |

---

## [AI ASSIST BLOCK]

- 兩個獨立 AI prompt（§6.2 整理、§6.3 解法），分別有自己的「貼回 response」textarea
- solution-mode 偵測：在 §6.3 的回應上**不**觸發（這次是請 AI 提常見解法，本來就會列解法），但若 AI 開始推薦特定產品名 / SaaS 名，仍提示
- response parser：把 AI 回應的 N 個解法解析為 `ai_solutions[]`

---

## [CONTINUE-WHEN-READY]

- **L1**：C4.1 + C4.2（≥ 3 個 verdict）+ C4.3（每筆 reason 非空）
- **L2**：C4.h1（reason 不能只兩個字）

軟性邀請（locked）：

```
走下一張卡前：
- 至少對 3 個解法寫下「為什麼這個不夠」
- 一句具體的場景就好，不用寫成論文
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`
- **paincard_fields_write**: `stuck_formula_with_solutions.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #3 Empowerment — 「AI 列解法，你判斷」
- **Secondary**: #2 Accomplishment — 寫完 3 個 verdict 後對自己痛點的清晰度躍升

---

## [ACCEPTANCE CRITERIA]

- [ ] 兩段 AI 流程（整理、解法）分別運作
- [ ] solution 列表解析正確
- [ ] verdict + reason 寫滿 ≥ 3 個後 next 解鎖
- [ ] solution-mode hint 觸發條件正確（推薦 SaaS / App 名才觸發，提常見解法不觸發）
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
