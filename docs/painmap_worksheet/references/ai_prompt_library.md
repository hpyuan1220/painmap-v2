# AI Prompt Library v2 — 9 段內建邀請式 prompt

> **真相源**：本檔 + `voice_and_tone.md` §5（邀請式 prompt 骨架）。
> **本檔角色**：彙整 v2 中所有「複製這段話給 AI」的原文。每段 prompt 都採邀請句、附 anti-solution-mode 防護、附範例 + 站內 LLM payload。
> **嚴禁**：自行改寫 prompt 內容、自行新增不在本檔的 prompt、把 prompt 寫成命令句（「請給我 ___」「不要做 ___」要改成「幫我 ___ 就好」「先別急著 ___」）。
>
> **核心鐵律**（與 `voice_and_tone.md` §5 一致）：
> - 任何 prompt 都不得要求 AI 給「分數」「等級」「真假判斷」「分類學編號 / 標籤」
> - AI 是陪伴的研究同伴，不是裁判
> - Card 1 / Card D / Card 8 永久禁用 AI 輔助
> - 所有 prompt 文案中性、邀請式，不出現「過關 / 退回 / 失敗 / 驗證」

---

## 0. 通用設計原則

每段 prompt 必須遵守 `voice_and_tone.md` §5 的五段骨架：

```
{邀請語氣的開頭，告訴 AI 它的角色是「陪伴的研究同伴」}

{我這邊的情境 / 手上的素材，附上變數插值}

{我想請你幫我做的事 — 用「幫我」「陪我」「邀請你」開頭}

{anti-solution-mode 防護字句 — 「先別急著替我想解法」之類}

{如果資訊不夠，請你幫我列出我下次去問的問題}
```

### 變數插值規範

- 採 `[貼上卡片 N 的 ___]` 格式
- 前端帶入時必須是純文字（不可帶入 HTML / Markdown 標題）
- 若使用者跳卡前面尚未填寫，會看到中性提示「先回去把 ___ 想清楚再回來」

### 兩種輸出方式

- **方式 A**：複製到外部 ChatGPT / Claude / Perplexity / Gemini（MVP 預設）
- **方式 B**：站內 LLM API call（M2 後期；OpenAI / Anthropic Edge Function 代理）

每段 prompt 末尾附方式 B 的 payload 範例。

### 卡片 × AI 介入點對照

| 卡片 | AI 介入 | Prompt 編號 |
| :-- | :-: | :-- |
| Card 1 · 那句脫口而出的話 | ❌ | – |
| Card A · 痛點現場日記 | 選擇性 | §1（review entries） |
| Card 1-A · 三條路 | ✅ | §2 |
| Card 1-B · 往下問 | ✅ | §3 |
| Card 3 · 聚焦摘要 | 選擇性 | §4 |
| Card B · 心情地圖 | 選擇性 | §5 |
| Card 4 · 卡點公式 + 解法回看 | ✅ | §6 |
| Card 5 · 取捨對話 | ✅ | §7 |
| Card 6 · 三段證據 | ✅ | §8 |
| Card 7 · 三個人 + 猜想 | 選擇性 | §9 |
| Card D · 自我假設 | ❌ | – |
| Card 8 · 真人對話 | ❌ | – |
| Card G · 訪後沉澱 | ✅ | §10 |

---

## 1. Card A ｜「痛點現場日記回看」prompt（選擇性）

### 1.1 觸發時機

- **頁面**：`/learn/worksheet/02`
- **按鈕**：「請 AI 陪我看一看這幾段日記」（在使用者寫了 ≥ 3 筆日記後出現）
- **前置條件**：`pain_diary.entries.length ≥ 3`

### 1.2 Prompt 原文

```
我這邊有最近幾天記下來的幾段日記，是關於一個我還在聽的卡住感。
想請你陪我看一看，不要替我下結論，也別急著建議解法。

[貼上 Card A 的所有日記 entries，含時間、地點、心情、觸發、自由書寫]

我想請你幫我做兩件事：
1. 用 1-2 句話描述你從這幾段日記裡聽到的「共同的聲音」是什麼。
   只能用我寫的事實，不要替我發明細節。
2. 列出 3 個我下一次再記日記時，可以更注意的角度。

先別急著替我想 App、想商業模式、想解決方案。
也不用替我打分數、判斷這值不值得做。
我只是想多聽幾個聲音。
```

