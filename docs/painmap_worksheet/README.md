# PainMap Worksheet v2 — 質性研究訪談陪伴本（網頁版）

> **本資料夾是什麼？**
> 一本參照 2026 焦點訪談與深度訪談最佳實務的**單人版質性研究陪伴筆記本**。
> 把一句脫口而出的抱怨，慢慢聽成一段值得帶去訪談的故事。
> 完整中文嗓音規則見 [`references/voice_and_tone.md`](references/voice_and_tone.md)。

---

## 產品定位

**PainMap Worksheet v2 = PainMap 進階版的「質性研究訪談陪伴本」**

| 階段 | 對應產品 | 對應流程 | 文件位置 |
| :-- | :-- | :-- | :-- |
| **入口** | PainMap Worksheet v2（本資料夾） | 13 卡片 + Result 痛點故事 | `docs/painmap_worksheet/` |
| **進階** | PainMap App（既有） | Collector / Decomposer / Atlas | `docs/web_design/pages/painmap/` |
| **商業驗證** | First-Dollar Sprint | 72 小時手作 + 預售 | `docs/product/first_principles_sprint_manual.md` |

---

## Iron Laws（鐵律）

1. **共用 PainMap brand system**（不重做設計系統）
2. **零分數 UI**：分數、星等、排行榜、徽章、FOMO 永久禁用；資料層完全沒有分數欄位
3. **Octalysis 只取白帽**：#1 Epic Meaning / #2 Accomplishment / #3 Creativity / #5 Social；黑帽 #6/#7/#8 永久封鎖
4. **13 張卡片是同一個 PainCard 物件**（多欄位，不是 13 份獨立資料）
5. **資料主權**：使用者寫的痛點原文只存 LocalStorage、不做雲端帳號、不存後端；站內 LLM 僅做匿名語意判定（gpt-4o-mini，純 verdict 無原文回傳）
6. **單一蘇格拉底流程**：所有反思以開放式書寫呈現，不打分數
7. **AI 是陪伴的同伴，不是裁判**：所有 AI prompt 採邀請句，禁止要求 AI 給「分數 / 等級 / 真假判斷 / 分類學編號」
8. **嗓音準則優先**：任何使用者可見的中文字串都必須符合 `references/voice_and_tone.md`
9. **2026 質性研究嚴謹度**：v2 額外要求自我假設清單、empathy mapping、訪後沉澱

---

## v1 → v2 主要差異

| 面向 | 舊 v1（9 卡片） | v2（13 卡片 + Result） |
| :-- | :-- | :-- |
| 定位 | 初學者教學填空簿 | 質性研究訪談陪伴本 |
| 卡片數 | 9 + 匯出 | 13 + Result |
| 新增卡片 | – | Card A（痛點現場日記）、Card B（心情地圖）、Card D（自我假設清單）、Card G（訪後沉澱） |
| 拆分 | – | 舊 Card 3 拆成 Card 1-A（AI 廣度）、Card 1-B（AI 深度）、Card 3（聚焦摘要） |
| 合併 | – | 舊 Card 3+4 → 新 Card 4（卡點公式 + AI 解法回看） |
| 改寫 | – | 舊 Card 2（3 個人）+ Card 7（自己猜）→ 新 Card 7（人 + 預先猜想） |
| 收尾 | Card 9 真假判斷 + Card 10 匯出 | Result 卡片（取代兩者） |
| 嗓音 | 工程語感（驗證 / Exit Gate） | 陪伴語感（邀你 / 走下一張卡前） |
| AI prompt | 命令句 + 規則 | 邀請句 + 同伴角色 |
| 額外文件 | – | `references/voice_and_tone.md` |

---

## 13 步流程

```
01 Card 1     那句脫口而出的話                  /learn/worksheet/01
02 Card A     痛點現場日記 (NEW)                /learn/worksheet/02
03 Card 1-A   AI 替你打開三條路                 /learn/worksheet/03
04 Card 1-B   走進其中一條，慢慢往下問          /learn/worksheet/04
05 Card 3     聚焦痛點摘要                      /learn/worksheet/05
06 Card B     心情地圖 (NEW)                    /learn/worksheet/06
07 Card 4     把卡點輕輕說清楚 + AI 解法回看    /learn/worksheet/07
08 Card 5     取捨對話                          /learn/worksheet/08
09 Card 6     市場聲音的三段證據                /learn/worksheet/09
10 Card 7     三個有名字的人 + 你心裡的猜想     /learn/worksheet/10
11 Card D     自我假設清單 (NEW)                /learn/worksheet/11
12 Card 8     真人對話                          /learn/worksheet/12
13 Card G     訪後沉澱 (NEW)                    /learn/worksheet/13
Result        Pain ID 卡片                      /learn/worksheet/result
```

