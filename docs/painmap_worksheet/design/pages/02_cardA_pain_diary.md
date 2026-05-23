# Page Spec — Card A · 痛點現場日記 (NEW)

> Canonical：`user_journey.md` §Card A、`data_model.md` `pain_diary`、`exit_gates_matrix.md` Card A、`ai_prompt_library.md` §1（選擇性 AI）

---

## [PAGE META]

```yaml
page_name: Card A · 痛點現場日記
route_path: /learn/worksheet/02
page_type: form_card_ai                   # AI 選擇性介入
step_in_flow: 2
paincard_field_path: pain_diary
ai_prompt_section: ai_prompt_library.md#1
exit_gate_section: exit_gates_matrix.md#card-a
journey_section: user_journey.md#card-a
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card A · 痛點現場日記

接下來幾天，當這個卡住的感覺又冒出來時，
隨手寫一兩句進來就好。

不用整理、不用美化，誠實的當下最有用。
我們建議 3 筆，但 1 筆也可以走下一張。
你之後隨時可以回來繼續加。
```

---

## [USER INPUT BLOCK — 日記 entries 列表]

每筆 entry：

| 欄位 | 元件 | required | placeholder |
| :-- | :-- | :-: | :-- |
| `timestamp` | DateTimePicker | ✅ | 「現在 / 剛才 / 早上 8 點」 |
| `location` | Input | ✅ | 「家、辦公室、通勤路上⋯」 |
| `mood` | Input (短) | ✅ | 「一兩個詞就好」 |
| `trigger` | Textarea (2 行) | optional | 「是什麼觸發了這一刻？」 |
| `note` | Textarea (3 行) | ✅ | 「自由寫，原話或描述都行」 |
| `attachments[]` | (MVP 略，M2+ 圖片/語音) | optional | – |

UI 行為：
- 「＋ 加一筆現場日記」按鈕在 entries 列表底部
- 每筆 entry 可摺疊/展開
- 列表為時間倒序

---

## [AI ASSIST BLOCK (選擇性)]

- **觸發**：當 `entries.length ≥ 3` 後出現
- **按鈕文字**：「想請 AI 陪我看一看這幾段日記」
- **prompt**：`ai_prompt_library.md` §1.2 原文
- **變數插值**：全部 `pain_diary.entries[]` 串接
- **response 處理**：純參考，**不**自動寫入任何欄位（這張卡的內容由使用者主導）

---

## [CONTINUE-WHEN-READY]

- **L1**：CA.1（≥ 1 筆）+ CA.2（每筆 timestamp + location + note 非空）
- **next_button**：「走下一張卡 →」

軟性邀請（locked）：

```
我們需要至少 1 筆現場日記才能繼續。
如果你還在等下一次卡住的感覺出現，沒關係 — 先把這頁存著，下次再回來。
```

---

## [DATA & API]

- **paincard_fields_write**: `pain_diary.entries[]`
- **autosave**: 每筆 entry 5s debounce / blur

---

## [OCTALYSIS HOOKS]

- **Primary**: #3 Empowerment — 自由節奏記錄，不被工具催促
- **Secondary**: #1 Epic Meaning — 「誠實的當下最有用」傳達質性研究價值

---

## [ACCEPTANCE CRITERIA]

- [ ] entries 列表 CRUD 完整
- [ ] AI 按鈕只在 ≥ 3 筆時出現
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] 「想請 AI 陪我」按鈕語感正確（不可寫「AI 幫你 / AI 分析」）
