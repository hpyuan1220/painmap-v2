# Continue-When-Ready Matrix — 13 張卡片「走下一張卡前我們想多聽你說的事」

> **真相源**：
> - `data_model.md` §驗證規則摘要 — 欄位最低要求
> - `voice_and_tone.md` — 所有顯示給使用者的中文字串
> - `user_journey.md` — 各卡片旅程描述
>
> **本檔角色**：把每張卡的「走下一張卡前」條件翻譯成可程式化規則 + 對應給使用者看的軟性邀請文案。
>
> **設計鐵律**：
> - 卡片永遠不**擋住**前進，只**邀請**停留。
> - 不出現「過關 / 退回 / 失敗 / 驗證 / Exit Gate」（與 `voice_and_tone.md` §3.1 一致）。
> - 唯一的硬性規則是「具體性護欄」（Card 1 反分析語、Card 7 真名規則），且只以中性 hint 呈現，不擋前進。
> - 所有欄位最低要求滿足前，「走下一張卡」按鈕保持灰色（CTA disabled），但仍可隨時回到前面任何一張卡。

---

## 0. 設計原則

### 0.1 卡片狀態演進

```
draft        (Card 1 開始)
  ↓
in_progress  (Card A..Card G)
  ↓ Result 卡片寫完
completed    (帶得走的 Pain ID 卡片產出)
  ↓ 中途離開
paused       (LocalStorage 保留，下次回來繼續)
```

### 0.2 兩層提示

| 層級 | 範圍 | 行為 |
| :-- | :-- | :-- |
| L1：欄位最低要求 | 必填 / 長度 / 數量 | 「走下一張卡」按鈕灰色，無法點 |
| L2：具體性護欄 | 規則式中性提示 | 顯示軟性 hint，**仍可前進** |

### 0.3 邀請式停留 vs 工程式擋人

```
鐵律：卡片永遠不擋你前進。

只有兩種情況：
1. 最低要求未滿足 → 「走下一張卡」按鈕灰色，但底下用一段話告訴你「我們再陪你多聽兩件事」
2. 具體性護欄觸發 → 顯示中性 hint，但按鈕仍可點（使用者自決）
```

所有 hint 都是 soft（中性反思），只有 L1 最低要求決定 CTA 是否可點。

---

## 1. 13 張卡片「走下一張卡前」矩陣

下表每張卡都列：
- 對應 PainCard 欄位
- L1 最低要求（CTA disable rules）
- L2 具體性護欄（中性 hint，不擋前進）
- 給使用者看的軟性邀請文案範例

---

### Card 1 · 那句脫口而出的話

| 欄位 | `complaint.{verbatim, source_name, source_relation, datetime, scene}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C1.1 | `complaint.verbatim` 非空且長度 ≥ 10 字 | 灰色直到寫滿 |
| C1.2 | `complaint.source_name` 非空 | 灰色直到寫滿 |
| C1.3 | `complaint.source_relation` 非空 | 灰色直到寫滿 |
| C1.4 | `complaint.datetime` 非空 | 灰色直到寫滿 |
| C1.5 | `complaint.scene` 非空 | 灰色直到寫滿 |

**L2 具體性護欄（中性 hint）**

| ID | 規則 | 軟性 hint |
| :-- | :-- | :-- |
| C1.h1 | `complaint.verbatim` 不可包含「我覺得」「應該需要」「也許」「可能」「大概」 | 「這幾個字讀起來像是你替他想的，要不要試著只留下他自己說過的話？」 |
| C1.h2 | `complaint.source_name` 不可為「同學 A」「老師 B」「某人」「朋友」這類代稱 | 「想邀請你補上一個你叫得出名字的人，這樣等一下這趟路會更具體一點。」 |

**走下一張卡前的軟性邀請**

> 走下一張卡前，我們想多聽你說兩件事：
> - 這句話是誰說的？（一個你叫得出名字的人）
> - 大概什麼時候、什麼場景下說的？
>
> 不用很完美，先把你記得的寫下來就好。

---

### Card A · 痛點現場日記

| 欄位 | `pain_diary.entries[]` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| CA.1 | `pain_diary.entries.length ≥ 1`（建議 3） | 灰色直到至少 1 筆 |
| CA.2 | 每筆 entry 的 `timestamp` + `location` + `note` 非空 | 灰色直到當筆寫滿 |

**軟性邀請**

> 接下來幾天，當這個卡住的感覺又冒出來時，隨手寫一兩句進來就好。
>
> 我們建議 3 筆，但 1 筆也可以走下一張。
> 你之後隨時可以回來繼續加。

---

### Card 1-A · AI 替你打開三條路

| 欄位 | `ai_narrowing.directions[]`, `ai_narrowing.picked_direction_id` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C1A.1 | `ai_narrowing.directions.length === 3` | 灰色直到貼回 3 條方向 |
| C1A.2 | `ai_narrowing.picked_direction_id !== null` | 灰色直到選一條 |

**軟性邀請**

> 把 AI 給你的三條方向貼回來，看一看哪一條讓你最想再多聽幾段聲音。
>
> 其他兩條不會消失，這次先走一條而已。

---

### Card 1-B · 走進其中一條，慢慢往下問

| 欄位 | `ai_narrowing.drill_rounds[]` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C1B.1 | `drill_rounds.length ≥ 2`（建議 3） | 灰色直到至少 2 輪 |
| C1B.2 | 每輪 `user_question` + `ai_response` + `user_reflection` 三欄非空 | 灰色直到該輪寫滿 |

**軟性邀請**

> 一輪一輪慢慢來。每一輪結束，記得寫一句「我聽到了什麼」就好，不用整理得完美。
>
> 走完 2 輪就可以往下，但 3 輪會讓下一張卡更清楚。

---

### Card 3 · 聚焦痛點摘要

| 欄位 | `focused_pain.{summary, in_their_own_words, why_this_one}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C3.1 | `summary.length ≥ 60` | 灰色直到寫滿 |
| C3.2 | `in_their_own_words` 非空 | 灰色直到寫滿 |
| C3.3 | `why_this_one` 非空 | 灰色直到寫滿 |

