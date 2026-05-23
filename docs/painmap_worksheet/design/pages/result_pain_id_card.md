# Page Spec — Result · Pain ID 卡片

> Canonical：`user_journey.md` §3、`data_model.md` `result`、`exit_gates_matrix.md` Result
> 本頁取代舊 v1 的 Card 9（真假判斷）+ Card 10（PainID 匯出）兩頁。

---

## [PAGE META]

```yaml
page_name: Result · Pain ID 卡片
route_path: /learn/worksheet/result
page_type: result
step_in_flow: 'result'
paincard_field_path: result
ai_prompt_section: (無)
exit_gate_section: exit_gates_matrix.md#result
journey_section: user_journey.md#result
```

---

## [STRUCTURE: SECTIONS]

1. `result_header` — 「今天先陪你走到這裡」+ Pain ID
2. `story_one_liner_block` — 使用者寫一句話的故事
3. `pain_id_preview` — 自動組裝的 Pain ID 卡片預覽（markdown 預覽）
4. `next_step_block` — 三個下一步選項 + 自由說明
5. `handoff_to_sprint_block` — 是否帶到 first-dollar sprint（軟性詢問）
6. `export_block` — 下載 markdown / JSON / PDF

---

## [INSTRUCTION COPY (v2 嗓音)]

```
今天先陪你走到這裡。

這張 Pain ID 卡片屬於你，可以放回口袋，
也可以下次回來再多聊幾段。

如果你準備好要試試看「72 小時把一個解法做出來給一個真人」，
我們有另一份 sprint manual 可以接著走。
但如果不是今天，那就不是今天。
```

---

## [USER INPUT BLOCK]

### story_one_liner_block

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `result.story_one_liner` | Input (一行) | ✅ |

placeholder：「用一句話告訴未來的自己：這趟路上你聽到了什麼？」

### next_step_block

| 欄位 | 元件 | required |
| :-- | :-- | :-: |
| `result.next_step_hint` | RadioGroup | ✅ |
| `result.next_step_note` | Textarea (3 行) | ✅ |

三個 hint 選項顯示文案（不顯示 enum 值）：

| 內部值 | 顯示文案 |
| :-- | :-- |
| `continue_listening` | 這條故事還想再多聽幾個聲音 |
| `pause_for_now` | 先把這個放回口袋，過一陣子再回來看 |
| `ready_for_sprint` | 這條故事準備好走進真實的 72 小時了 |

### handoff_to_sprint_block

| 欄位 | 元件 |
| :-- | :-- |
| `result.handoff_to_sprint` | Toggle |

預設 `false`。**不顯示**任何「立即」「限時」「加入」的話術 — 純資訊性質。

### export_block

`result.export_format`：RadioGroup（markdown / json / pdf）

按鈕「下載這張 Pain ID 卡片」→ 觸發匯出（呼叫 `lib/cardTenExport.ts` 對應函式，但內部已重命名為 `lib/painIdExport.ts`，Phase 4 處理）

---

## [PAIN ID PREVIEW]

從 PainCard 自動組裝 markdown 範本（見 `data_model.md` §匯出格式）：

```markdown
# Pain ID · {pain_id}

## 一句話的故事
{result.story_one_liner}

## 抱怨原話
> {complaint.verbatim}
> — {complaint.source_name}, {complaint.datetime}

## 聚焦的痛點
{focused_pain.summary}

## 心情地圖
- 心裡想：{empathy_map.think}
- 感受：{empathy_map.feel}
- 嘴上說：{empathy_map.say}
- 行為：{empathy_map.do}
- 卡在：{empathy_map.pain}
- 希望：{empathy_map.gain}

## 卡點公式
{stuck_formula_with_solutions.user_draft}

## 訪過的人
{interview.sessions[].person_name} 共 N 場

## 訪後沉澱
{post_interview_synthesis.user_summary}

## 我的下一步
{result.next_step_note}
```

---

## [CONTINUE-WHEN-READY]

- **L1**：CR.1（story_one_liner 非空）+ CR.2（next_step_note 非空）+ CR.3（next_step_hint 已選）
- **next_button**：「帶這張 Pain ID 卡片走 →」（解鎖時觸發匯出）

---

## [DATA & API]

- **paincard_fields_read**: 整個 PainCard（用於 preview 組裝）
- **paincard_fields_write**: `result.*`
- **匯出**: 觸發後在 LocalStorage 寫 `result.exported_at` + `result.export_format`

---

## [OCTALYSIS HOOKS]

- **Primary**: #2 Accomplishment — 走完 13 步看到完整 Pain ID 卡片的成就感（不打分、不評等）
- **Secondary**: #1 Epic Meaning — 「這張卡片屬於你」的主權感
- **反模式**：禁止顯示「恭喜！你過關了！」「你的痛點分數是 87/100」「分享到 FB」這類 FOMO / social pressure UI

---

## [BRAND LANGUAGE RULES]

### 必須的嗓音

- 「今天先陪你走到這裡」「帶這張卡片走」「放回口袋」「下次再回來」
- handoff 詢問不誇張、不催促

### 禁止

- 「分數」「等級」「完成度 100%」「徽章」「分享」「成就」
- 「你成功了 / 你過關了 / 恭喜」
- 任何 FOMO 話術

---

## [ACCEPTANCE CRITERIA]

- [ ] preview 自動組裝從 PainCard 完整資料
- [ ] 三個 next_step hint 顯示文案符合 `data_model.md` §next_step_hint 對照表
- [ ] markdown / json / pdf 匯出皆能下載
- [ ] handoff_to_sprint toggle 不顯示 FOMO 話術
- [ ] 結尾文案符合 `voice_and_tone.md` §6.4 模板
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
