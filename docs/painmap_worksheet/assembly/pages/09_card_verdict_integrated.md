# PainMap Worksheet — Card 9 (真假判斷｜極簡版) Integrated Prompt

> 自我包含整合 prompt — 直接貼入 Lovable / Claude Code 即可生成卡 9 完整實作。
> 對應 page spec：`docs/painmap_worksheet/design/pages/09_card_verdict.md`
> 對應資料模型：`docs/painmap_worksheet/product/data_model.md` v2.0 § Card 9
> 組裝日期：2026-05-02 ｜ Worksheet v2.0
>
> **v2.0 重大變更**：徹底刪除 5 維度評分（0-25 分）、刪除教學 / 生產模式切換、刪除 mode toggle / banner、刪除 ScoresForm / ScoresSummary。卡 9 只剩寫作：5 個 Socratic 反思問句純螢幕提示（**不寫進資料**）+ judgment + reason_100w (≥100) + most_confident_evidence + least_confident + next_action。
>
> **AI 在這張卡完全永久禁用**（worksheet 鐵律：判斷必須人為書面）。

---

## === GLOBAL PROJECT GUIDELINE (DO NOT OVERRIDE) ===

你是「PainMap 題眼 — Worksheet」的資深產品設計師與前端工程師。

### 品牌特質

**結構化** ｜ **賦權感** ｜ **沉穩** ｜ **蘇格拉底式**

### Color Tokens

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| Primary #1E3A5F / Primary Light #E8EEF5 / Secondary #2D7D8A / Accent CTA #E8913A（judgment_form border-left）/ Verified #2D9D78（reason ≥ 100 字綠）/ Caution #D97706 / BG Page #F7F8FA / BG Muted #F1F3F5 / Text Primary #1A2332 / Text Secondary #5C6B7A / Border Default #DFE3E8 / Border Focus #2D7D8A |

### Typography

H1 28px / H2 22px / H3 18px / Body LG 17px / Body MD 15px / Body SM 13px / Caption 12px

字體：`Noto Sans TC` + `Inter`

### 元件風格

- Radius MD 8px / LG 12px
- Border `1px solid #DFE3E8` / focus 2px Teal
- Shadow SM / MD

### 技術棧

React 18 + TypeScript + Tailwind + Zustand + React Hook Form + Zod。LocalStorage key：`painmap-worksheet-v2`（**單一 key，無 settings.display_mode**）。

### 絕對禁令（PainMap Brand）

- **禁止：任何分數 UI（N/25、N/100、N 星、A-F 等級、雷達圖）**（v2.0 強化）
- **禁止：教學 vs 生產模式切換 / banner / URL ?mode= 參數**（v2.0 移除）
- 禁止：排行榜、徽章、倒數計時
- 禁用詞：「等級 A / B / C」「優秀 / 良好 / 普通 / 差」「Pain Quality」「最佳痛點」「成功率 / 可行性 X%」「AI 推薦」「AI 判斷這是真的」「你的判斷準確度」「升級為真痛點 / 降級為假痛點」「闖關」「streak」「教學模式」「生產模式」「5 維度」「總分」
- 禁止 Inline styles / `console.log`
- WCAG AA / 語意化 HTML / focus ring Teal

### 絕對禁令（Octalysis 黑帽）

- 禁止 #6 Scarcity：「24 小時內判定有獎勵」
- 禁止 #7 Unpredictability：「驚喜 Pain Score」
- 禁止 #8 Loss Avoidance：「沒判定明天 status 會降為 draft」、streak

### 蘇格拉底式特殊鐵律（Card 9 為**最敏感卡**）

1. **AI 完全永久禁用**（worksheet 鐵律：判斷必須人為書面，包含所有判斷層欄位）
2. **書面優先**：reason_100w 必須 ≥ 100 字（**強制 minLength**）
3. **5 個 Socratic 反思問句純 UI**（不寫進資料，不可變成 textarea）
4. **無模式切換**（v2.0：worksheet 系統內不存在「教學模式 / 生產模式」之分）
5. **無分數**（v2.0：schema 內已無 `verdict.scores` / `verdict.total_score`）

---

## === CURRENT TASK: BUILD CARD 9 — 真假判斷（極簡版） ===

### [PAGE META]