### 1.3 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 Card A 的所有日記 entries]` | `pain_diary.entries[].{timestamp, location, mood, trigger, note}`，每筆一段 |

### 1.4 範例輸出（不取代使用者書寫）

```
從這幾段日記裡，我聽到的共同聲音是：
你大多在週六晚上感受到這個卡住，跟「需要寫得具體又不傷感情」這件事有關。

下次再記日記時，可以多注意：
1. 「具體」跟「不傷感情」哪個是主要的卡點？
2. 平日有沒有出現過類似的感受？
3. 卡住前 30 分鐘，你在做什麼？
```

### 1.5 站內 LLM payload 範例（方式 B）

```json
{
  "model": "gpt-4o-mini",
  "system": "你是一個陪伴使用者做質性研究的同伴，不是裁判。不替使用者下結論、不建議產品、不打分數。",
  "user": "<上述 prompt 原文，含變數已插值>"
}
```

---

## 2. Card 1-A ｜「AI 替我打開三條路」prompt（核心）

### 2.1 觸發時機

- **頁面**：`/learn/worksheet/03`
- **按鈕**：「請 AI 替我打開三條路」
- **前置條件**：Card 1 已寫完（建議連帶 Card A 也已有日記）

### 2.2 Prompt 原文

```
我這邊有一句最近聽到（或自己脫口而出）的抱怨，想請你陪我把它「打開」一下。

抱怨原話：
[貼上 Card 1 的 complaint.verbatim]

說的人：
[貼上 Card 1 的 complaint.source_name]（[貼上 complaint.source_relation]）

時間與場景：
[貼上 complaint.datetime]，[貼上 complaint.scene]

另外，我這幾天記下的幾段現場日記：
[貼上 Card A 的 pain_diary entries，若有；若無則寫「（暫時還沒有日記）」]

想請你幫我做一件事：
從這段抱怨 + 日記出發，幫我打開 3 條值得繼續往下聽的方向。
每一條都告訴我：
- 方向的名字（一句話）
- 為什麼這條值得聽（一兩句話）
- 這條方向在意的是什麼（一句話）

先別急著替我選一條、別替我推薦工具、別替我想 App。
也不用替我打分數、判斷這 3 條哪條是「真痛點」。
我只是想看到 3 條不同的可能性，等一下我自己選一條走。

如果這段抱怨太短，沒辦法打開 3 條，幫我列出 3 個我下次聽到類似抱怨時，可以多問的問題就好。
```

### 2.3 變數插值

| Placeholder | 對應欄位 | 必填 |
| :-- | :-- | :-- |
| `[貼上 Card 1 的 complaint.verbatim]` | `complaint.verbatim` | ✅ |
| `[貼上 Card 1 的 complaint.source_name]` | `complaint.source_name` | ✅ |
| `[貼上 complaint.source_relation]` | `complaint.source_relation` | ✅ |
| `[貼上 complaint.datetime]` | `complaint.datetime` | ✅ |
| `[貼上 complaint.scene]` | `complaint.scene` | ✅ |
| `[貼上 Card A 的 pain_diary entries]` | `pain_diary.entries[]` 或「（暫時還沒有日記）」 | 選填 |

### 2.4 anti-solution-mode 防護字句

> 「先別急著替我選一條、別替我推薦工具、別替我想 App。」
> 「也不用替我打分數、判斷這 3 條哪條是『真痛點』。」

### 2.5 範例輸入 → 範例輸出

**輸入**（林老師案例）：
- 抱怨：「我每週六晚上要寫 30 個學生的家長 LINE，平常週間都要記筆記但常漏，到週末翻 7 次小考成績單、翻群組對話、翻學生作業，常寫到半夜兩點。」
- 說的人：林老師（自己）
- 時間：每週六晚上
- 場景：補習班晚自習結束、回家準備家長回報

**輸出**：

