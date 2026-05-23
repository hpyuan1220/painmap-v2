# PainMap Worksheet v2 — 產品需求文件 (PRD)

> **狀態**：v2 規格定稿（13 卡片 + Result，配套 2026 質性研究最佳實務）
> **真相源**：本檔 + `data_model.md` + `references/voice_and_tone.md`
> **品牌守則**：`docs/web_design/global/painmap_brand_system.md`
> **嗓音準則**：`references/voice_and_tone.md`（任何文案衝突以該檔為準）
> **姐妹文件**：`user_journey.md`、`motivation_design.md`、`stage1_to_stage2_handoff.md`

---

## 1. 產品定位

### 1.1 一句話定位

**PainMap Worksheet v2 是一本陪你做質性研究的數位筆記本。**
把一句脫口而出的抱怨，慢慢聽成一段值得帶去訪談的故事。

不是 idea 評分器、不是商業驗證 SaaS，
是一本參照 2026 焦點訪談與深度訪談最佳實務的單人版**訪談陪伴本**。

### 1.2 在 PainMap 產品族中的位置

```
   Worksheet v2                PainMap App                first-dollar
   /learn/worksheet            /app/* (既有)              sprint manual
 ─────────────────────  →  ───────────────────────  →  ───────────────
 階段一：訪談陪伴本           階段一→二銜接              階段二：商業驗證
 產出：可帶走的痛點故事       產出：結構化痛點 entry      產出：第一筆付款
 時間：30–90 分鐘             時間：依使用情境            時間：72 小時 sprint
 工具：邀請式 AI prompt       工具：站內 AI / Atlas       工具：手作交付 + 付款
```

- Worksheet v2 是**質性研究入門陪伴本**，承擔「想做研究、但不知道從哪聽起」的使用者。
- PainMap App 進階版（Pain Collector / Decomposer / Mapper / Atlas / Dashboard）承擔結構化痛點的長期管理。
- 兩者共用同一套 brand system，但 IA 與資料模型獨立。

### 1.3 與「方法論真相源」的關係

Worksheet v2 是 `docs/product/painmap/painmap_pain_thinking_system.md` 階段一的網頁實作，
並融入 2026 年質性市場研究、焦點訪談、深度訪談的最佳實務：

- 階段一只訓練「聽得清楚」，不談錢、不做手作交付、不架收款連結。
- 階段一終點是一張可帶走的 **Pain ID 卡片**（包含故事摘要、心情地圖、自我假設、訪談計畫、訪後沉澱），不是評分。
- 階段二（first-dollar sprint）由另一份方法論文件接手，Worksheet v2 不負責。
- **零分數 UI**：v2 不打分數、不評等、不分類、不發徽章。所有判斷以**書寫**呈現。

### 1.4 v2 與舊版（9 卡片版）的關鍵差異

| 面向 | 舊版（9 卡片） | v2（13 卡片 + Result） |
| :-- | :-- | :-- |
| 定位 | 初學者教學填空簿 | 質性研究陪伴本 |
| 卡片數 | 9 + 匯出 | 13 + Result |
| 中間步驟 | 線性 9 步 | 加入 AI 雙向廣度／深度（1-A / 1-B）、聚焦摘要、心情地圖、自我假設、訪後沉澱 |
| 文字嗓音 | 工程語感（驗證 / 校對 / Exit Gate） | 陪伴語感（邀你 / 我們先一起 / 走下一張卡前） |
| AI prompt 語氣 | 命令句 + 規則清單 | 邀請句 + 同伴角色 |
| 終端產出 | 真痛點 / 假痛點 verdict | 可帶走的 Pain ID 卡片（含故事與下一步） |
| 框架理論 | Octalysis 白帽 4 驅動 | + 2026 質性研究最佳實務：開放式提問、非引導、empathy mapping、bias check、theme clustering |

---

## 2. 目標使用者 Persona

三位 persona 都是「想多聽一段卡住故事」的人，
而**不是**「想做 App、想找商機」的人。即使他們最終會去做產品，這個工具的工作只負責一件事：先聽清楚。

### Persona A — 補習班老師「林老師」

- **背景**：43 歲、新北永和小型補習班、每週六晚上要寫 30 個家長 LINE
- **進場心情**：想知道「我每週熬到半夜的事，到底卡在哪裡」
- **Worksheet 對他的承諾**：陪他從「家長很煩」一句話，慢慢走到「我下週要去問哪三位老師同行什麼問題」
- **失敗情境**：如果一開始就被要求「想商業模式」「填問卷打分數」，他會關掉

### Persona B — 想創業的工程師「小恆」

- **背景**：28 歲、4 年後端、被「先驗證痛點」貼文打到
- **進場心情**：手上有 5 個 idea，但不知道哪個值得花時間
- **Worksheet 對他的承諾**：把他從「想 idea」拉回「找有名字的人聊」，並在他開口問之前先寫下自己的假設
- **失敗情境**：如果工具給他分數，他會把高分當綠燈，跳過真人訪談

### Persona C — 內部創新負責人「Vicky」

