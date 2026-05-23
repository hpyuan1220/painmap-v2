# PainMap Worksheet v2 — Landing 入口頁 Integrated Prompt

> **Preamble**：`_assembly_preamble.md` §1-§15
> **Page spec**：`docs/painmap_worksheet/design/pages/00_landing.md`
> **使用方式**：把 preamble + 本檔貼給 Lovable / Claude Code

---

## 任務

實作 Landing 入口頁 `/learn/worksheet`，以 v2 嗓音介紹「一本陪你做質性研究的筆記本」，並導向 13 卡片流程的第一張或上次未完成的卡片。

## 路由

- **檔案**：`src/routes/learn.worksheet.tsx`（layout）+ `src/routes/learn.worksheet.index.tsx`（內容）
- **URL**：`/learn/worksheet`
- **trailing slash**：禁用（見 `docs/routing.md`）

## Section 結構

1. **Hero**
   - H1：「一本陪你做質性研究的筆記本。」
   - 三段話術（見 page spec §HERO COPY）
   - Primary CTA：「開始一段新的探索 →」（無未完成 PainCard）或「繼續上次的探索 →」（有 → 顯示「上次走到 Card N」）+ 次要 CTA「開一段新的，把上次先放著」

2. **What is this（三段定位）**
   - 三欄卡片（mobile 堆疊）
   - 標題：「這不是 idea 評分器」/「我們不打分數」/「你的痛點只屬於你」
   - 內文見 page spec §WHAT IS THIS

3. **Flow preview**
   - 13 步 stepper 視覺化（橫向，mobile 可滑動）
   - 每張卡 icon + 標題

4. **Who is this for**
   - 三個 persona 卡片（林老師 / 小恆 / Vicky）

5. **Privacy note**
   - 一段強調 LocalStorage、無雲端、無註冊

## 邏輯

```typescript
const existingCard = loadActivePainCard();
if (existingCard && (existingCard.status === 'paused' || existingCard.status === 'draft')) {
  showWelcomeBack(existingCard.current_step);
} else {
  showFreshStart();
}

// 開始新的
const newCard = createNewPainCard();  // schema_version: '2.0', current_step: 1
navigate({ to: '/learn/worksheet/01' });

// 繼續上次
navigate({ to: routeFromStep(existingCard.current_step) });
```

## Acceptance Criteria

- [ ] Hero 文案完全照 page spec
- [ ] 偵測 LocalStorage 既有 PainCard 時正確顯示 welcome-back
- [ ] 13 步 stepper RWD 正確
- [ ] CTA 文字符合 v2 嗓音
- [ ] 全頁面通過 `voice_and_tone.md` §3.1 黑名單
- [ ] 無分數 / 星等 / 徽章 / FOMO 字眼
- [ ] a11y：CTA `aria-label`、Tab 順序、focus ring 可見
