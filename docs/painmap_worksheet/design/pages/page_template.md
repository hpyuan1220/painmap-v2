# Worksheet Page Spec Template v2 (卡片頁專用)

> **v2 鐵律**：本範本只負責「頁面結構」。
> 卡片的「做什麼、為什麼、語氣」由 4 份 canonical 文件決定，**不要在 page spec 重述**：
>
> - `product/user_journey.md` — 每張卡的目的、情緒、走下一張前的軟性邀請
> - `product/data_model.md` — 欄位 schema + 最低要求
> - `references/exit_gates_matrix.md` — L1 CTA 條件 + L2 中性 hint
> - `references/ai_prompt_library.md` — AI prompt 原文 + 變數插值 + 防護字
>
> Page spec 只列：路由、欄位映射、layout、states、RWD、頁面特有的例外。
>
> 嗓音準則永遠是 `references/voice_and_tone.md`，任何顯示給使用者的中文字串都必須通過 §3.1 黑名單檢查。

---

## [PAGE META]

```yaml
page_name: {例：Card 1-A · AI 替你打開三條路}
route_path: /learn/worksheet/0X         # 兩位數補零
page_type: form_card | form_card_ai     # 有 AI 介入用 form_card_ai
step_in_flow: 1..13 | 'result'          # 對應 PainCard.current_step
paincard_field_path: {data_model.md 中對應的欄位路徑，例：ai_narrowing}
ai_prompt_section: {ai_prompt_library.md 對應段落，例：§2}
exit_gate_section: {exit_gates_matrix.md 對應卡片區段}
journey_section: {user_journey.md 對應段落}
```

---

## [STRUCTURE: SECTIONS]

標準 5-6 個 section（依需要可省略 `ai_assist_block` 或 `example_block`）：

1. `page_header` — 卡片標題、步驟進度、儲存狀態
2. `instruction_block` — 1-2 句邀請式說明（這張卡要做什麼）
3. `user_input_block` — 主要 form 欄位
4. `ai_assist_block`（form_card_ai 才有）— prompt 複製 + 貼回回應
5. `example_block`（選擇性）— 林老師案例參照
6. `continue_when_ready_block` — 走下一張卡的 CTA + 軟性邀請

> 舊版 `exit_gate_block` 改名 `continue_when_ready_block`（與 `voice_and_tone.md` §3.1 一致）。

---

## [SECTION COMPONENT SPEC]

### page_header

- **layout**：sticky 在 sub-nav 之下，全寬 padding 24px
- **elements**：
  - `card_title` (H1) — 例：「Card 1-A · AI 替你打開三條路」（最多 18 字中文）
  - `card_subtitle` (Body MD, 選填) — 一句話本質（最多 30 字）
  - `step_indicator` — 「Step 3 / 13」
  - `save_status` — 「已儲存於 HH:MM」/「儲存中⋯」/「儲存失敗，請重試」

### instruction_block

- **layout**：全寬，BG Surface，padding 24px，圓角 12px
- **elements**：
  - `icon` (illustration, 選填)
  - `heading` (H2) — 最多 14 字中文
  - `description` (Body MD) — 2-3 行，採邀請式語氣
  - `invitation_note` (Caption, 選填) — 「想多聽 / 想邀請 / 走下一張卡前」軟句
- **嗓音規則**：對齊 `voice_and_tone.md` §4.2，**不可**寫「規則」「必填」「請填入」

### user_input_block

- **layout**：1-column form
- **elements**：每個欄位 = Type / required-or-not / placeholder / hint
- **states**：
  - `default` / `focus` / `filled` / `hint_shown` / `autosave_pending`
- **autosave**：5s debounce 或失焦時觸發
- **placeholder 嗓音**：用「寫下你聽到的⋯」「先別整理，把當下的⋯」這類軟句，不寫「請輸入⋯」

### ai_assist_block（僅 form_card_ai）

引用 `components/ai_prompt_copy_block.md`。
- **layout**：全寬，BG Muted；Desktop 可選兩欄（左 prompt / 右 response）
- **elements**：
  - `section_title` (H3) — 「想請 AI 陪你⋯」（不寫「AI 幫你」「AI 校對」）
  - `tool_selector` — ChatGPT / Claude / Perplexity / Gemini 四選一
  - `prompt_textarea` — 顯示 prompt 原文（從 `ai_prompt_library.md` 對應段載入）
  - `external_link_btn` — 「打開 ChatGPT」（直接帶 prompt）
  - `response_textarea` — 「把 AI 的回應貼回來」
  - `solution_mode_hint` — 偵測 solution mode 字串時顯示 `voice_and_tone.md` §6.2 訊息
- **變數插值**：見 `ai_prompt_library.md` 對應段落「變數插值」表

### example_block（選擇性）

- **layout**：全寬，BG Primary Light
- **elements**：
  - `section_title` (H3) — 「📖 看一個例子（林老師）」
  - `example_content` — 範例文本（程式碼字體呈現）
  - `example_source` (caption) — 「來自 Card 1-A 的延伸」之類
- **mobile**：預設折疊，「看例子」展開

### continue_when_ready_block

