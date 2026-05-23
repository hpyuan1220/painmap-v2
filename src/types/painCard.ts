/**
 * PainCard — 痛點身份證 v3.0
 *
 * Schema for PainMap Worksheet v2 (13-card qualitative-research notebook).
 * Single source of truth — corresponds 1:1 with
 * `docs/painmap_worksheet/product/data_model.md`.
 *
 * UI strings are NOT here. See `docs/painmap_worksheet/references/voice_and_tone.md`.
 *
 * Design rules (`docs/painmap_worksheet/product/PRD.md` iron laws):
 * - All 13 cards live as fields of a single PainCard object.
 * - No score / rank / badge fields anywhere.
 * - LocalStorage only; never sync raw user text upstream.
 *
 * Migration: v2.0 → v3.0 happens in `src/store/painCard.ts` `migrateV2ToV3`.
 * After Phase 4 components migrate to v3.0 field names, the v2.0 schema is gone.
 */

export type PainCardStatus = "draft" | "in_progress" | "paused" | "completed";

export type AiTool = "chatgpt_dr" | "claude" | "perplexity" | "gemini" | "in_app";

/** v3.0 step keys: 1..13 for the 13 cards, "result" for the Pain ID card page. */
export type CurrentStep =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
  | "result";

// =====================================================================
// Card 1 · 那句脫口而出的話 — /learn/worksheet/01
// =====================================================================

export type Complaint = {
  verbatim: string;
  source_name: string;
  source_relation: string;
  datetime: string;
  scene: string;
};

// =====================================================================
// Card A · 痛點現場日記 (NEW) — /learn/worksheet/02
// =====================================================================

export type PainDiaryEntry = {
  timestamp: string;
  location: string;
  mood: string;
  trigger: string;
  note: string;
  attachments?: string[];
};

export type PainDiary = {
  entries: PainDiaryEntry[];
};

// =====================================================================
// Card 1-A / 1-B · AI broaden + iterative drill (NEW) — /03 + /04
// =====================================================================

export type AiDirection = {
  id: string;
  title: string;
  description: string;
  why_it_matters: string;
};

export type DrillRound = {
  round: 1 | 2 | 3;
  user_question: string;
  ai_response: string;
  user_reflection: string;
};

export type AiNarrowing = {
  directions: AiDirection[];
  picked_direction_id: string | null;
  drill_rounds: DrillRound[];
};

// =====================================================================
// Card 3 · 聚焦痛點摘要 — /05
// =====================================================================

export type FocusedPain = {
  summary: string;
  in_their_own_words: string;
  why_this_one: string;
};

// =====================================================================
// Card B · 心情地圖 (NEW) — /06
// =====================================================================

export type EmpathyMap = {
  think: string;
  feel: string;
  say: string;
  do: string;
  pain: string;
  gain: string;
};

// =====================================================================
// Card 4 · 卡點公式 + AI 解法回看 — /07
// =====================================================================

export type AiSolution = {
  id: string;
  label: string;
  description: string;
};

export type SolutionVerdict = {
  solution_id: string;
  verdict: "helps" | "partial" | "no" | "unknown";
  reason: string;
};

export type StuckFormulaWithSolutions = {
  user_draft: string;
  ai_polished: string | null;
  ai_clarifying_questions: string[];
  ai_solutions: AiSolution[];
  user_solution_verdicts: SolutionVerdict[];
};

// =====================================================================
// Card 5 · 取捨對話 — /08
// =====================================================================

export type ContradictionPair = {
  side_a: string;
  side_b: string;
  picked: "a" | "b";
  reason: string;
};

export type Contradiction = {
  pairs: ContradictionPair[];
};

// =====================================================================
// Card 6 · 市場聲音的三段證據 — /09
// =====================================================================

export type EvidenceEntry = {
  source: string;
  quote: string;
  relevance: string;
};

export type AiEvidence = {
  ai_tool: AiTool | null;
  evidences: EvidenceEntry[];
  landscape: "common_pain" | "niche_pain" | "unclear" | null;
  landscape_note: string;
};

// =====================================================================
// Card 7 · 三個有名字的人 + 你心裡的猜想 — /10
// =====================================================================

export type PersonWithGuesses = {
  name: string;
  contact: string;
  relation: string;
  why_pick_them: string;
  guessed_answers: string[];
};

export type PeopleWithGuesses = {
  background: string;
  list: PersonWithGuesses[];
};

// =====================================================================
// Card D · 自我假設清單 (NEW) — /11
// =====================================================================