- **page_name**: Card 9 - Verdict (Socratic Minimal)
- **route_path**: `/learn/worksheet/09?id={paincard_uuid}`（**無 `&mode=` 參數**）
- **card_step**: 9（最後一張 worksheet 卡片）
- **page_type**: worksheet_card_critical
- **primary_goal**: 引導使用者完成書面真假判斷（≥ 100 字）+ 最有把握 / 最沒把握 + 下一步行動
- **secondary_goal**: 訓練「判斷力 = 書面寫得清楚」的職業習慣
- **prerequisite_cards**: [1, 2, 3, 4, 5, 6, 7, 8]
- **expected_time_on_page**: 20-40 分鐘（書面判斷 ≥ 100 字需思考）

---

### [STRUCTURE: SECTIONS]

1. **stepper_context** — 卡 1-8 ✓ / 卡 9 高亮
2. **card_intro** — 「這是這份填空簿的唯一交付物」+ AI 永久禁用聲明
3. **socratic_reflection_panel** — 5 個 Socratic 反思問句（**純 UI 提示，不寫資料**）
4. **judgment_form** — 真假判斷單選 + ≥ 100 字書面理由 + most/least confident + next_action
5. **reflection_footer** — 必填狀態 + 「查看你的痛點身份證」CTA

> ❌ 移除：`mode_indicator`、`scores_form`、`scores_summary`、`teaching_warning`、`total_score_display`、`score_band_hint`、`status_change_preview`

---

### [SECTION COMPONENT SPEC]

#### Section 1: stepper_context

- 與卡 1-8 一致
- `ai_indicator` (Badge, **Error red border**): "AI 介入：完全禁用（鐵律）"

#### Section 2: card_intro

- `card_label` (Caption): "卡片 9 / 9"
- `title` (H1): "真假痛點的書面判斷"
- `one_liner` (Body LG): "走到這裡，你要做的只有一件事：書面回答『這是真痛點還是假痛點？為什麼？』"
- `ai_disabled_banner` (AlertBanner Critical, role="alert", **必填顯示，不可收合**)：
  - icon: 🚫
  - title: "這張卡片 AI 完全不參與"
  - body: 「真假判斷是這套訓練的唯一交付物。AI 可以幫你蒐集證據（卡 6）、整理表（卡 7）、模擬訪談（卡 8），但『真的嗎』『值得嗎』這兩題永遠是你來判。」
- `delivery_reminder` (CalloutBox Empowering, icon=🪪)：
  - title: "這份填空簿的唯一交付物"
  - body: 「你不需要做產品、不需要架網站、不需要收錢。你只需要交出這個書面判斷。」

#### Section 3: socratic_reflection_panel（v2.0 新區塊，**純 UI 提示**）

- **layout**: 全寬白底，padding 24px，最大寬 800px，背景 BG Muted `#F1F3F5`
- `section_title` (H2): "在寫 100 字理由前，先想想這 5 個問題"
- `subtitle` (Body MD Italic): "（這些只是反思提示，不會寫進你的 PainCard。等你想清楚再到下方寫判斷。）"
- `reflection_list` (`<ReflectionHint>` 元件 ×5)：
  1. 「你能說出 3 個有名字的人嗎？」
  2. 「你看到他每週遇到幾次？是猜的還是有人告訴你？」
  3. 「他付出最多的是時間、錢、心力還是關係？」
  4. 「他現在解法最讓他不爽的點，能用他的話寫出來嗎？」
  5. 「最有把握的證據 vs 最薄弱的環節分別是什麼？」

> ⚠️ 鐵律：這 5 個問句**純螢幕顯示**，**不**對應任何 textarea / radio / data field。它們是「給你想想」的反思提示，不是欄位。
> 設計決策：使用者選擇最極簡——5 個維度只當作螢幕上的提示文字（pure UI），不寫進資料。資料層只有下面 judgment_form 的 5 個欄位。

#### Section 4: judgment_form（**核心區塊**）

- **layout**: 全寬白底容器，padding 32px，最大寬 800px，**border-left 4px Accent #E8913A**
- `section_title` (H2): "你的書面判斷"

##### `judgment_radio` (RadioGroup, 3 個選項，**必須單選**)

- option_true_pain: value=`true_pain`, label="✓ 真痛點"（H3）, description="我有足夠證據相信這是真的。下一步排訪談 / 進階段二。"
- option_fake_pain: value=`fake_pain`, label="✗ 假痛點"（H3）, description="證據不支持。換題目，從卡 1 重新來。"
- option_pending_interview: value=`pending_interview`, label="？ 還無法判斷"（H3）, description="需要訪談 2-3 人後再回來重打。這是最常見的結果，很正常。"
- data_path: `verdict.judgment`

##### `reason_input` (Textarea, **核心欄位**)