**軟性邀請**

> 把我們剛剛走過的路寫成一段約 60 字的摘要。
> 不是要你下結論，是把這趟路上聽到的東西，先用自己的話收一次。

---

### Card B · 心情地圖

| 欄位 | `empathy_map.{think, feel, say, do, pain, gain}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| CB.1 | 六個欄位皆非空 | 灰色直到全寫滿 |

**軟性邀請**

> 我們站到那個人的位置上看一看。
> 六個欄位都先簡單一句話就好，不用寫成段落。

---

### Card 4 · 把卡點輕輕說清楚 + AI 解法回看

| 欄位 | `stuck_formula_with_solutions.{user_draft, ai_solutions[], user_solution_verdicts[]}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C4.1 | `user_draft` 非空 | 灰色直到寫滿 |
| C4.2 | `user_solution_verdicts.length ≥ 3` | 灰色直到至少 3 個解法被回看 |
| C4.3 | 每個 verdict 的 `reason` 非空 | 灰色直到當筆寫滿 |

**L2 具體性護欄**

| ID | 規則 | 軟性 hint |
| :-- | :-- | :-- |
| C4.h1 | `user_solution_verdicts.reason` 不可只是「沒用」「不好」「不行」這類兩字評論 | 「這個解法為什麼不夠？想多聽你說一兩句具體的場景。」 |

**軟性邀請**

> AI 給的這幾個解法，我們不急著評論它們好或不好。
> 只是請你誠實寫一寫：如果用這個，你心裡那個卡住的感覺，會不會就消失？

---

### Card 5 · 取捨對話

| 欄位 | `contradiction.pairs[]` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C5.1 | `pairs.length ≥ 1`（建議 3） | 灰色直到至少 1 組 |
| C5.2 | 每組的 `side_a` + `side_b` + `reason` 非空，`picked` 已選 | 灰色直到當組寫滿 |

**軟性邀請**

> 寫一組就可以走下一張，但 3 組會讓你更看清楚自己的優先序。

---

### Card 6 · 市場聲音的三段證據

| 欄位 | `ai_evidence.{evidences[], landscape, landscape_note}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C6.1 | `evidences.length ≥ 3` | 灰色直到至少 3 段 |
| C6.2 | 每段 evidence 的 `source` + `quote` + `relevance` 非空 | 灰色直到當段寫滿 |
| C6.3 | `landscape_note` 非空 | 灰色直到寫滿 |

**L2 具體性護欄**

| ID | 規則 | 軟性 hint |
| :-- | :-- | :-- |
| C6.h1 | `quote` 不可為單純連結（須含實際文字片段） | 「想邀請你把這段聲音裡讓你有感的句子貼回來，連結之後不一定還在。」 |

**軟性邀請**

> 找 3 段你在外面聽到的聲音，可以是論壇、新聞、訪談、學術文章。
> 每段都寫一句「為什麼這段跟我手上的故事有關」。

---

### Card 7 · 三個有名字的人 + 你心裡的猜想

| 欄位 | `people_with_guesses.{background, list[]}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C7.1 | `list.length === 3` | 灰色直到 3 個人 |
| C7.2 | 每人 `name` + `contact` + `relation` + `why_pick_them` 非空 | 灰色直到當人寫滿 |
| C7.3 | 每人 `guessed_answers.length ≥ 3`（建議 5） | 灰色直到至少 3 個猜想 |

**L2 具體性護欄**

