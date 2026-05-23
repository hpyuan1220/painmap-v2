# Page Spec — Card 5 · 取捨對話

> Canonical：`user_journey.md` §Card 5、`data_model.md` `contradiction.pairs`、`exit_gates_matrix.md` Card 5、`ai_prompt_library.md` §7（選擇性 AI）

---

## [PAGE META]

```yaml
page_name: Card 5 · 取捨對話
route_path: /learn/worksheet/08
page_type: form_card_ai
step_in_flow: 8
paincard_field_path: contradiction
ai_prompt_section: ai_prompt_library.md#7
exit_gate_section: exit_gates_matrix.md#card-5
journey_section: user_journey.md#card-5
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 5 · 取捨對話

每個卡住的故事裡通常都藏著「想要兩個東西，但只能選一個」的取捨。

寫一組就可以走下一張，但 3 組會讓你更看清楚自己的優先序。

句型：
「我想要 A，也想要 B。
 但如果一定要選，我會選 ___，因為 ___。」
```

---

## [USER INPUT BLOCK — 取捨組列表]

每組 pair：

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `side_a` | Input (一句話) | ✅ |
| `side_b` | Input (一句話) | ✅ |
| `picked` | RadioGroup (A/B) | ✅ |
| `reason` | Textarea (2 行) | ✅ |

UI：
- 「＋ 加一組取捨」按鈕
- 預設先給 1 組空 pair
- ≥ 1 組 + 該組全綠即可走下一張

---

## [AI ASSIST BLOCK (選擇性)]

- 按鈕「想請 AI 陪我把取捨寫清楚」
- prompt：`ai_prompt_library.md` §7.2
- 變數：`focused_pain.summary`、`empathy_map`
- AI 只列出可能的 A/B 組合，**不替使用者選**，使用者讀完自己決定要不要採用

---

## [CONTINUE-WHEN-READY]

- **L1**：C5.1（≥ 1 組）+ C5.2（每組 side_a/side_b/picked/reason 全寫）

軟性邀請（locked）：

```
走下一張卡前：
- 至少寫一組取捨（A、B、選哪個、為什麼）
- 想再多寫幾組也歡迎 — 3 組會更清楚
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`, `empathy_map`
- **paincard_fields_write**: `contradiction.pairs[]`

---

## [OCTALYSIS HOOKS]

- **Primary**: #3 Empowerment — 「你選 A 或 B，AI 不替你選」
- **Secondary**: #1 Epic Meaning — 看見取捨的存在本身，是質性研究的重要 aha

---

## [ACCEPTANCE CRITERIA]

- [ ] 多組 CRUD 正常
- [ ] AI 提案不自動寫入 pairs
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
