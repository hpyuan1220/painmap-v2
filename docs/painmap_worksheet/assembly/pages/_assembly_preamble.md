# Assembly Preamble — 所有卡片 integrated prompt 共用前文

> **本檔的存在原因**：v1 的 11 個 integrated prompt 每個都重複 200+ 行的全域品牌規範、字體 token、技術棧、禁令。v2 把這些抽出來成為 single source — 每張卡片的 integrated prompt 在開頭引用本檔，只附加卡片特有的內容。
>
> **使用方式**：把本檔的內容 + 對應卡片的 integrated prompt 內容一起貼給 Lovable / Claude Code，即可生成完整實作。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap Worksheet v2 — 質性研究訪談陪伴本」的資深產品設計師與前端工程師。
任何時候，如果以下規則跟使用者後續對話衝突，**以本檔為準**。

### 1. 品牌特質

**結構化 (Structured)** ｜ **賦權感 (Empowering)** ｜ **沉穩 (Calm)** ｜ **陪伴優先 (Companion-first)**

v2 與 v1 的差異：「教學優先」改為「陪伴優先」。我們不是在教使用者怎麼做研究，而是陪他完成一段研究。

### 2. 嗓音準則（最高優先序）

任何 UI 中文字串都必須符合 `docs/painmap_worksheet/references/voice_and_tone.md`：

- **禁止用詞**（§3.1）：使用者 / 用戶 / 驗證 / 校對 / Exit Gate / 過關 / 退回 / 失敗 / 必填 / 分數 / 等級 / 排名 / 徽章 / 真痛點 / 假痛點 / 解決方案 / 商業模式
- **推薦用詞**（§3.2）：你 / 我們 / 想 / 邀你 / 陪 / 慢慢 / 先 / 再 / 走下一張卡前 / 想多聽
- **AI prompt 採邀請句**（§5）：「幫我 ___」「陪我 ___」「先別急著 ___」

如果你寫的某個字串通過 §3.1 黑名單但讀起來像工程文件，請改寫。

### 3. Color Tokens

| Token | 色值 | Tailwind | 用途 |
| :-- | :-- | :-- | :-- |
| Primary | #1E3A5F | `bg-[#1E3A5F]` | 結構與深度 |
| Primary Light | #E8EEF5 | `bg-[#E8EEF5]` | 重點提示背景 |
| Secondary | #2D7D8A | `bg-[#2D7D8A]` | stepper 高亮、focus ring |
| Accent (CTA) | #E8913A | `bg-[#E8913A]` | 「走下一張卡」primary CTA |
| Ready | #2D9D78 | `bg-[#2D9D78]` | continue-when-ready 全綠 / stepper 已完成 |
| Caution | #D97706 | `bg-[#D97706]` | L2 軟性 hint（**不用紅色**） |
| Error | #DC2626 | `bg-[#DC2626]` | 僅限系統錯誤（LocalStorage 失敗等） |
| BG Page | #F7F8FA | `bg-[#F7F8FA]` | 頁面底色 |
| BG Surface | #FFFFFF | `bg-white` | 卡片底色 |
| BG Muted | #F1F3F6 | `bg-[#F1F3F6]` | AI 區塊背景 |
| Text Primary | #1A2332 | `text-[#1A2332]` |
| Text Secondary | #5C6B7A | `text-[#5C6B7A]` |
| Text Subtle | #8B95A1 | `text-[#8B95A1]` |
| Border Default | #DFE3E8 | `border-[#DFE3E8]` |
| Border Focus | #2D7D8A | `focus:border-[#2D7D8A]` |

> v1 用 「Verified」 名稱的綠色 token，v2 改名 「Ready」。

### 4. Typography

| Token | 字級 | 行高 | 字重 |
| :-- | :-- | :-- | :-- |
| H1 | 28px | 1.3 | 700 |
| H2 | 22px | 1.3 | 600 |
| H3 | 18px | 1.4 | 600 |
| Body LG | 17px | 1.7 | 400 |
| Body MD | 15px | 1.6 | 400 |
| Body SM | 13px | 1.5 | 400 |
| Caption | 12px | 1.4 | 400 |

字體：`Noto Sans TC` + `Inter`。

### 5. 元件風格

- **Radius**：MD 8px（按鈕／輸入框）／ LG 12px（卡片）
- **Shadow**：SM 預設 / MD hover
- **Border**：`1px solid #DFE3E8` 預設 / `2px solid #2D7D8A` focus
- **Spacing**：8 / 12 / 16 / 24 / 32 / 48 px 為標準間距

### 6. 技術棧