- **背景**：35 歲、傳產二代、被指派做「數位轉型」
- **進場心情**：聽到很多員工抱怨，不知道哪些是真值得解
- **Worksheet 對她的承諾**：把員工抱怨整理成書面證據，作為內部會議的討論材料
- **失敗情境**：如果工具強迫她填社群帳號或公開分享公司內部痛點，她會放棄

### Persona 共通需求

| 需求 | 設計回應 |
| :-- | :-- |
| 想做研究，但不會用 AI prompt | 每張需要 AI 的卡片都附「複製這段話」的邀請式 prompt |
| 不想被打分 | 全站禁用分數 UI、星等、A-F 等級 |
| 怕浪費時間 | 30–90 分鐘可完成；中斷後可從 LocalStorage 復原 |
| 不想暴露隱私 | 不需註冊，所有資料本地儲存 |
| 怕做錯 | 每張卡片有開放式停留邀請，不擋前進 |
| 不想被工程語感嚇到 | 全站套用 `voice_and_tone.md` 規範 |

---

## 3. 問題陳述

### 3.1 我們為什麼做 v2

舊版 9 卡片解決了「不知道該寫什麼」的問題，
但仍留下三個明顯的缺口：

1. **AI 廣度／深度循環缺失**：使用者寫一句抱怨後，沒被引導去「先打開、再收斂」。一個抱怨可能對應 3 條不同的痛點方向，舊版直接跳到「公式」，過早收斂。
2. **同理心層斷裂**：從「3 個人」直接跳到「卡關公式」，沒有給使用者一段空間真的進入那個人的心情（empathy mapping）。
3. **訪談前後的研究衛生缺失**：使用者帶著未檢查的自我假設去訪談，訪完也沒有結構化的回顧。2026 質性研究強調「先寫假設、訪後沉澱、AI 協助主題聚類」，舊版缺這些。

### 3.2 v2 觀察到的問題

1. **Idea 焦慮病**：依然存在，使用者被「想 100 個 idea」教學淹沒。
2. **AI 諂媚陷阱**：直接問 AI「這是不是真痛點」，AI 順著回答產生虛假綠燈。
3. **跳步反模式**：從「聽到一個抱怨」直接跳到「我來做 App」，跳過所有中間結構。
4. **評分系統的惡性循環**：使用者把分數當答案，跳過真人訪談。
5. **2026 趨勢落差**：使用者已習慣 AI 是「同伴」，舊版工程語感讓人感覺被審問。

### 3.3 v2 不解決的問題

- 找錢、付款、商業模式 → 階段二
- 多人焦點訪談、線上 panel 招募、研究專案管理 → 不在範圍內
- 真人訪談錄音轉文字、自動分析 → 不在 v2 MVP

---

## 4. 產品範圍

### 4.1 13 步流程總覽

```
01 Card 1     那句脫口而出的話                  (原 Card 1)
02 Card A     痛點現場日記 (NEW)                Pain Diary — in-the-moment capture
03 Card 1-A   AI 替你打開三條路                 AI broadens to 3 directions
04 Card 1-B   走進其中一條，慢慢往下問          AI narrows iteratively
05 Card 3     聚焦痛點摘要                      Focused pain summary
06 Card B     心情地圖 (NEW)                    Empathy Map
07 Card 4     把卡點輕輕說清楚 + AI 解法回看    Stuck formula + AI solutions probe
08 Card 5     取捨對話 (TRIZ)                   Trade-off self-disclosure
09 Card 6     市場聲音的三段證據                Market evidence
10 Card 7     三個有名字的人 + 你心裡的猜想     People + 5 guessed answers
11 Card D     自我假設清單 (NEW)                Assumption Check
12 Card 8     真人對話                          Real interview card
13 Card G     訪後沉澱 (NEW)                    Post-Interview Synthesis
Result        Pain ID 卡片（含故事 + 下一步）   Result (verdict + export collapsed)
```

### 4.2 卡片角色

| Step | URL | 顯示名 | AI 介入 | 主要功能 |
| :-- | :-- | :-- | :-: | :-- |
| 01 | `/learn/worksheet/01` | Card 1 · 那句脫口而出的話 | ❌ | 原汁原味的抱怨 |
| 02 | `/learn/worksheet/02` | Card A · 痛點現場日記 | 選擇性 | 3–5 個在地時刻的捕捉 |
| 03 | `/learn/worksheet/03` | Card 1-A · 三條路 | ✅ | AI 給 3 條可走的方向 |
| 04 | `/learn/worksheet/04` | Card 1-B · 往下問 | ✅ | 選一條，連續三輪深度提問 |
| 05 | `/learn/worksheet/05` | Card 3 · 聚焦痛點摘要 | 選擇性 | 把 1-A／1-B 的結果寫成一段摘要 |
| 06 | `/learn/worksheet/06` | Card B · 心情地圖 | 選擇性 | Think / Feel / Say / Do / Pain / Gain |
| 07 | `/learn/worksheet/07` | Card 4 · 卡點公式 | ✅ | 整理「我每次要 ___ 卡在 ___」 + AI 提解法回看 |
| 08 | `/learn/worksheet/08` | Card 5 · 取捨對話 | ✅ | 三組 trade-off，A or B + 為什麼 |
| 09 | `/learn/worksheet/09` | Card 6 · 三段證據 | ✅ | AI 找 3 段佐證，common vs niche |
| 10 | `/learn/worksheet/10` | Card 7 · 三個有名字的人 + 猜想 | 選擇性 | 3 個人 + 每人 5 個你預先猜的回答 |
| 11 | `/learn/worksheet/11` | Card D · 自我假設清單 | ❌ | 訪談前的偏見盤點 |
| 12 | `/learn/worksheet/12` | Card 8 · 真人對話 | ❌ | 與真人聊完的紀錄 |
| 13 | `/learn/worksheet/13` | Card G · 訪後沉澱 | ✅ | AI 協助主題聚類，使用者保留判斷 |
| – | `/learn/worksheet/result` | Pain ID 卡片 | – | 帶得走的書面總結 |