引用 `components/exit_gate_check.md`（檔名保留但內容已 v2 化）。
- **layout**：全寬，sticky 底部，padding 24px
- **elements**：
  - `requirement_checklist` — L1 條件勾選狀態（顯示哪些已寫滿）
  - `next_button` (Button Primary) — 「走下一張卡 →」(disabled 直到 L1 全綠)
  - `soft_hint_zone` — L2 中性 hint 顯示區（從 `exit_gates_matrix.md` 載入）
  - `step_back_link` — 「先到前面那張卡看看」（選填）
  - `pause_link` — 「先存檔離開，下次再回來」
- **state**：
  - `locked` — next disabled，但底下顯示「走下一張卡前我們想多聽你說的事」軟句
  - `ready` — next enabled，checklist 全綠
- **嗓音規則**：next_button 文字統一為「走下一張卡 →」，最後一張 Card G 改為「走到結尾的 Pain ID 卡片 →」，Result 改為「帶這張 Pain ID 卡片走 →」

---

## [INTERACTION & STATE FLOW]

```
頁面載入
  ↓
從 LocalStorage 讀 PainCard，填入既有資料
  ↓
使用者寫 user_input_block → autosave (5s debounce)
  ↓
(form_card_ai)
  使用者複製 prompt → 外部 AI 回 → 貼回 response → 解析寫入 schema
  ↓
L1 全綠 → next_button enabled
  ↓
點 next → 寫入 current_step + 1 → router 跳下一頁
```

---

## [RWD]

| 斷點 | 行為 |
| :-- | :-- |
| Desktop (>1280px) | max-width 920px 置中，ai_assist 兩欄 |
| Tablet (768-1280px) | 同 Desktop 但 100% 寬，ai_assist 單欄堆疊，example 折疊 |
| Mobile (<768px) | 全部單欄，instruction 可折疊，continue_when_ready sticky 底部 |

---

## [DATA & API]

- **uses_api**：MVP 為 false（純 LocalStorage）；M2+ feature flag 切站內 LLM 代理
- **localstorage_key**：`painmap.worksheet.v2`（schema_version 2.0）
- **paincard_fields_read** / **paincard_fields_write**：列在每張卡片自己的 spec
- **schema_validation**：寫入前用 Zod 驗 schema；失敗保留原 input 並顯示 L2 hint

---

## [CONTINUE-WHEN-READY]

**全部來自 `references/exit_gates_matrix.md`**，page spec 只引用區段編號：

```yaml
exit_gate_ref: exit_gates_matrix.md#card-{X}
l1_requirements: [見 exit_gates_matrix.md 對應 L1 表]
l2_hints: [見 exit_gates_matrix.md 對應 L2 表]
```

---

## [AI INTEGRATION]

**全部來自 `references/ai_prompt_library.md`**，page spec 只引用：

```yaml
ai_prompt_ref: ai_prompt_library.md#{section-id}
prompt_variables: [從對應段落「變數插值」表複製]
anti_solution_mode_safeguard: [從對應段落「anti-solution-mode 防護」複製]
in_app_payload: [從對應段落「站內 LLM payload」複製]
```

---

## [OCTALYSIS HOOKS]

- **Primary Drive**：#X {驅動力}（在這張卡如何體現）
- **Secondary Drive(s)**：#X {驅動力}
- **設計手法**：一兩個 page-specific 技巧
- **反模式**：禁止做的事（避免破壞白帽驅動力）

詳見 `design/octalysis_card_mapping.md`。

---

## [BRAND LANGUAGE RULES (PAGE-SPECIFIC)]

### 嗓音核對（必須）

- [ ] 全頁面字串通過 `voice_and_tone.md` §3.1 黑名單檢查
- [ ] AI prompt 採邀請句，符合 `voice_and_tone.md` §5 骨架
- [ ] CTA 文案符合 §3.2 白名單
- [ ] 錯誤訊息走 §6 模板

### 頁面特有用語

| 推薦 | 場景 |
| :-- | :-- |
| {例：「往下問」} | Card 1-B drill round 按鈕 |

---

## [ACCEPTANCE CRITERIA]

- [ ] 所有 section 功能正常
- [ ] 所有 state 已實作（default / focus / filled / hint / autosave / locked / ready）
- [ ] RWD 三斷點正確
- [ ] LocalStorage 5s debounce 寫入運作
- [ ] Stepper 對應 step 顯示 active
- [ ] L1 條件與 `exit_gates_matrix.md` 一致
- [ ] AI prompt 與 `ai_prompt_library.md` 一致；變數插值正確
- [ ] solution-mode 偵測準確（≥ 90% recall）
- [ ] Octalysis hook 在 UI 上有具體體現（不是只在文件裡）
- [ ] **嗓音核對全綠**（`voice_and_tone.md` §3.1 + §3.2 + §5）
- [ ] a11y：aria-label、鍵盤可達、Tab 順序正確、Enter 觸發 next、Esc 取消修改

---

## [VERSION]

| 版本 | 日期 | 變更 |
| :-- | :-- | :-- |
| 1.0 | 2026-05-01 | v1 範本 |
| 2.0 | 2026-05-23 | v2：拆出 canonical 文件，page spec 不再重述卡片內容；改名 exit_gate → continue_when_ready；對齊 voice_and_tone.md |