```
我從這段抱怨裡看到 3 條可能的方向，等你選：

方向 1：「整週的零散資料變成週末壓力源」
為什麼值得聽：你提到資料「散在週間 7 次」，但你都選擇在週末一次處理。
這條方向在意的是：是不是有「來不及消化的素材」累積這件事在發生？

方向 2：「具體 vs 不傷感情的兩難」
為什麼值得聽：你提到要「寫得具體」，但又有家長感受要顧。
這條方向在意的是：你是不是每週六其實是在做「翻譯」這件事 — 把行為轉成不傷家長的語言？

方向 3：「30 個學生裡的少數特例耗掉多數時間」
為什麼值得聽：30 個學生不會每個都一樣難寫，但你寫成「30 個」的總量感。
這條方向在意的是：是不是少數幾個學生佔了多數的撰寫時間？

你最想再多聽哪一條？其他兩條我不會丟掉，先放著等你之後可能回來看。
```

### 2.6 失敗 fallback

如果 AI 給出 「我建議你做一個 App / SaaS / 工具」這類解法，使用者頁面顯示：

> 這個 AI 好像跑得有點快，已經在替我們想解法了。
> 我們先回到原本的故事，把它再多聽一聽，等故事完整一點，再回來看看它能幫上什麼。
>
> （要重新試一次嗎？）

### 2.7 站內 LLM payload

```json
{
  "model": "gpt-4o-mini",
  "system": "你是一個陪伴使用者做質性研究的同伴，不是裁判。從抱怨原話中找出 3 條可能的方向，每條附說明與在意的事。不建議產品、不打分數、不下真假判斷。",
  "user": "<prompt 原文，變數已插值>",
  "max_tokens": 600
}
```

---

## 3. Card 1-B ｜「走進一條，慢慢往下問」prompt

### 3.1 觸發時機

- **頁面**：`/learn/worksheet/04`
- **按鈕**：「請 AI 陪我把這條路再往下問」（每輪一次，總共 2-3 輪）
- **前置條件**：`ai_narrowing.picked_direction_id !== null`

### 3.2 Prompt 原文（每輪同一份，變數不同）

```
我們選了一條方向繼續往下走。

抱怨原話：
[貼上 complaint.verbatim]

我們這次選的方向是：
[貼上 picked_direction.title] — [貼上 picked_direction.description]

到目前為止，我們已經聊過：
[貼上 drill_rounds[].{user_question, ai_response, user_reflection}，依輪次列出；若是第一輪則寫「（這是第一輪）」]

這一輪，我想問的問題是：
[使用者在 UI 寫下的本輪問題]

想請你幫我做兩件事：
1. 用我已知的事實去回應這個問題，不要替我發明新的細節。
2. 結尾留下一個「下一輪可以再問」的開放式問題，不要直接給答案。

先別急著替我下結論、別替我推薦工具、別替我想 App。
我們還在往下聽，不是在做決定。
```

### 3.3 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 complaint.verbatim]` | `complaint.verbatim` |
| `[貼上 picked_direction.title]` | `ai_narrowing.directions[picked_id].title` |
| `[貼上 picked_direction.description]` | `ai_narrowing.directions[picked_id].description` |
| `[貼上 drill_rounds[]...]` | `ai_narrowing.drill_rounds[]` 已完成的輪次 |
| `[使用者本輪問題]` | UI input |

### 3.4 anti-solution-mode 防護

> 「先別急著替我下結論、別替我推薦工具、別替我想 App。」
> 「結尾留下一個『下一輪可以再問』的開放式問題，不要直接給答案。」

### 3.5 站內 LLM payload

```json
{
  "model": "gpt-4o-mini",
  "system": "你是陪伴使用者做質性研究的同伴。回應使用者的提問，但不下結論、不推薦產品、不打分數。每輪結尾留下一個開放式問題。",
  "user": "<prompt 原文>",
  "max_tokens": 500
}
```

---

## 4. Card 3 ｜「聚焦痛點摘要校對」prompt（選擇性）

### 4.1 觸發時機

- **頁面**：`/learn/worksheet/05`
- **按鈕**：「請 AI 陪我看一看這段摘要」
- **前置條件**：`focused_pain.summary.length ≥ 60`

### 4.2 Prompt 原文

