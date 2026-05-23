# Page Spec — Card 7 · 三個有名字的人 + 你心裡的猜想

> Canonical：`user_journey.md` §Card 7、`data_model.md` `people_with_guesses`、`exit_gates_matrix.md` Card 7、`ai_prompt_library.md` §9（選擇性 AI）

---

## [PAGE META]

```yaml
page_name: Card 7 · 三個有名字的人 + 你心裡的猜想
route_path: /learn/worksheet/10
page_type: form_card_ai
step_in_flow: 10
paincard_field_path: people_with_guesses
ai_prompt_section: ai_prompt_library.md#9
exit_gate_section: exit_gates_matrix.md#card-7
journey_section: user_journey.md#card-7
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 7 · 三個有名字的人 + 你心裡的猜想

三個人都要有名字 + 聯絡得到。
每人寫 3-5 個你預先猜他會說的答案 —
不是要你猜對，是要你記得自己的預期，
等一下訪談時才能辨認「驚訝」。
```

---

## [USER INPUT BLOCK]

### 段 1：背景

`people_with_guesses.background` — Textarea (3 行)，「這三個人的共同背景」

### 段 2：三個人（list.length === 3）

每人：

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `name` | Input | ✅，不可為「同事 A」這類代稱（L2 hint）|
| `contact` | Input | ✅，須有 LINE / 電話 / Email / IG 任一（L2 hint）|
| `relation` | Input | ✅ |
| `why_pick_them` | Textarea (2 行) | ✅ |
| `guessed_answers[]` | 動態列表（≥ 3, 建議 5） | ✅ |

UI：三個人並列卡片（desktop）/ 堆疊（mobile）

---

## [AI ASSIST BLOCK (選擇性)]

- 出現時機：3 個人都已填好、每人 ≥ 3 個 guessed_answers
- 按鈕：「想請 AI 陪我看一看我的猜想是不是太單一」
- prompt：`ai_prompt_library.md` §9.2
- 變數：`focused_pain.summary`, `people_with_guesses.list[]` 串接
- response：純參考，不修改猜想

---

## [CONTINUE-WHEN-READY]

- **L1**：C7.1（list.length === 3）+ C7.2（每人四欄寫滿）+ C7.3（每人 ≥ 3 猜想）
- **L2**：C7.h1（真名）+ C7.h2（聯絡方式）

軟性邀請（locked）：

```
走下一張卡前：
- 3 個有名字 + 聯絡得到的人
- 每人至少 3 個你預先猜的答案（建議 5 個）

如果你只想到 1-2 個人沒關係，
先把這頁存著，想到了再回來補。
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`, `empathy_map`
- **paincard_fields_write**: `people_with_guesses.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #5 Social Influence — 從抽象的「卡住」走到「我認識誰可以問」
- **Secondary**: #1 Epic Meaning — 訪談前的猜想是質性研究的重要儀式（empathy 的延伸）

---

## [ACCEPTANCE CRITERIA]

- [ ] 三個人卡片 RWD 正確
- [ ] guessed_answers 動態 CRUD
- [ ] L2 hint（代稱、缺聯絡方式）正確觸發
- [ ] AI 按鈕僅在 3 人 + 每人 ≥ 3 猜想時出現
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