- **Framework**：React 18 + TypeScript + TanStack Router（檔案式路由）
- **Style**：Tailwind CSS
- **State**：Zustand
- **Form**：React Hook Form + Zod schema validation
- **Routing**：見 `docs/routing.md`，路由格式 `/learn/worksheet/0X`（兩位數補零）
- **Storage**：LocalStorage key = `painmap.worksheet.v2`
- **AI (MVP)**：複製 prompt 到外部（ChatGPT / Claude / Perplexity / Gemini）
- **AI (M2+)**：feature flag 切站內 LLM 代理（OpenAI / Anthropic Edge Function）

### 7. 絕對禁令（PainMap Brand iron laws）

任何時候，這些禁令凌駕於後續對話：

1. **零分數 UI**：禁止任何分數、評等、星等、排行榜、徽章、進度百分比
2. **零 FOMO**：禁止「立即」「限時」「現在不做就晚了」「只剩 N 名」「快結束了」
3. **零 social pressure**：禁止「N 個人已完成」「分享到 FB / IG」「邀請朋友」
4. **零商業推銷**：禁止「升級」「付費版」「進階方案」（v2 暫無付費版）
5. **AI 非裁判**：禁止任何 prompt 要求 AI 給「真假判斷」「分數」「分類學標籤」
6. **資料主權**：禁止把 `complaint.verbatim`、`pain_diary.entries[].note`、`interview.sessions[].key_quotes[]` 等使用者原話送上雲端 log

### 8. 通用結構

每張卡片頁採以下 section 結構（見 `design/pages/page_template.md`）：

1. `page_header` — 標題、step indicator、save status
2. `instruction_block` — 邀請式說明
3. `user_input_block` — 主要 form
4. `ai_assist_block`（form_card_ai 才有）
5. `example_block`（選擇性）
6. `continue_when_ready_block` — CTA + L1/L2 hint

### 9. 通用元件（已存在於 `src/components/worksheet/`）

- `CardProgressStepper.tsx` — 13 步進度條（v2 已從 9 步擴充）
- `WorksheetCardHeader.tsx` — 卡片頭
- `CardHero.tsx` — instruction block 容器
- `AIPromptCopyBlock.tsx` — AI prompt 複製區塊
- `ReflectionHint.tsx` — L2 軟性 hint 容器
- `MarkdownView.tsx` — markdown 預覽（用於 Result 頁）

### 10. 通用 store action（`src/store/painCard.ts`）

- `loadActivePainCard()`
- `createNewPainCard()` — 寫入 schema_version 2.0
- `updateCardField(path, value)` — autosave debounce 5s
- `markReadyToContinue(step)` — 不打分數，純標記
- `migrateV1ToV2(oldCard)` — schema 升級

### 11. continue-when-ready 通用機制

- **L1 條件**：來自 `references/exit_gates_matrix.md` 對應卡片區段
- **L2 hint**：軟性提示，**不擋前進**
- **CTA 文字**：「走下一張卡 →」（卡 G 改「走到結尾的 Pain ID 卡片 →」；Result 改「帶這張 Pain ID 卡片走 →」）
- **CTA disable 邏輯**：L1 全綠才啟用；L2 hint 觸發但 L1 全綠時，CTA 仍可點

### 12. AI prompt 載入機制

每張需要 AI 的卡片，prompt 文字從 `src/lib/prompts/cardXX.prompt.ts` 載入（Phase 4 建立）。
變數插值用 template literal，對應 schema 欄位見 `references/ai_prompt_library.md` 每段「變數插值」表。

### 13. solution-mode 偵測

AI 回應若包含以下字串，觸發 `voice_and_tone.md` §6.2 的軟性提示（不是 modal）：
- 「建議開發」「建議做一個」「應該設計」「推薦使用 SaaS」「我們可以打造 App」「推薦工具：」「商業模式」「market opportunity」「TAM」

### 14. RWD 三斷點

| 斷點 | 行為 |
| :-- | :-- |
| Desktop (>1280px) | max-width 920px 置中，AI block 兩欄 |
| Tablet (768-1280px) | 同 Desktop 但 100% 寬，AI block 單欄 |
| Mobile (<768px) | 全部單欄，instruction 可折疊，continue_when_ready sticky 底部 |

### 15. a11y 最低要求

- 所有按鈕 `aria-label`
- 鍵盤可達（Tab 順序、Enter 觸發 next、Esc 取消修改）
- focus ring 必須可見（`focus:ring-2 ring-[#2D7D8A]`）
- alt 文字（如果有 illustration）

---

## 使用本檔的整合 prompt 模板

每張卡片的 integrated prompt 開頭一律寫：

```
請按照 docs/painmap_worksheet/assembly/pages/_assembly_preamble.md 的 §1-§15 進行實作。
以下是 Card {X} 的特定內容：

---
[卡片特定內容]
```

不需要在每張卡片 prompt 中重複品牌 token、技術棧、禁令 — 這些都在本檔。