- label (H3): "書面理由（≥ 100 字）"
- hint: "不是想想就過。具體寫：你看到了什麼證據、你還沒看到什麼、為什麼這樣判。"
- input: Textarea (高度 240px, **minLength 100, maxLength 5000, 強制 minLength**)
- char_counter (Body SM)：動態顯示「已寫 N / 至少 100 字」；達 100 字後變 Verified Green
- data_path: `verdict.reason_100w`

##### `most_confident_input` (Textarea)

- label (Body Bold): "我最有把握的證據是"
- hint: "從卡 6 + 卡 7 抽 1 個具體證據（不是空話）"
- minLength 15
- data_path: `verdict.most_confident_evidence`

##### `least_confident_input` (Textarea)

- label (Body Bold): "我最沒把握的地方是"
- hint: "誠實寫出你的不確定。這比假裝有把握更有價值。"
- minLength 15
- data_path: `verdict.least_confident`

##### `next_action_radio` (RadioGroup)

- label (Body Bold): "下一步我會"
- options:
  - "訪談卡 8 的對象" / value: `interview`（true_pain / pending_interview 預設）
  - "回卡 6 找更多證據" / value: `more_evidence`
  - "換題目重新填一輪" / value: `change_topic`（fake_pain 預設）
- data_path: `verdict.next_action`

**狀態**：
- judgment_selected → next_action 自動預選對應選項（可手動改）
- reason_filling：char_counter 即時更新；< 100 字時顯示中性提示「還可以再寫詳細一點」（**不擋輸入**），≥ 100 字變 Verified Green
- autosaved (debounce 2 秒)

#### Section 5: reflection_footer（sticky bottom）

- 4 個必填狀態提示：
  - check_1: 「judgment 已選」
  - check_2: 「書面理由 ≥ 100 字」
  - check_3: 「最有把握 + 最沒把握 都寫了」
  - check_4: 「next_action 已選」
- `cta_next` (Button Primary Large): "查看你的痛點身份證 →" → `/learn/worksheet/result`
- `cta_back` (Button Ghost, optional): "← 回卡 8"

> ❌ 移除：`status_change_preview`「PainCard.status 即將變為...」（過度技術化）；保留資料層自動寫入但不顯示給使用者。

---

### [INTERACTION & STATE FLOW]

#### 主要互動流程

1. 頁面載入 → 從 LocalStorage `painmap-worksheet-v2` 讀 PainCard
2. socratic_reflection_panel 顯示 5 個反思問句（純 UI）
3. 使用者選 judgment → next_action 自動預選對應選項
4. 使用者寫 reason_100w → char_counter 即時更新，達 100 字變綠
5. 必填條件全通過 → cta_next enable
6. 點 cta_next → 寫入 PainCard.status + current_step = 10 + 跳轉 `/learn/worksheet/result`

#### 過關後狀態變更

```
verdict.judgment === 'true_pain' →
  PainCard.status = 'structured'
  PainCard.current_step = 10
  → /learn/worksheet/result

verdict.judgment === 'pending_interview' →
  PainCard.status = 'pending_interview'
  PainCard.current_step = 10

verdict.judgment === 'fake_pain' →
  PainCard.status = 'archived_fake'
  PainCard.current_step = 10
```

#### RWD

| 斷點 | 佈局 |
| :--- | :--- |
| Desktop (>1280px) | socratic_reflection_panel 全寬條列；judgment 3 選項橫排 |
| Tablet (768-1280px) | 同 Desktop |
| Mobile (<768px) | judgment 3 選項堆疊；exit_gate sticky bottom |

---

### [DATA & API]

- **uses_api**: false（MVP）
- **localstorage_keys**:
  - `painmap-worksheet-v2`（**單一 key，無 settings.display_mode**）
- **data_paths_written** (v2.0)：
  - `PainCard.verdict.judgment` (`'true_pain' | 'fake_pain' | 'pending_interview'`)
  - `PainCard.verdict.reason_100w` (≥ 100 字)
  - `PainCard.verdict.most_confident_evidence` (≥ 15 字)
  - `PainCard.verdict.least_confident` (≥ 15 字)
  - `PainCard.verdict.next_action` (`'interview' | 'more_evidence' | 'change_topic'`)
  - `PainCard.status` (依 judgment 自動寫入)
  - `PainCard.current_step` → 10
- **無 score 欄位**（schema 內 `verdict.scores` / `verdict.total_score` 已移除）
- **Socratic 反思問句不寫資料**（純 UI）

---

### [REFLECTION HINTS]

#### 必填條件（CTA disable 直到齊備）

