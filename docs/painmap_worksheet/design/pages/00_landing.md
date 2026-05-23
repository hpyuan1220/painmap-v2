# Page Spec — Landing 入口頁

> **canonical 來源**：`user_journey.md` §1、`voice_and_tone.md`
> 本頁為非卡片頁，不使用 `page_template.md`；採 `docs/web_design/pages/page_template.md` 原版 + v2 嗓音調整。

---

## [PAGE META]

```yaml
page_name: Landing 入口頁
route_path: /learn/worksheet
page_type: landing
step_in_flow: 0 (尚未進入 13 卡片)
paincard_field_path: (無 — 進入後才建立 PainCard)
voice_and_tone_ref: voice_and_tone.md §1, §2
journey_section: user_journey.md §1
```

---

## [STRUCTURE: SECTIONS]

1. `hero` — 一句話定位 + 主 CTA
2. `what_is_this` — 三段定位話術（不是 idea 評分器 / 不打分 / 陪你做質性研究）
3. `flow_preview` — 13 步流程的視覺化（圖示 + 標題）
4. `who_is_this_for` — 三個 persona 卡片
5. `privacy_note` — 資料主權承諾
6. `cta_block` — 「開始一段新的探索」/「歡迎回來，上次走到 Card N」

---

## [HERO COPY (v2 嗓音)]

```
一本陪你做質性研究的筆記本。

我們不打分數、不評等、不替你判斷生意能不能做。
我們只想陪你把一段卡住的故事慢慢聽清楚，
一直走到你準備好去找真人聊一聊為止。

[開始一段新的探索 →]
```

「歡迎回來」狀態（偵測到 LocalStorage 有未完成 PainCard）：

```
歡迎回來。
我們上次走到 Card {N}，要繼續嗎？

[繼續上次的探索 →]    [開一段新的，把上次先放著]
```

---

## [WHAT IS THIS — 三段定位話術]

| 標題 | 內文 |
| :-- | :-- |
| 這不是 idea 評分器 | 我們不告訴你「這個 idea 值不值得做」。我們陪你把一段話聽清楚，由你自己決定下一步。 |
| 我們不打分數 | 沒有星等、沒有徽章、沒有排行榜。判斷由你寫，工具只負責陪伴。 |
| 你的痛點只屬於你 | 所有內容存在你的瀏覽器，沒有雲端帳號、沒有後端資料庫、沒有人偷看。隨時可以匯出帶走。 |

---

## [FLOW PREVIEW — 13 步預覽]

```
Card 1 那句話 → Card A 現場日記 → Card 1-A 三條路 → Card 1-B 往下問 → Card 3 聚焦摘要 → Card B 心情地圖 → Card 4 卡點公式 → Card 5 取捨對話 → Card 6 三段證據 → Card 7 三個人 + 猜想 → Card D 自我假設 → Card 8 真人對話 → Card G 訪後沉澱 → Pain ID 卡片
```

UI 上以 stepper 圖示呈現，每張卡有一個小 icon。

---

## [DATA & API]

- **localstorage_key**: `painmap.worksheet.v2`
- **進入動作**：
  - 若 LocalStorage 有未完成 PainCard → 顯示「歡迎回來」+ 兩個 CTA
  - 若無 → 建立新 PainCard（UUID v4），current_step = 1，跳轉 `/learn/worksheet/01`

---

## [BRAND LANGUAGE RULES]

### 必須的嗓音

- 「一本筆記本」「陪你」「聽清楚」「慢慢」「找真人聊一聊」
- 「開始一段新的探索」/「歡迎回來」

### 禁止（`voice_and_tone.md` §3.1 + 全站禁令）

- 「使用者」「填寫表單」「驗證」「真痛點」「點子」「靈感」「立即」

---

## [ACCEPTANCE CRITERIA]

- [ ] 三段定位話術完整顯示
- [ ] 13 步預覽 stepper 正確
- [ ] 三個 persona 卡片可橫向滑動（mobile）
- [ ] 偵測 LocalStorage 既有 PainCard 時正確顯示「歡迎回來」
- [ ] CTA 文字符合 v2 嗓音
- [ ] 全頁面通過 `voice_and_tone.md` §3.1 黑名單檢查
- [ ] 無分數、星等、徽章、FOMO 字眼
