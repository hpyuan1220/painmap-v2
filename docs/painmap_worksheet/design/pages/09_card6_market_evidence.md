# Page Spec — Card 6 · 市場聲音的三段證據

> Canonical：`user_journey.md` §Card 6、`data_model.md` `ai_evidence`、`exit_gates_matrix.md` Card 6、`ai_prompt_library.md` §8

---

## [PAGE META]

```yaml
page_name: Card 6 · 市場聲音的三段證據
route_path: /learn/worksheet/09
page_type: form_card_ai
step_in_flow: 9
paincard_field_path: ai_evidence
ai_prompt_section: ai_prompt_library.md#8
exit_gate_section: exit_gates_matrix.md#card-6
journey_section: user_journey.md#card-6
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card 6 · 市場聲音的三段證據

找 3 段你在外面聽到的聲音 — 可以是論壇、新聞、訪談、學術文章。
每段都寫一句「為什麼這段跟我手上的故事有關」。

別替我打分數、別替我下「common pain / niche pain」這類判斷 —
那個讓你自己看完 3 段之後寫。
```

---

## [USER INPUT BLOCK]

### 段 1：工具選擇

`ai_evidence.ai_tool` — RadioGroup：ChatGPT Deep Research / Claude / Perplexity / Gemini / 站內

### 段 2：證據列表

每筆 evidence：

| 欄位 | 元件 | required | hint |
| :-- | :-- | :-: | :-- |
| `source` | Input (URL + 描述) | ✅ | 「網址 + 一句話來源描述」 |
| `quote` | Textarea (3 行) | ✅ | 「實際引用片段（不能只貼連結）」 |
| `relevance` | Textarea (2 行) | ✅ | 「為什麼這段跟我有關（一句話）」 |

### 段 3：使用者的觀察

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `landscape` | RadioGroup (common_pain / niche_pain / unclear) | ✅ |
| `landscape_note` | Textarea (3 行) | ✅ |

---

## [AI ASSIST BLOCK]

- 按鈕「請 AI 陪我去找市場聲音的三段證據」
- prompt：`ai_prompt_library.md` §8.2
- 變數：`focused_pain.summary`
- response 處理：parser 把 AI 回應解析為 evidences[]（最多 3 筆）
- solution-mode 偵測：照常

---

## [CONTINUE-WHEN-READY]

- **L1**：C6.1（evidences ≥ 3）+ C6.2（每筆三欄非空）+ C6.3（landscape_note 非空）
- **L2**：C6.h1（quote 不可只是連結）

軟性邀請（locked）：

```
走下一張卡前：
- 找 3 段公開聲音，每段都附引用片段 + 為什麼跟你有關
- 寫一句你的整體觀察（common / niche / unclear，自己選）
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`
- **paincard_fields_write**: `ai_evidence.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #5 Social Influence — 看到外面有人說一樣的事，社群感（但不顯示分數 / 人數）
- **Secondary**: #3 Empowerment — landscape 判斷由你寫

---

## [ACCEPTANCE CRITERIA]

- [ ] AI 工具選擇正確帶入 prompt
- [ ] parser 把 AI 回應解析為 ≤ 3 筆 evidence
- [ ] quote 純連結時觸發 L2 hint
- [ ] landscape 不顯示「正確答案」
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
