# Pain Card v2 — 資料模型 (Data Model)

> **此文件為 v2 唯一真相源 (Single Source of Truth)。**
> 所有 page spec、API spec、test case 的欄位定義必須與本檔一致。
> 對應 v2 的 **13 卡片 + Result** 流程。
> UI 與 AI prompt 的中文字串請參照 `references/voice_and_tone.md`，本檔僅定義工程結構。

---

## 設計原則

1. **單一物件原則**：13 張卡片是 **同一個 PainCard 物件** 的多個欄位，不是 13 份獨立資料
2. **不可變更新**：每次卡片填寫產生新的 PainCard 版本（appendOnly），舊版本保留為 `history`
3. **本地優先**：MVP 階段所有資料存在 LocalStorage，無雲端同步
4. **可匯出**：完整 PainCard 可匯出為 Markdown / JSON / PDF
5. **零分數、零分類學**：資料層不存任何打分結果或預設標籤；欄位語意僅為「準備好往下走了嗎」的布林狀態
6. **問題取代評分**：每張卡片讓使用者先寫，AI 只在使用者寫完後出現作為對照
7. **工程欄位名與 UI 字串脫鉤**：schema 內部可保留 `ready_to_continue`、`verdict` 之類工程名，但任何顯示給使用者的字串走 `voice_and_tone.md`

---

## v1 → v2 變動摘要

| 變動 | 內容 |
| :-- | :-- |
| 新增 | `pain_diary[]`（Card A）、`ai_narrowing`（Card 1-A / 1-B）、`focused_pain`（Card 3）、`empathy_map`（Card B）、`assumptions`（Card D）、`post_interview_synthesis`（Card G） |
| 合併 | 舊 `stuck_formula` + `workaround` → `stuck_formula_with_solutions`（Card 4） |
| 改寫 | 舊 `people` → `people_with_guesses[]`（每人帶 5 個預先猜想） |
| 改寫 | 舊 `self_guess` 已併入 `people_with_guesses[].guessed_answers` |
| 改寫 | 舊 `verdict` + `pain_id_export` → `result` |
| 欄位重命名 | `exit_gate_passed` → `ready_to_continue`（語意一致，但移除「閘門」工程語感）|
| schema_version | `1.0` → `2.0` |
| current_step | `1..10` → `1..13` ｜ `'result'` |

---

## 完整 Schema (TypeScript)

