# Page Spec — Card B · 心情地圖 (NEW)

> Canonical：`user_journey.md` §Card B、`data_model.md` `empathy_map`、`exit_gates_matrix.md` Card B、`ai_prompt_library.md` §5（選擇性 AI）

---

## [PAGE META]

```yaml
page_name: Card B · 心情地圖
route_path: /learn/worksheet/06
page_type: form_card_ai
step_in_flow: 6
paincard_field_path: empathy_map
ai_prompt_section: ai_prompt_library.md#5
exit_gate_section: exit_gates_matrix.md#card-b
journey_section: user_journey.md#card-b
```

---

## [INSTRUCTION COPY (v2 嗓音)]

```
Card B · 心情地圖

我們站到那個人的位置上看一看。
六個欄位都先簡單一句話就好，不用寫成段落。

他這個時候心裡在想什麼？身體上、表情上會出現什麼？
嘴上會說什麼、跟心裡想的一樣嗎？
```

---

## [USER INPUT BLOCK — 六宮格 empathy map]

UI layout：2x3 grid（desktop）/ 1x6 stack（mobile）

| 欄位 | label | placeholder |
| :-- | :-- | :-- |
| `empathy_map.think` | 心裡想什麼 | 「他在這個場景心裡浮現的話」 |
| `empathy_map.feel` | 感受 | 「情緒、身體感受」 |
| `empathy_map.say` | 嘴上會說什麼 | 「他真的會說出口的話」 |
| `empathy_map.do` | 行為上會做什麼 | 「具體的動作」 |
| `empathy_map.pain` | 卡在哪 | 「他覺得最不舒服的是什麼」 |
| `empathy_map.gain` | 希望得到 | 「他想換回什麼樣的感覺」 |

每格一行 textarea，1-2 句即可。

---

## [AI ASSIST BLOCK (選擇性)]

- **觸發**：六格皆寫完後出現
- **按鈕**：「想請 AI 陪我把心情地圖看一遍」
- **prompt**：`ai_prompt_library.md` §5.2
- **回應功能**：AI 點出 「say vs think」落差最大的格子；純參考，不修改

---

## [CONTINUE-WHEN-READY]

- **L1**：CB.1（六欄皆非空）
- **next_button**：「走下一張卡 →」

軟性邀請（locked）：

```
走下一張卡前，六格都先寫一句話就好。
不用寫成完整段落 — 我們是要進入他的心情，不是寫人物誌。
```

---

## [DATA & API]

- **paincard_fields_read**: `focused_pain`, `people_with_guesses.list[0]` (若已存在)
- **paincard_fields_write**: `empathy_map.*`

---

## [OCTALYSIS HOOKS]

- **Primary**: #1 Epic Meaning — 「站到那個人位置上」傳達質性研究的同理價值
- **Secondary**: #3 Empowerment — 你想像、你寫，AI 只在你寫完後才出現

---

## [ACCEPTANCE CRITERIA]

- [ ] 六宮格 RWD 正確（Desktop 2x3 / Mobile 1x6）
- [ ] AI 按鈕僅在六欄皆滿時啟用
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] 嗓音核對：不寫「使用者畫像」「persona」（工程詞），改寫「他這個人」「那個人」