| # | 條件 | 自動判定 | 提示文案 |
| :- | :--- | :--- | :--- |
| 1 | judgment 已選 | `verdict.judgment` ∈ ['true_pain', 'fake_pain', 'pending_interview'] | 「請選真 / 假 / 待訪談」 |
| 2 | 書面理由 ≥ 100 字 | `verdict.reason_100w.length >= 100` | 「再多寫 N 字。具體說你看到 / 沒看到什麼」 |
| 3 | most_confident_evidence 寫了 | `length >= 15` | 「寫一個具體證據（不是空話）」 |
| 4 | least_confident 寫了 | `length >= 15` | 「誠實寫你的不確定」 |
| 5 | next_action 已選 | `verdict.next_action` ∈ ['interview', 'more_evidence', 'change_topic'] | 「請選下一步行動」 |

#### 卡 9 沒有「回頭重想」中性 link

卡 9 是判斷本身，不是資訊蒐集。任一條件未過 → 留在當頁，顯示具體缺什麼。例外：使用者主動點 cta_back 回卡 8（保留卡 9 已填資料）。

---

### [AI INTEGRATION]

- **AI 介入狀態**：❌ **永久禁用**（包含 M2+ 站內 LLM 上線後也不開放）
- **理由**（worksheet 鐵律）：判斷必須人為書面
- **設計手法**：
  - ai_disabled_banner 強制顯示，不可收合或關閉（role="alert"）
  - **不可加**「AI 幫你檢查 reason 是否完整」按鈕
  - **不可加**「AI 推薦下一步」按鈕
  - **不可加**「AI 紅隊照鏡子」按鈕
  - **不可在 reason textarea 旁邊放**「灌入 AI 模板」shortcut
  - **即使是 M2+ 站內 LLM 串接，這張卡的所有 textarea / radio 也永遠不可有 AI 輔助**
  - 後端 `/api/ai/run-prompt` 收到 `card_step === 9` 一律拒絕（400 CARD_9_AI_FORBIDDEN）

| AI 任務 | 是否使用 | 說明 |
| :--- | :--- | :--- |
| 寫 reason_100w | ❌ 永久禁用 | worksheet 鐵律 |
| 自動判定 true / fake | ❌ 永久禁用 | 違反 brand 第三原則 |
| 自動填 most_confident / least_confident | ❌ 永久禁用 | 自我反思必須親自做 |
| 自動推薦 next_action | ❌ 永久禁用 | 行動是判斷的延伸 |

---

### [OCTALYSIS HOOKS]

#### 主驅動力：#2 Development & Accomplishment

- 卡 9 通關 = 痛點身份證即將產出（capstone moment）
- reason_100w 達 100 字後 char_counter 變 Verified Green（**微小成就感，不慶祝**）
- 過關後自動進入卡 10（匯出），形成完整閉環

#### 副驅動力：#4 Ownership & Possession（限定使用）

- 「**你的**判斷」敘事貫穿全頁
- judgment 是 single-decision，沒有「AI 建議」混淆
- LocalStorage 確保資料主權

#### 反模式檢查清單（Card 9 最容易犯，**v2.0 強化**）

- ❌ **任何 5 維度評分 UI**（v2.0：schema 內已無 score 欄位，砍光）
- ❌ **0-25 分顯示 / 雷達圖 / 進度條**
- ❌ **教學 / 生產模式切換 banner**
- ❌ **URL ?mode= 參數**
- ❌ 把 0-25 分轉換為 A-F 等級
- ❌ 「Pain Quality 排行榜」
- ❌ 推送通知「你的 Pain Quality 提升了 +3」
- ❌ 「分享你的 Pain Quality Score 到社群」按鈕
- ❌ 把 judgment 結果做成「成就徽章」
- ❌ 跨 PainCard 比較
- ❌ AI 自動寫 reason_100w
- ❌ 「你的判斷準確嗎？AI 來幫你看看」

---

## === EXCEPTION RULES ===

本頁面允許以下例外（已明確標記）：

1. **AI 完全禁用 + ai_disabled_banner 強制顯示**：違反一般「AI 是助手」全站定位。理由：判斷力訓練的核心。
2. **reason_100w minLength 100 字強制**：違反一般「不限制輸入長度」原則。理由：worksheet 鐵律。
3. **socratic_reflection_panel 5 個問句純 UI 不寫資料**：違反一般「螢幕上的反思應該記錄下來」直覺。理由：使用者選擇最極簡——資料層只有書面判斷，反思過程不存（避免日後 over-engineer 變成另一套 score）。

---

## === OUTPUT REQUIREMENTS ===

### Step 1：結構確認