```
我把剛剛走過的路寫成了一段摘要，想請你陪我看一看。

抱怨原話：
[貼上 complaint.verbatim]

我們選的方向 + 走完的對話：
[貼上 picked_direction + drill_rounds 摘要]

我寫的聚焦摘要：
[貼上 focused_pain.summary]

我用那個人會講的話再說一次：
[貼上 focused_pain.in_their_own_words]

想請你幫我做一件事：
告訴我這段摘要裡，有沒有任何句子是「我替他想的」而不是「他自己會說的」。
如果有，幫我指出來，但不要替我改寫。

也別替我打分數、別替我下「真假判斷」、別建議下一步。
我只想知道哪裡我可能多加了自己的解釋。
```

### 4.3 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 complaint.verbatim]` | `complaint.verbatim` |
| `[貼上 picked_direction + drill_rounds 摘要]` | 自動串接 |
| `[貼上 focused_pain.summary]` | `focused_pain.summary` |
| `[貼上 focused_pain.in_their_own_words]` | `focused_pain.in_their_own_words` |

---

## 5. Card B ｜「心情地圖陪伴」prompt（選擇性）

### 5.1 觸發時機

- **頁面**：`/learn/worksheet/06`
- **按鈕**：「請 AI 陪我把心情地圖看一遍」
- **前置條件**：empathy_map 六個欄位皆非空

### 5.2 Prompt 原文

```
我幫一個有名字的人寫了一張心情地圖，想請你陪我看一看，
但不要替我改寫、也別替我下結論。

那個人是：
[貼上 people_with_guesses.list[0].name]，[貼上 people_with_guesses.list[0].relation]

我寫的心情地圖：
- 心裡想：[貼上 empathy_map.think]
- 感受：[貼上 empathy_map.feel]
- 嘴上會說：[貼上 empathy_map.say]
- 行為上會做：[貼上 empathy_map.do]
- 卡在：[貼上 empathy_map.pain]
- 希望得到：[貼上 empathy_map.gain]

想請你幫我做一件事：
6 個欄位裡，哪一個「嘴上說的」跟「心裡想的」之間落差最大？
為什麼？

只用我寫的事實討論，不要替我發明新的細節。
別替我規劃下一步、別替我推薦工具。
```

### 5.3 變數插值

對應 `empathy_map` 與 `people_with_guesses.list[0]` 的對應欄位。

---

## 6. Card 4 ｜「卡點公式 + AI 解法回看」prompt

### 6.1 觸發時機

- **頁面**：`/learn/worksheet/07`
- **按鈕**（分兩段）：
  1. 「請 AI 陪我把卡點寫清楚」（第一段，整理 user_draft）
  2. 「請 AI 列出常見解法讓我回看」（第二段，產出 ai_solutions[]）
- **前置條件**：Card 3（focused_pain）已寫完

### 6.2 第一段 prompt — 整理卡點

```
我手上有一段聚焦的痛點摘要，想請你幫我把它整理成一個「卡點公式」。

聚焦摘要：
[貼上 focused_pain.summary]

我自己寫的卡點公式草稿：
[貼上 stuck_formula_with_solutions.user_draft]

想請你幫我做兩件事：
1. 把我的草稿整理成「我每次要 ___，都會卡在 ___」的形狀就好，
   只能用我原話 + 摘要裡有的事實。
2. 如果我寫的還不夠具體，列出 3 個我下次再去問清楚的問題。

別替我寫多版本、別替我加細節、別替我推薦工具。
我只想看到一個比較乾淨的句子，然後決定要不要採用。
```

### 6.3 第二段 prompt — 解法回看

```
這是我的卡點公式：
[貼上 stuck_formula_with_solutions.user_draft 或 ai_polished（看使用者選了哪個）]

想請你陪我做一件事：
列出市場上 3-5 個「常見的」解法（不是你推薦的，是常見的），
每個解法只要說：
- 解法的名字
- 一句話描述（不要寫成行銷文案）

別替我打分數、別替我推薦哪個最好、別替我設計新的解法。
我等一下會自己逐一回看，寫下「如果用這個，那個卡住的感覺會不會消失」。
```

### 6.4 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 focused_pain.summary]` | `focused_pain.summary` |
| `[貼上 stuck_formula_with_solutions.user_draft]` | `stuck_formula_with_solutions.user_draft` |

---

## 7. Card 5 ｜「取捨對話協助」prompt

### 7.1 觸發時機

