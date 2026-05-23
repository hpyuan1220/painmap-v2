# Page Spec — Card 1 · 那句脫口而出的話

> Canonical：`user_journey.md` §Card 1、`data_model.md` `complaint`、`exit_gates_matrix.md` Card 1、`voice_and_tone.md` §4.2

---

## [PAGE META]

```yaml
page_name: Card 1 · 那句脫口而出的話
route_path: /learn/worksheet/01
page_type: form_card                      # 此卡無 AI 介入
step_in_flow: 1
paincard_field_path: complaint
ai_prompt_section: (無)
exit_gate_section: exit_gates_matrix.md#card-1
journey_section: user_journey.md#card-1
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 1 · 那句脫口而出的話

先別整理、也別修飾。
把那句最近從你（或從你身邊的人）嘴裡跑出來的抱怨，原汁原味寫下來就好。

這張卡片只屬於你，AI 不會看，也不會幫你修。
等一下我們會慢慢一起回到這句話裡，聽聽看它在說什麼。
```

---

## [USER INPUT BLOCK]

| 欄位 | 元件 | required | placeholder / hint |
| :-- | :-- | :-: | :-- |
| `complaint.verbatim` | Textarea (5 行高) | ✅ | 「寫下他說過的那句話，不用修飾」 |
| `complaint.source_name` | Input | ✅ | 「一個你叫得出名字的人」 |
| `complaint.source_relation` | Input | ✅ | 「你跟他的關係」 |
| `complaint.datetime` | Input / Date | ✅ | 「大概什麼時候說的（哪天 / 哪一週）」 |
| `complaint.scene` | Textarea (3 行) | ✅ | 「他當時在做什麼、在哪裡」 |

---

## [CONTINUE-WHEN-READY]

- **L1**：C1.1–C1.5（見 `exit_gates_matrix.md`）— 所有欄位寫滿；verbatim ≥ 10 字
- **L2**：C1.h1（反分析語提示）、C1.h2（真名提示）— 軟性 hint，**不擋前進**
- **next_button**：「走下一張卡 →」

軟性邀請文案（locked 狀態）：

```
走下一張卡前，我們想多聽你說兩件事：
- 這句話是誰說的？（一個你叫得出名字的人）
- 大概什麼時候、什麼場景下說的？

不用很完美，先把你記得的寫下來就好。
```

---

## [AI INTEGRATION]

**無**。Card 1 永久禁用 AI 輔助（與 iron law 一致）。

---

## [DATA & API]

- **paincard_fields_write**: `complaint.{verbatim, source_name, source_relation, datetime, scene}`
- **autosave**: 5s debounce / blur
- **schema_validation**: Zod 對 `complaint` 子 schema 驗證

---

## [OCTALYSIS HOOKS]

- **Primary**: #1 Epic Meaning — 「這句話只屬於你，AI 不會看」傳達主權感
- **Secondary**: #5 Social Influence — 「一個有名字的人」連結真實關係
- **反模式**：禁止顯示「分數」「等級」「猜測這是不是真痛點」

---

## [ACCEPTANCE CRITERIA]

- [ ] 5 個欄位完整 + autosave 運作
- [ ] L1 全綠前 CTA 灰色
- [ ] L2 hint 觸發時顯示，**仍可前進**
- [ ] 無 AI 介入點
- [ ] 全頁面通過 `voice_and_tone.md` §3.1 黑名單檢查
- [ ] 嗓音核對：instruction 段落讀起來像陪伴朋友，不像填表