export type AssumptionItem = {
  assumption: string;
  evidence_so_far: string;
  what_would_change_my_mind: string;
};

export type Assumptions = {
  items: AssumptionItem[];
  biases_to_watch: string;
};

// =====================================================================
// Card 8 · 真人對話 — /12
// =====================================================================

export type InterviewMode = "in_person" | "video_call" | "phone" | "chat";

export type InterviewSession = {
  person_name: string;
  datetime: string;
  mode: InterviewMode;
  consent_recorded: boolean;
  key_quotes: string[];
  surprises: string[];
  confirmed_guesses: string[];
  new_threads: string[];
};

export type Interview = {
  sessions: InterviewSession[];
};

// =====================================================================
// Card G · 訪後沉澱 (NEW) — /13
// =====================================================================

export type ClusteredTheme = {
  theme: string;
  supporting_quotes: string[];
  user_kept: boolean;
  user_renamed_to?: string;
};

export type PostInterviewSynthesis = {
  ai_clustered_themes: ClusteredTheme[];
  user_summary: string;
  member_check_questions: string[];
};

// =====================================================================
// Result · Pain ID 卡片 — /result
// =====================================================================

export type NextStepHint = "continue_listening" | "pause_for_now" | "ready_for_sprint";

export type ResultBlock = {
  pain_id: string;
  story_one_liner: string;
  next_step_hint: NextStepHint | null;
  next_step_note: string;
  handoff_to_sprint: boolean;
  exported_at: string | null;
  export_format: "markdown" | "json" | "pdf" | null;
};

// =====================================================================
// LLM cache (carry forward — used by site-internal LLM judge)
// =====================================================================

export type LlmCacheEntry = {
  input_hash: string;
  verdict: "pass" | "warn";
  reason: string;
  judged_at: string;
};

// =====================================================================
// Top-level PainCard (v3.0)
// =====================================================================

export type PainCard = {
  id: string;
  schema_version: "3.0";
  status: PainCardStatus;
  created_at: string;
  updated_at: string;
  current_step: CurrentStep;

  complaint: Complaint;
  pain_diary: PainDiary;
  ai_narrowing: AiNarrowing;
  focused_pain: FocusedPain;
  empathy_map: EmpathyMap;
  stuck_formula_with_solutions: StuckFormulaWithSolutions;
  contradiction: Contradiction;
  ai_evidence: AiEvidence;
  people_with_guesses: PeopleWithGuesses;
  assumptions: Assumptions;
  interview: Interview;
  post_interview_synthesis: PostInterviewSynthesis;
  result: ResultBlock;

  llm_cache: Record<string, LlmCacheEntry>;
};

export const SCHEMA_VERSION = "3.0" as const;

// v3.0 step labels — concise UI title for stepper
export const STEP_LABELS: Record<Exclude<CurrentStep, "result">, string> = {
  1: "原話",
  2: "現場日記",
  3: "三條路",
  4: "往下問",
  5: "聚焦摘要",
  6: "心情地圖",
  7: "卡點公式",
  8: "取捨對話",
  9: "三段證據",
  10: "三個人 + 猜想",
  11: "自我假設",
  12: "真人對話",
  13: "訪後沉澱",
};

export const STEP_TITLES: Record<Exclude<CurrentStep, "result">, string> = {
  1: "Card 1 · 那句脫口而出的話",
  2: "Card A · 痛點現場日記",
  3: "Card 1-A · AI 替你打開三條路",
  4: "Card 1-B · 走進其中一條，慢慢往下問",
  5: "Card 3 · 聚焦痛點摘要",
  6: "Card B · 心情地圖",
  7: "Card 4 · 把卡點輕輕說清楚 + AI 解法回看",
  8: "Card 5 · 取捨對話",
  9: "Card 6 · 市場聲音的三段證據",
  10: "Card 7 · 三個有名字的人 + 你心裡的猜想",
  11: "Card D · 自我假設清單",
  12: "Card 8 · 真人對話",
  13: "Card G · 訪後沉澱",
};

// Helper: map v3 step number to its URL slug (zero-padded two digits).
export function stepToUrlSlug(step: CurrentStep): string {
  if (step === "result") return "result";
  return String(step).padStart(2, "0");
}

// Helper: map URL slug back to v3 step number.
export function urlSlugToStep(slug: string): CurrentStep | null {
  if (slug === "result") return "result";
  const n = parseInt(slug, 10);
  if (Number.isInteger(n) && n >= 1 && n <= 13) return n as CurrentStep;
  return null;
}