- **頁面**：`/learn/worksheet/08`
- **按鈕**：「請 AI 陪我把取捨寫清楚」（選擇性，使用者卡住時才呼叫）
- **前置條件**：使用者已寫過 Card 3 + Card B

### 7.2 Prompt 原文

```
我手上有一個聚焦的痛點，我感覺裡面藏著一些「想要兩個東西、但只能選一個」的取捨，
想請你陪我把它寫清楚。

聚焦摘要：
[貼上 focused_pain.summary]

心情地圖（如果有）：
[貼上 empathy_map 六欄，若無則寫「（暫時還沒有）」]

想請你幫我做一件事：
列出 3 組「他想要 A，也想要 B，但好像只能選一個」的取捨。
每組只要寫 side_a 和 side_b，**不要替我選哪個**、不要替我寫理由。

別替我下結論、別替我推薦解法、別替我打分數。
我等一下會自己選 A 或 B、自己寫為什麼。
```

### 7.3 anti-solution-mode 防護

> 「不要替我選哪個、不要替我寫理由。」
> 「別替我下結論、別替我推薦解法、別替我打分數。」

---

## 8. Card 6 ｜「市場聲音的三段證據」prompt

### 8.1 觸發時機

- **頁面**：`/learn/worksheet/09`
- **按鈕**：「請 AI 幫我找市場聲音的三段證據」
- **工具建議**：使用支援 web search 的工具（ChatGPT Deep Research / Perplexity / Gemini）

### 8.2 Prompt 原文

```
我手上有一個聚焦的痛點，想請你陪我去聽聽看市場上是不是有人在說一樣的事。

聚焦摘要：
[貼上 focused_pain.summary]

想請你幫我做一件事：
找 3 段公開的聲音（論壇、新聞、訪談、學術文章、書摘皆可）。
每段都告訴我：
- 來源（網址 + 一句話描述）
- 引用片段（一句到兩句的實際文字）
- 你為什麼覺得這段跟我的痛有關（一句話）

如果只找得到 1-2 段，就誠實說「目前能找到 X 段」，不要替我硬湊到 3 段。
別替我打分數、別替我下「common pain / niche pain」這類判斷，
那個讓我自己看完 3 段之後寫。

別建議我做 App、別建議我推產品。
我只想聽聽看市場上其他人怎麼說。
```

### 8.3 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 focused_pain.summary]` | `focused_pain.summary` |

---

## 9. Card 7 ｜「三個人的猜想對照」prompt（選擇性）

### 9.1 觸發時機

- **頁面**：`/learn/worksheet/10`
- **按鈕**：「請 AI 陪我看一看我的猜想是不是太單一」
- **前置條件**：3 個人都已填好，每人至少 3 個 guessed_answers

### 9.2 Prompt 原文

```
我列了 3 個我打算去聊的人，每人寫了一些我預先猜他們會說的答案。
想請你陪我看一看，這些猜想是不是太單一、太接近我自己的偏見。

那個聚焦的痛點是：
[貼上 focused_pain.summary]

三個人 + 我猜的答案：
[貼上 people_with_guesses.list[]，每人 name + relation + 5 個 guessed_answers]

想請你幫我做兩件事：
1. 用 1-2 句話描述：這 3 個人的猜想加起來，看起來是不是都圍繞同一個假設？
2. 列出 3 個我可能漏掉的角度 — 也就是「如果他們其中有人這樣回答，會打破我目前的假設」的回答。

別替我說我猜得對不對、別替我打分數、別替我規劃訪談話術。
這個練習是要我自己看見自己的盲點，不是替我做訪談。
```

### 9.3 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 focused_pain.summary]` | `focused_pain.summary` |
| `[貼上 people_with_guesses.list[]...]` | `people_with_guesses.list[]` 串接 |

---

## 10. Card G ｜「訪後沉澱主題聚類」prompt

### 10.1 觸發時機

- **頁面**：`/learn/worksheet/13`
- **按鈕**：「請 AI 陪我把訪談聲音整理成幾個主題」
- **前置條件**：`interview.sessions.length ≥ 1`

### 10.2 Prompt 原文