| ID | 規則 | 軟性 hint |
| :-- | :-- | :-- |
| C7.h1 | `name` 不可為「同事 A」「家長 B」「某老師」這類代稱 | 「想邀請你寫上一個你叫得出名字的人，這樣下一張卡的訪談才聯絡得到。」 |
| C7.h2 | `contact` 不可空（須有 LINE / 電話 / Email / IG 任一） | 「沒有聯絡方式，等一下走到真人對話會卡住，我們先補上一個。」 |

**軟性邀請**

> 三個人都要有名字 + 聯絡得到。
> 每人寫 3-5 個你預先猜他會說的答案 — 不是要你猜對，是要你記得自己的預期，等一下訪談時才能辨認「驚訝」。

---

### Card D · 自我假設清單

| 欄位 | `assumptions.{items[], biases_to_watch}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| CD.1 | `items.length ≥ 2` | 灰色直到至少 2 個 |
| CD.2 | 每筆 `assumption` + `evidence_so_far` + `what_would_change_my_mind` 非空 | 灰色直到當筆寫滿 |
| CD.3 | `biases_to_watch` 非空 | 灰色直到寫滿 |

**軟性邀請**

> 走進對話前，把自己心裡的猜想先攤開來看一看。
> 不是要你放棄它們，是要你記得：等一下對方說的話如果跟你不一樣，不要急著解釋掉它。

---

### Card 8 · 真人對話

| 欄位 | `interview.sessions[]` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| C8.1 | `sessions.length ≥ 1`（建議 = `people_with_guesses.list.length`） | 灰色直到至少 1 場 |
| C8.2 | 每場的 `person_name` + `datetime` + `mode` + `key_quotes[]` 非空 | 灰色直到當場寫滿 |

**軟性邀請**

> 一場對話也可以走下一張，但 3 場會讓你更看清楚哪些是個別的、哪些是共通的。
>
> 不用寫成逐字稿，幾句印象深刻的原話就好。

---

### Card G · 訪後沉澱

| 欄位 | `post_interview_synthesis.{ai_clustered_themes[], user_summary, member_check_questions[]}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| CG.1 | `user_summary.length ≥ 80` | 灰色直到寫滿 |
| CG.2 | `member_check_questions.length ≥ 1` | 灰色直到至少 1 個 |

**軟性邀請**

> AI 已經把訪談裡的聲音分成幾個主題。
> 你逐一看一看：哪些主題保留、哪些重新命名、哪些丟掉？
>
> 最後寫一段約 80 字的沉澱 — 用你自己的話，不是 AI 的話。

---

### Result · Pain ID 卡片

| 欄位 | `result.{story_one_liner, next_step_note, next_step_hint}` |
| :-- | :-- |

**L1 最低要求**

| ID | 規則 | 觸發時 CTA |
| :-- | :-- | :-- |
| CR.1 | `story_one_liner` 非空 | 「匯出」按鈕灰色直到寫滿 |
| CR.2 | `next_step_note` 非空 | 「匯出」按鈕灰色直到寫滿 |
| CR.3 | `next_step_hint` 已選 | 「匯出」按鈕灰色直到選一個 |

**軟性邀請**

> 走到這裡了。
>
> 用一句話告訴未來的自己：這趟路上你聽到了什麼？
> 再寫一段你的下一步 — 可以是「找另一個人聊」「先放一陣子」「準備去做 72 小時 sprint」都可以。

---

## 2. 中性 hint 文案規則

所有 L2 hint 必須符合 `voice_and_tone.md` §3 + §6：

- 以「想邀請你」「我們再陪你看一下」「要不要試著」開頭
- 不出現「請」「必填」「規則」「禁止」「驗證」「失敗」
- 結尾邀請使用者**自己決定**是否要修改，不替使用者下結論
- 任何時候都允許使用者按「我先這樣，往下走」

---

## 3. 工程實作對應

| 行為 | 實作位置 |
| :-- | :-- |
| L1 CTA 灰色邏輯 | `src/lib/card{X}Validators.ts` 各檔 |
| L2 hint 觸發邏輯 | 同上，回傳 `{ kind: 'hint', message: '...' }` |
| 中文 hint 文案 | 集中在 `src/components/worksheet/card{XX}/hints.ts`（待 Phase 4 建立）|
| CTA 按鈕狀態 | `src/components/worksheet/CardProgressStepper.tsx` 連動 |

---

## 4. 與舊版 (`exit_gates_matrix.md` v1) 的對應

| v1 用語 | v2 用語 |
| :-- | :-- |
| Exit Gate / 閘門 | 走下一張卡前 |
| 過關 / 通過 | 寫到一個段落 |
| Failure routing | 軟性停留 |
| 退回 / 失敗 | 我們再陪你停一會兒 |
| HARD / SOFT | （v2 全部 SOFT；HARD 概念由「最低要求」取代）|

v1 的 9 卡 × 反思矩陣已全數對應到 v2 的 13 卡 + Result 矩陣，新增 Card A / B / D / G 各自的條件。