```typescript
/**
 * PainCard v2 — 痛點身份證
 * 對應 v2 的 13 卡片 + Result 流程
 */
type PainCard = {
  // === Meta ===
  id: string;                       // UUID v4
  schema_version: '2.0';
  status: PainCardStatus;
  created_at: string;               // ISO8601
  updated_at: string;               // ISO8601
  current_step:
    | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
    | 'result';

  // === Card 1: 那句脫口而出的話 ===
  complaint: {
    verbatim: string;               // 原話，不修飾
    source_name: string;            // 誰說的（真名 / 暱稱皆可，但要叫得出來）
    source_relation: string;        // 你跟他的關係
    datetime: string;               // ISO8601 或情境描述
    scene: string;                  // 那時候在做什麼
    ready_to_continue: boolean;     // 內部布林，不顯示給使用者
  };

  // === Card A (NEW): 痛點現場日記 ===
  pain_diary: {
    entries: Array<{
      timestamp: string;            // ISO8601
      location: string;             // 在哪裡發生的（家 / 辦公室 / 通勤）
      mood: string;                 // 當下心情（一兩個詞）
      trigger: string;              // 是什麼觸發了這一刻
      note: string;                 // 自由書寫，原話或描述
      attachments?: string[];       // 可選：照片 / 語音 URL（MVP 純文字）
    }>;                             // 0..N，建議 3-5 個
    ready_to_continue: boolean;
  };

  // === Card 1-A (NEW): AI 替你打開三條路 ===
  ai_narrowing: {
    directions: Array<{
      id: string;
      title: string;                // AI 給的方向標題
      description: string;          // AI 的描述
      why_it_matters: string;       // AI 解釋這條路在意什麼
    }>;                             // 通常 3 個
    picked_direction_id: string | null;

    // === Card 1-B: 走進其中一條，慢慢往下問 ===
    drill_rounds: Array<{
      round: 1 | 2 | 3;
      user_question: string;        // 使用者這一輪想問的問題
      ai_response: string;          // AI 的回應（不含解法）
      user_reflection: string;      // 使用者讀完的反思
    }>;
    ready_to_continue: boolean;
  };

  // === Card 3: 聚焦痛點摘要 ===
  focused_pain: {
    summary: string;                // 使用者把 1-A/1-B 結果寫成一段摘要（≥ 60 字）
    in_their_own_words: string;     // 用那個有名字的人會講的話再說一次
    why_this_one: string;           // 為什麼是這條路、不是其他兩條
    ready_to_continue: boolean;
  };

  // === Card B (NEW): 心情地圖 (Empathy Map) ===
  empathy_map: {
    think: string;                  // 心裡想什麼
    feel: string;                   // 感受
    say: string;                    // 嘴上會說什麼
    do: string;                     // 行為上會做什麼
    pain: string;                   // 卡在哪
    gain: string;                   // 希望得到什麼
    ready_to_continue: boolean;
  };

  // === Card 4: 把卡點輕輕說清楚 + AI 解法回看 ===
  stuck_formula_with_solutions: {
    user_draft: string;             // 使用者寫「我每次要 ___，都會卡在 ___」
    ai_polished: string | null;     // AI 整理後的版本（不取代原稿）
    ai_clarifying_questions: string[];

    // AI 列出常見解法，使用者逐一回看
    ai_solutions: Array<{
      id: string;
      label: string;                // AI 提的解法名（不是行銷文案）
      description: string;          // 簡短描述
    }>;
    user_solution_verdicts: Array<{
      solution_id: string;
      verdict: 'helps' | 'partial' | 'no' | 'unknown';   // 內部欄位
      reason: string;               // 使用者寫為什麼這個解法不夠
    }>;
    ready_to_continue: boolean;
  };

  // === Card 5: 取捨對話 (TRIZ) ===
  contradiction: {
    pairs: Array<{
      side_a: string;               // 想要 A
      side_b: string;               // 也想要 B
      picked: 'a' | 'b';
      reason: string;               // 為什麼這次選這邊
    }>;                             // 建議 3 組
    ready_to_continue: boolean;
  };

  // === Card 6: 市場聲音的三段證據 ===
  ai_evidence: {
    ai_tool: 'chatgpt_dr' | 'claude' | 'perplexity' | 'gemini' | 'in_app';
    evidences: Array<{
      source: string;               // 哪裡看到的
      quote: string;                // 引用片段
      relevance: string;            // 使用者寫為什麼這段跟我的痛有關
    }>;                             // 至少 3 段
    landscape: 'common_pain' | 'niche_pain' | 'unclear';  // 內部欄位
    landscape_note: string;         // 使用者自己寫的觀察
    ready_to_continue: boolean;
  };

  // === Card 7: 三個有名字的人 + 你心裡的猜想 ===
  people_with_guesses: {
    background: string;             // 這群人的共同背景
    list: Array<{
      name: string;                 // 真名 / 你叫得出來的稱呼
      contact: string;              // LINE / 電話 / Email
      relation: string;             // 跟你的關係
      why_pick_them: string;        // 為什麼想找他聊
      guessed_answers: string[];    // 你預先猜他會給的 5 個答案
    }>;                             // length 必須 = 3
    ready_to_continue: boolean;
  };

  // === Card D (NEW): 自我假設清單 (Assumption Check) ===
  assumptions: {
    items: Array<{
      assumption: string;           // 我目前的假設
      evidence_so_far: string;      // 我目前手上的證據
      what_would_change_my_mind: string;  // 訪談中要聽到什麼才會修正
    }>;
    biases_to_watch: string;        // 自我提醒：我容易帶哪些偏見
    ready_to_continue: boolean;
  };

  // === Card 8: 真人對話 ===
  interview: {
    sessions: Array<{
      person_name: string;          // 從 people_with_guesses 連結
      datetime: string;             // ISO8601
      mode: 'in_person' | 'video_call' | 'phone' | 'chat';
      consent_recorded: boolean;    // 是否取得錄音 / 紀錄同意
      key_quotes: string[];         // 印象深刻的原話
      surprises: string[];          // 哪些是猜錯的
      confirmed_guesses: string[];  // 哪些猜對了
      new_threads: string[];        // 哪些新的線索冒出來
    }>;
    ready_to_continue: boolean;
  };

  // === Card G (NEW): 訪後沉澱 (Post-Interview Synthesis) ===
  post_interview_synthesis: {
    ai_clustered_themes: Array<{
      theme: string;                // AI 建議的主題標籤
      supporting_quotes: string[];  // AI 連結的引用
      user_kept: boolean;           // 使用者決定保留 / 重命名 / 丟棄
      user_renamed_to?: string;
    }>;
    user_summary: string;           // 使用者自己寫的一段沉澱（不只是 AI 結果）
    member_check_questions: string[];  // 想回頭跟受訪者再 check 的問題
    ready_to_continue: boolean;
  };

  // === Result: Pain ID 卡片（取代舊 verdict + pain_id_export） ===
  result: {
    pain_id: string;                // 自動生成的識別碼
    story_one_liner: string;        // 一句話的故事
    next_step_hint: 'continue_listening' | 'pause_for_now' | 'ready_for_sprint';
    next_step_note: string;         // 使用者自己寫的下一步說明
    handoff_to_sprint: boolean;     // 是否要進階到 first-dollar sprint
    exported_at: string | null;     // 何時匯出
    export_format: 'markdown' | 'json' | 'pdf' | null;
  };

  // === History（appendOnly）===
  history: Array<{
    snapshot_at: string;
    diff_summary: string;
  }>;
};

type PainCardStatus =
  | 'draft'           // 寫作中
  | 'paused'          // 中途離開，下次可回來
  | 'completed';      // 走完 Result
```