### 4.3 範圍外（明確不做）

- 雲端帳號、跨裝置同步、社群分享、排行榜
- 任何分數、星等、徽章、A-F 等級
- 多人焦點訪談、招募 panel、payment integration
- 自動轉文字、自動產 persona 圖、自動產 pitch deck
- 自動「真假判斷」（v2 仍由使用者自己書寫，AI 不下判斷）

---

## 5. 核心鐵律（Iron Laws）

1. **單一物件原則**：13 張卡片都是同一個 `PainCard` 物件的不同欄位，不是 13 份獨立資料。
2. **資料主權**：使用者寫的痛點原文只存 LocalStorage、不做雲端帳號、不存後端；站內 LLM 僅做匿名語意判定（gpt-4o-mini，純 verdict 無原文回傳）。
3. **零分數 UI**：分數、星等、排行榜、徽章、FOMO 永久禁用；資料層完全沒有分數欄位（UI 內部 `ready_to_continue` 是布林，不是分數）。
4. **單一蘇格拉底流程**：所有反思以開放式書寫呈現，不打分數。
5. **AI 是同伴不是裁判**：所有 AI prompt 採邀請句，禁止要求 AI 給「分數 / 等級 / 真假判斷 / 分類學編號」。
6. **嗓音準則優先**：任何 UI 中文字串、AI prompt、錯誤訊息，皆以 `voice_and_tone.md` 為唯一準則。
7. **Octalysis 只取白帽**：#1 Epic Meaning / #2 Accomplishment / #3 Creativity / #5 Social；黑帽 #6/#7/#8 永久封鎖。
8. **質性研究嚴謹度**：v2 額外加入「自我假設清單」「訪後沉澱」「empathy mapping」等 2026 最佳實務元素，作為研究衛生的底線。

---

## 6. 成功指標（M1 範圍）

由於 v2 仍維持「不打分、不做雲端」的鐵律，成功不以漏斗轉換率衡量，
而是以**書寫品質與下一步行動清晰度**衡量：

| 維度 | 指標 | 量測方式 |
| :-- | :-- | :-- |
| 完成率 | 走完 13 卡片 + Result 的使用者比例 | LocalStorage state |
| Pain ID 完整度 | Result 卡片各欄位非空率 ≥ 90% | 匯出時自我檢測 |
| 自我假設書寫量 | Card D 平均字數 ≥ 80 字 | 字數統計 |
| 訪談後回填率 | Card 8 + Card G 雙雙填寫的比例 | LocalStorage state |
| 嗓音一致性 | UI 中文字串通過 `voice_and_tone.md` §3.1 黑名單檢查 | CI lint |
| 隱私零失誤 | 後端 log 不含任何 `complaint.verbatim` 內容 | 程式碼審計 + log 抽樣 |

---

## 7. 與下一階段（first-dollar sprint）的銜接

當使用者完成 Result 卡片，Worksheet v2 會輕輕地問一句：
「想帶這張 Pain ID 卡片去 first-dollar sprint 做後續嗎？」

選 yes：把 Pain ID 卡片透過 `stage1_to_stage2_handoff.md` 規格輸出給階段二工具。
選 no：把 Pain ID 卡片下載成 markdown / PDF，使用者帶走自由運用。

**v2 不做任何強推銷、不收 email、不要求註冊。**

---

## 8. 文件導讀

| 你是誰 | 該讀什麼 |
| :-- | :-- |
| PM / 設計師 | 本檔 → `user_journey.md` → `motivation_design.md` → `references/voice_and_tone.md` |
| 前端 / 全端工程師 | `data_model.md` → `api/api_spec.md` → `design/pages/` → `references/voice_and_tone.md` |
| 文案 | `references/voice_and_tone.md` → `references/ai_prompt_library.md` → 個別 `design/pages/` |
| QA / 測試 | `tests/e2e_scenarios.md` → `references/exit_gates_matrix.md` → `tests/ai_prompt_test_cases.md` |
| 研究方法論校對 | 本檔 §3 + §4 → `references/octalysis_white_hat_principles.md` + `references/anti_gamification_guardrails.md` |