```
我剛跟幾個人聊完，這邊有對話記錄。
想請你陪我把這些聲音整理成幾個主題 — 但**只能用我寫下來的話**，
不要替我發明新的細節，也不要替我下結論。

我聚焦的痛點摘要：
[貼上 focused_pain.summary]

我訪談前的自我假設：
[貼上 assumptions.items[]，至少 2 筆]

訪談對話記錄（含原話、驚訝、猜對、新線索）：
[貼上 interview.sessions[]，依場次列出]

想請你幫我做兩件事：
1. 把訪談裡的聲音聚類成 3-5 個主題。每個主題附：
   - 主題名（一個短語）
   - 連結到原話的引用（2-3 段）
2. 列出 3 個我可能想回頭跟受訪者再 confirm 的問題（member check）。

別替我打分數、別替我下「這是真痛點」「這是假痛點」、別替我規劃下一步。
我自己會看完你整理的主題，決定要保留、重命名還是丟掉，
然後自己寫一段沉澱。
```

### 10.3 變數插值

| Placeholder | 對應欄位 |
| :-- | :-- |
| `[貼上 focused_pain.summary]` | `focused_pain.summary` |
| `[貼上 assumptions.items[]]` | `assumptions.items[]` |
| `[貼上 interview.sessions[]]` | `interview.sessions[]` |

### 10.4 anti-solution-mode 防護

> 「只能用我寫下來的話，不要替我發明新的細節，也不要替我下結論。」
> 「別替我打分數、別替我下『這是真痛點』『這是假痛點』、別替我規劃下一步。」

### 10.5 站內 LLM payload

```json
{
  "model": "gpt-4o-mini",
  "system": "你是陪伴使用者做質性研究的同伴。整理訪談記錄成主題，但不下結論、不打分數、不推薦下一步。引用必須來自使用者提供的對話記錄。",
  "user": "<prompt 原文>",
  "max_tokens": 1200
}
```

---

## 11. Anti-solution-mode 防護總覽

每段 prompt 都必須包含至少一句以下防護字句（任選或組合）：

- 「先別急著替我想解法，先陪我把現在的故事聽清楚就好。」
- 「不用幫我推薦工具，也不用替我規劃產品，先回到這句話本身。」
- 「不用替我打分數，也不用判斷這是不是值得做。」
- 「別替我下『真痛點 / 假痛點』、別替我寫下一步、別替我設計訪談話術。」

若 AI 仍跑出「我建議你做 App / SaaS / 平台 / 工具」這類字眼，
工具會自動偵測並提示使用者（見 `voice_and_tone.md` §6.2）。

---

## 12. v1 → v2 對應

| v1 prompt | v2 對應 | 狀態 |
| :-- | :-- | :-- |
| 卡 3 卡關公式校對 | §6 第一段 prompt | 改寫為邀請句 |
| 卡 4 workaround 替代方案 | §6 第二段 prompt（合併到 Card 4）| 合併 |
| 卡 5 取捨對話 | §7 | 改寫為邀請句 |
| 卡 6 AI 證據蒐集 | §8 | 改寫為邀請句 |
| 卡 7 自己先猜 + 讀 AI | 拆分至 §9（猜想對照）+ Card D 的書寫（無 AI）| 拆分 |
| 卡 8 訪談規劃 | （取消）— Card D（自我假設）+ Card 8（無 AI 介入）取代 | 改用書寫 |
| – | §1 Card A 日記回看（NEW） | NEW |
| – | §2 Card 1-A 三條路（NEW） | NEW |
| – | §3 Card 1-B 往下問（NEW） | NEW |
| – | §4 Card 3 摘要校對（NEW） | NEW |
| – | §5 Card B 心情地圖（NEW） | NEW |
| – | §10 Card G 訪後沉澱（NEW） | NEW |

---

## 13. 工程實作對應

| 行為 | 實作位置 |
| :-- | :-- |
| Prompt 文字模板 | `src/lib/prompts/cardXX.prompt.ts`（待 Phase 4 建立） |
| 變數插值 | 同上，使用 template literal |
| 複製到剪貼簿 | `src/components/worksheet/AIPromptCopyBlock.tsx`（已存在，v1 已有元件） |
| 站內 LLM 代理 | `src/lib/llmJudge.server.ts`（v1 已有，需擴充） |
| AI solution mode 偵測 | `src/lib/cardX*` 各 helpers（待 Phase 4 加） |