---

## 文件結構

```
docs/painmap_worksheet/
├── README.md                           ← 你在這裡
│
├── product/                            ← A. 產品策略層
│   ├── PRD.md                         ← v2 產品需求文件
│   ├── user_journey.md                ← v2 13 卡片旅程
│   ├── data_model.md                  ← v2 Pain Card schema（單一真相源）
│   ├── motivation_design.md           ← Octalysis 動機設計
│   └── stage1_to_stage2_handoff.md    ← 與 first-dollar sprint 銜接
│
├── design/                             ← B. 設計層（待 Phase 2 全面 v2 化）
│   ├── ia_sitemap.md                  ← 資訊架構
│   ├── octalysis_card_mapping.md      ← 卡片 × 白帽驅動力對照
│   ├── pages/                         ← 各卡片頁面規格（v2 重寫中）
│   └── components/                    ← 共用元件規格
│
├── assembly/                           ← C. 組裝層（待 Phase 2 全面 v2 化）
│   ├── PIPELINE_ORCHESTRATOR.md
│   └── pages/                         ← 各頁面整合 prompts
│
├── api/                                ← D. 後端規格
│   ├── api_spec.md                    ← REST API 規格
│   └── ai_proxy_spec.md               ← AI 整合規格
│
├── references/                         ← E. 參考層
│   ├── voice_and_tone.md              ← v2 中文嗓音準則（NEW，鐵律級）
│   ├── pain_card_schema.md            ← Pain Card schema 詳版（v2 配套）
│   ├── ai_prompt_library.md           ← 內建 AI prompts（待 Phase 2 改寫成邀請句）
│   ├── exit_gates_matrix.md           ← 「走下一張卡前」反思條件
│   ├── octalysis_white_hat_principles.md
│   └── anti_gamification_guardrails.md
│
├── guides/                             ← F. 指南層
│   ├── implementation_guide.md
│   └── quality_checklist.md
│
└── tests/                              ← G. 測試層
    ├── e2e_scenarios.md
    ├── ai_prompt_test_cases.md
    └── exit_gate_test_cases.md
```

---

## 快速上手

### 路徑 A：我要理解整體設計（PM / 設計師）

1. 讀 [`product/PRD.md`](product/PRD.md) — v2 產品需求總覽
2. 讀 [`product/user_journey.md`](product/user_journey.md) — 13 卡片使用者旅程
3. 讀 [`references/voice_and_tone.md`](references/voice_and_tone.md) — 嗓音與文案準則
4. 讀 [`product/motivation_design.md`](product/motivation_design.md) — Octalysis 動機設計

### 路徑 B：我要實作這個系統（前端 / 全端工程師）

1. 讀 [`product/data_model.md`](product/data_model.md) — v2 資料 schema
2. 讀 [`api/api_spec.md`](api/api_spec.md) — API 規格
3. 讀 [`design/pages/`](design/pages/) — 各卡片頁面規格
4. 讀 [`references/voice_and_tone.md`](references/voice_and_tone.md) — 所有 UI 字串必須符合

### 路徑 C：我要用 AI 直接生成程式碼（Lovable / Claude Code）

1. 從 [`assembly/pages/`](assembly/pages/) 找對應卡片的整合 prompt
2. 將 prompt 整段貼到 AI 工具
3. 對照 [`guides/quality_checklist.md`](guides/quality_checklist.md) 驗收

### 路徑 D：我要校對中文嗓音（文案 / Reviewer）

1. 讀 [`references/voice_and_tone.md`](references/voice_and_tone.md) — 唯一真相源
2. 對照 §3.1 黑名單 + §3.2 推薦詞 檢查每張卡片 UI 字串
3. 對照 §5 AI prompt 撰寫格式 檢查 `references/ai_prompt_library.md`

---

## 相關文件

| 連結 | 說明 |
| :-- | :-- |
| [`docs/workshop/painpoint_beginner_worksheet.md`](../workshop/painpoint_beginner_worksheet.md) | 線下紙本 v1 原版（內容真相源） |
| [`docs/web_design/global/painmap_brand_system.md`](../web_design/global/painmap_brand_system.md) | 共用品牌設計系統 |
| [`docs/web_design/pages/painmap/`](../web_design/pages/painmap/) | PainMap App 進階版頁面規格 |
| [`docs/product/painmap/painmap_pain_thinking_system.md`](../product/painmap/painmap_pain_thinking_system.md) | 完整理論方法論 |
| [`.claude/skills/sunnydata-pain-thinking/SKILL.md`](../../.claude/skills/sunnydata-pain-thinking/SKILL.md) | 配套 Claude Code skill |
