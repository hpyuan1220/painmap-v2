# Page Spec — Card G · 訪後沉澱 (NEW)

> Canonical：`user_journey.md` §Card G、`data_model.md` `post_interview_synthesis`、`exit_gates_matrix.md` Card G、`ai_prompt_library.md` §10

---

## [PAGE META]

```yaml
page_name: Card G · 訪後沉澱
route_path: /learn/worksheet/13
page_type: form_card_ai
step_in_flow: 13
paincard_field_path: post_interview_synthesis
ai_prompt_section: ai_prompt_library.md#10
exit_gate_section: exit_gates_matrix.md#card-g
journey_section: user_journey.md#card-g
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card G · 訪後沉澱

把訪談裡的聲音整理成幾個主題。

AI 會替你聚類成 3-5 個主題，你逐一看：
保留哪些、重新命名哪些、丟掉哪些？

最後寫一段約 80 字的沉澱 —
用你自己的話，不是 AI 的話。
```

---

## [AI ASSIST BLOCK]

- 按鈕：「請 AI 陪我把訪談聲音整理成主題」
- prompt：`ai_prompt_library.md` §10.2
- 變數：`focused_pain.summary`, `assumptions.items[]`, `interview.sessions[]`
- response 處理：parser 解析為 `ai_clustered_themes[]`（每筆含 theme + supporting_quotes）

---

## [USER INPUT BLOCK]

### 段 1：主題逐一檢視

每筆 `ai_clustered_themes[]` 顯示為一張卡：

| 欄位 | 元件 |
| :-- | :-- |
| theme | 顯示 |
| supporting_quotes | 顯示（折疊） |
| `user_kept` | Toggle (保留 / 丟掉) |
| `user_renamed_to` | Input（選填，可以改名）|

### 段 2：自己寫一段沉澱

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `user_summary` | Textarea (6 行) | ✅，≥ 80 字 |

### 段 3：member check 問題

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `member_check_questions[]` | 動態 List | ✅，≥ 1 條 |

---

## [CONTINUE-WHEN-READY]

- **L1**：CG.1（user_summary ≥ 80 字）+ CG.2（member_check_questions ≥ 1）
- **next_button**：「走到結尾的 Pain ID 卡片 →」

軟性邀請（locked）：

```
走到 Pain ID 卡片前：
- 一段約 80 字的訪後沉澱（用你自己的話）
- 至少一個你想回頭跟受訪者再 confirm 的問題

AI 整理的主題只是幫你打開思考，
最後留下的判斷由你寫。
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`, `assumptions`, `interview`
- **paincard_fields_write**: `post_interview_synthesis.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #2 Accomplishment — 走完訪談後第一次整理成主題的儀式感
- **Secondary**: #3 Empowerment — AI 整理、人判斷，2026 質性研究範本

---

## [ACCEPTANCE CRITERIA]

- [ ] AI parser 把回應解析為 ≤ 5 個主題
- [ ] 每個主題可保留 / 重命名 / 丟掉
- [ ] user_summary 字數計顯示
- [ ] member_check_questions ≥ 1 才解鎖
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