---

## 欄位語義備註

### `ready_to_continue` vs 舊版 `exit_gate_passed`

- 語意相同：使用者已經寫了足夠資訊，可以往下走。
- 命名改變：移除「閘門 (gate)」「通過 (pass)」的工程語感。
- UI 永遠**不直接顯示**這個布林。UI 只顯示「走下一張卡」按鈕的啟用狀態。
- 後端 / store 內部仍可使用這個欄位做狀態判斷。

### `next_step_hint` 為什麼還在

雖然不打分數，但使用者完成 Result 時需要一個**書面 + 結構化**的下一步建議。
三個值對應 `voice_and_tone.md` 中的軟性語句：

| 內部值 | UI 顯示文案 |
| :-- | :-- |
| `continue_listening` | 「這條故事還想再多聽幾個聲音」 |
| `pause_for_now` | 「先把這個放回口袋，過一陣子再回來看」 |
| `ready_for_sprint` | 「這條故事準備好走進真實的 72 小時了」 |

### 「AI 介入點」與 schema 的對應

| 卡片 | AI 寫入 | 欄位 |
| :-- | :-- | :-- |
| Card 1-A | 直接 | `ai_narrowing.directions[]` |
| Card 1-B | 直接 | `ai_narrowing.drill_rounds[].ai_response` |
| Card 4 | 直接 | `stuck_formula_with_solutions.ai_polished` + `.ai_solutions[]` |
| Card 6 | 間接（複製貼上） | `ai_evidence.evidences[]`（使用者貼進來）|
| Card G | 直接 | `post_interview_synthesis.ai_clustered_themes[]` |
| 其他 | ❌ 不介入 |  |

---

## 驗證規則摘要

每張卡片走下一張前的「ready_to_continue」條件詳見 `references/exit_gates_matrix.md`。
此處只列工程必要欄位的最低要求：

| 卡片 | 最低要求 |
| :-- | :-- |
| Card 1 | `complaint.verbatim.length ≥ 10` + `source_name` + `datetime` + `scene` 皆非空 |
| Card A | `pain_diary.entries.length ≥ 1`（建議 3，最低 1） |
| Card 1-A | `ai_narrowing.directions.length === 3` + `picked_direction_id !== null` |
| Card 1-B | `ai_narrowing.drill_rounds.length ≥ 2`（建議 3） |
| Card 3 | `focused_pain.summary.length ≥ 60` + `why_this_one` 非空 |
| Card B | empathy_map 6 個欄位皆非空 |
| Card 4 | `user_draft` 非空 + `user_solution_verdicts.length ≥ 3` |
| Card 5 | `contradiction.pairs.length ≥ 1`（建議 3） |
| Card 6 | `evidences.length ≥ 3` + `landscape_note` 非空 |
| Card 7 | `list.length === 3` + 每人 `guessed_answers.length ≥ 3`（建議 5） |
| Card D | `assumptions.items.length ≥ 2` |
| Card 8 | `interview.sessions.length ≥ 1`（建議 = `people_with_guesses.list.length`） |
| Card G | `user_summary.length ≥ 80` |
| Result | `story_one_liner` + `next_step_note` 皆非空 |

---

## LocalStorage 結構

```typescript
// key: painmap.worksheet.v2
{
  schema_version: '2.0';
  active_pain_card_id: string;
  pain_cards: {
    [id: string]: PainCard;
  };
}
```

從 v1 升級時：
- 讀取舊 `painmap.worksheet` key
- 若 `schema_version === '1.0'`，呼叫 `migrateV1ToV2()` 把舊欄位映射到新欄位（見 `lib/painCardMigration.ts`）
- 升級完寫入新 key `painmap.worksheet.v2`，舊 key 保留 30 天以防 rollback

---

## 匯出格式（Pain ID 卡片）

匯出時組裝 markdown 範本（精簡版）：

```markdown
# Pain ID · {pain_id}

## 一句話的故事
{result.story_one_liner}

## 抱怨原話
> {complaint.verbatim}
> — {complaint.source_name}，{complaint.datetime}

## 聚焦的痛點
{focused_pain.summary}

## 心情地圖
- 心裡想：{empathy_map.think}
- 感受：{empathy_map.feel}
- 嘴上說：{empathy_map.say}
- 行為：{empathy_map.do}
- 卡在：{empathy_map.pain}
- 希望：{empathy_map.gain}

## 卡點公式
{stuck_formula_with_solutions.user_draft}

## 三個取捨
{contradiction.pairs}

## 訪過的人
{interview.sessions}

## 訪後沉澱
{post_interview_synthesis.user_summary}

## 我的下一步
{result.next_step_note}
```

JSON 匯出：完整 PainCard 物件（包含 history）。
PDF 匯出：上述 markdown 渲染後輸出，沿用 brand 字體與留白。