- 5 個 sections + 用途
- PainCard schema 對應（v2.0）：`verdict.{judgment, reason_100w, most_confident_evidence, least_confident, next_action}`
- 資料流：URL `?id` → 讀 LocalStorage → 渲染 socratic_reflection_panel + judgment_form → 必填狀態檢查 → PATCH status + current_step
- **無 mode 邏輯**

### Step 2：設計決策說明

說明 3 個關鍵設計決策：
1. **為什麼移除 5 維度評分？** — 分數會誤用為「綠燈」，於是要加 disclaimer 解釋「分數不是答案」。蘇格拉底式工具不打分數，只問問題。卡 9 改為 5 個 Socratic 純 UI 提示 + 書面判斷 = 訓練判斷力本身。
2. **為什麼 5 個反思問句不寫資料？** — 寫進去就會變成 5 個 textarea，5 個 textarea 又會被加上 minLength，又會變成另一套打分。最極簡 = 純 UI，使用者想完就跳到下方寫判斷。
3. **為什麼移除教學 / 生產模式切換？** — 雙模式為了隱藏分數而存在；分數本不該存在；模式也不該存在。一刀砍三層自我矛盾。

### Step 3：實作方案（Option A）

- `Card9VerdictPage.tsx`
- `StepperContext` / `CardIntro` / `AiDisabledBanner` / `SocraticReflectionPanel` / `JudgmentForm` / `ReflectionFooter`
- `useReasonCharCounter` hook
- Zod schema for verdict（v2.0：含 minLength 100 強制；無 scores 欄位）
- RWD Tailwind

### 品質檢查清單（部署前必過）

#### 通用驗收
- [ ] 5 個 Section 依序渲染，stepper 顯示 current_step = 9
- [ ] ai_disabled_banner 強制顯示，不可被收合或關閉（role="alert" + aria-live="polite"）
- [ ] socratic_reflection_panel 顯示 5 個反思問句（純文字，無 textarea / radio）
- [ ] reason_100w textarea 接受 ≥ 100 字輸入；< 100 字時 char_counter 顯示中性提示
- [ ] judgment 三選一切換時，next_action 自動預選對應選項
- [ ] 必填條件全通過後 cta_next enable
- [ ] 過關後 PainCard.status 依 judgment 正確寫入（true_pain → structured 等）
- [ ] 過關後 PainCard.current_step 寫入 10
- [ ] reason_100w textarea 有 aria-describedby 連結到 char_counter

#### v2.0 反模式驗收（**必過全部不出現**）
- [ ] **無任何 5 維度評分 UI / SegmentedScale / total_score / radar chart / progress bar 0-25**
- [ ] **無 verdict.scores / verdict.total_score 欄位寫入**
- [ ] **無 mode_indicator / scores_form / scores_summary 元件**
- [ ] **無 URL `?mode=teaching|production` 參數**
- [ ] **無「教學模式」「生產模式」「總分」「分數」字眼**
- [ ] **無 score_band_hint「20-25 / 15-19 / 0-14」三種建議**
- [ ] 是否出現 0-25 分轉 A-F 等級的 UI？→ 砍掉
- [ ] 是否有 Pain Quality Score 排行榜？→ 砍掉
- [ ] 是否有 5 維度雷達圖 / 進度條？→ 砍掉
- [ ] 是否有「分享你的得分」按鈕？→ 砍掉
- [ ] 是否有 judgment 徽章（金 / 銀 / 銅）？→ 砍掉
- [ ] 是否有 AI 輔助寫 reason 按鈕？→ 砍掉（**Card 9 鐵律**）
- [ ] 是否有跨 PainCard 分數比較？→ 砍掉
- [ ] 是否有 streak / 過期警告？→ 砍掉

#### 禁用詞掃描（v2.0 強化）
- [ ] 全頁面零出現「等級 A / B / C」「優秀 / 良好 / 普通 / 差」「Pain Quality」「最佳痛點」「成功率 / 可行性」「AI 推薦你選真痛點」「AI 判斷這是真的」「分享你的得分」「升級為真痛點 / 降級為假痛點」「闖關」「streak」「教學模式」「生產模式」「5 維度」「總分」「N / 25」「N / 100」「過關條件」「退回」

#### 資料層
- [ ] LocalStorage key 為 `painmap-worksheet-v2`（無 settings.display_mode）
- [ ] verdict object 內無 `scores` / `total_score` 欄位
- [ ] 公開分享連結使用同一份 schema（無模式之分）

---

**版本資訊**：Worksheet v2.0 ｜ Brand v1.0 ｜ 2026-05-02
