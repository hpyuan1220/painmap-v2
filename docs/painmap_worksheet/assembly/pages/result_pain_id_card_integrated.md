# Result · Pain ID 卡片 — Integrated Prompt

> **Preamble**：`_assembly_preamble.md`
> **Page spec**：`design/pages/result_pain_id_card.md`
> **Schema**：`data_model.md` `result`
> **Exit gate**：`exit_gates_matrix.md#result`
> **AI prompt**：（無）
> **v1 對應**：取代舊 Card 9（真假判斷）+ Card 10（PainID 匯出）

---

## 任務

實作 `/learn/worksheet/result`，自動組裝 Pain ID 卡片 preview + 使用者寫「一句話的故事」+ 選下一步 hint + 寫下一步說明 + 匯出 markdown/json/pdf。

## 檔案

- **Route**：`src/routes/learn.worksheet.result.tsx`（v1 已存在，內容全改）
- **Component folder**：`src/components/worksheet/result/`（從 v1 的 card10 重新命名而來）
- **Export lib**：`src/lib/painIdExport.ts`（v1 的 `cardTenExport.ts` 重新命名 + v2 schema 對應）

## Section 結構

1. **Result header**
   - 「今天先陪你走到這裡」
   - Pain ID（顯示 `result.pain_id`）

2. **Story one-liner block**
   - Input（一行）→ `result.story_one_liner`
   - placeholder：「用一句話告訴未來的自己：這趟路上你聽到了什麼？」

3. **Pain ID preview**
   - 自動組裝 markdown（範本見 `data_model.md` §匯出格式）
   - 即時更新（react to PainCard 變更）
   - 顯示在 `MarkdownView.tsx`

4. **Next step block**
   - `result.next_step_hint`：RadioGroup
     - `continue_listening` → 顯示「這條故事還想再多聽幾個聲音」
     - `pause_for_now` → 顯示「先把這個放回口袋，過一陣子再回來看」
     - `ready_for_sprint` → 顯示「這條故事準備好走進真實的 72 小時了」
   - `result.next_step_note`：Textarea (rows=3)

5. **Handoff to sprint block**
   - `result.handoff_to_sprint`：Toggle（預設 false）
   - 軟性詢問，不誇張、不催促

6. **Export block**
   - `result.export_format`：RadioGroup (markdown / json / pdf)
   - 按鈕「下載這張 Pain ID 卡片」→ 觸發匯出

## Instruction copy

```
今天先陪你走到這裡。

這張 Pain ID 卡片屬於你，可以放回口袋，
也可以下次回來再多聊幾段。

如果你準備好要試試看「72 小時把一個解法做出來給一個真人」，
我們有另一份 sprint manual 可以接著走。
但如果不是今天，那就不是今天。
```

## 邏輯

```typescript
// 進入頁面時
if (!isReadyForResult(currentCard)) {
  // 顯示「我們先把 Card N 寫完再回來」軟性訊息（不擋）
}

// 自動產生 pain_id（若尚未）
if (!card.result.pain_id) {
  updateField('result.pain_id', generatePainId());  // 例：pid-20260523-abc123
}

// 匯出
function handleExport(format: 'markdown' | 'json' | 'pdf') {
  const blob = painIdExport(card, format);
  triggerDownload(blob, `pain-id-${card.result.pain_id}.${ext(format)}`);
  updateField('result.exported_at', new Date().toISOString());
  updateField('result.export_format', format);
  updateField('status', 'completed');
}
```

## L1 條件

- CR.1：story_one_liner 非空
- CR.2：next_step_note 非空
- CR.3：next_step_hint 已選

## CTA

「帶這張 Pain ID 卡片走 →」（解鎖時觸發匯出）

## Acceptance Criteria

- [ ] preview 自動從整個 PainCard 組裝
- [ ] 三個 next_step hint 顯示文案符合 `data_model.md` §next_step_hint 對照
- [ ] markdown / json / pdf 三種匯出皆能下載
- [ ] handoff_to_sprint toggle 不含 FOMO 話術
- [ ] 結尾文案符合 `voice_and_tone.md` §6.4
- [ ] 全頁面通過 `voice_and_tone.md` §3.1
- [ ] 完成後 `status` 轉為 `completed`，但**不**自動清除 LocalStorage（使用者可隨時回看）
- [ ] **絕對禁令**：禁止「恭喜你完成」「分數」「徽章」「分享到 FB」這類 UI
