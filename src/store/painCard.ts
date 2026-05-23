/**
 * PainCard zustand store — LocalStorage persistence (v3.0)
 *
 * - All data in LocalStorage (key: painmap-worksheet-v3)
 * - POC mode: v1/v2 data not migrated — bumping `version` triggers a clean reset
 * - No cloud sync, no accounts
 *
 * This store owns data access only. UI strings (per `voice_and_tone.md`) live in components;
 * continue-when-ready logic lives in `src/lib/card*Validators.ts`; AI prompts live in
 * `src/lib/prompts/` (Phase 4) sourcing from `docs/painmap_worksheet/references/ai_prompt_library.md`.
 */

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CurrentStep, PainCard, PainCardStatus } from "@/types/painCard";
import { SCHEMA_VERSION } from "@/types/painCard";

const STORAGE_KEY = "painmap-worksheet-v3";
const PERSIST_THROTTLE_MS = 500;

/** Throttled localStorage — coalesces keystroke writes (avoids main-thread stalls). */
const throttledLocalStorage: Storage = (() => {
  const real = typeof window !== "undefined" ? window.localStorage : null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const pending = new Map<string, string>();

  const flush = () => {
    if (!real) return;
    for (const [key, value] of pending) {
      try {
        real.setItem(key, value);
      } catch (err) {
        console.error("[painCard persist] setItem failed:", err);
      }
    }
    pending.clear();
    timer = null;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
  }

  return {
    get length() {
      return real?.length ?? 0;
    },
    clear() {
      pending.clear();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      real?.clear();
    },
    getItem(key) {
      if (pending.has(key)) return pending.get(key) ?? null;
      return real?.getItem(key) ?? null;
    },
    key(index) {
      return real?.key(index) ?? null;
    },
    removeItem(key) {
      pending.delete(key);
      real?.removeItem(key);
    },
    setItem(key, value) {
      pending.set(key, value);
      if (timer) return;
      timer = setTimeout(flush, PERSIST_THROTTLE_MS);
    },
  };
})();

/** Build a fresh PainCard v3.0 with every field initialised. */
export function emptyPainCard(): PainCard {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    schema_version: SCHEMA_VERSION,
    status: "draft",
    created_at: now,
    updated_at: now,
    current_step: 1,

    complaint: {
      verbatim: "",
      source_name: "",
      source_relation: "",
      datetime: "",
      scene: "",
    },

    pain_diary: {
      entries: [],
    },

    ai_narrowing: {
      directions: [],
      picked_direction_id: null,
      drill_rounds: [],
    },

    focused_pain: {
      summary: "",
      in_their_own_words: "",
      why_this_one: "",
    },

    empathy_map: {
      think: "",
      feel: "",
      say: "",
      do: "",
      pain: "",
      gain: "",
    },

    stuck_formula_with_solutions: {
      user_draft: "",
      ai_polished: null,
      ai_clarifying_questions: [],
      ai_solutions: [],
      user_solution_verdicts: [],
    },

    contradiction: {
      pairs: [],
    },

    ai_evidence: {
      ai_tool: null,
      evidences: [],
      landscape: null,
      landscape_note: "",
    },

    people_with_guesses: {
      background: "",
      list: [],
    },

    assumptions: {
      items: [],
      biases_to_watch: "",
    },

    interview: {
      sessions: [],
    },

    post_interview_synthesis: {
      ai_clustered_themes: [],
      user_summary: "",
      member_check_questions: [],
    },

    result: {
      pain_id: "",
      story_one_liner: "",
      next_step_hint: null,
      next_step_note: "",
      handoff_to_sprint: false,
      exported_at: null,
      export_format: null,
    },

    llm_cache: {},
  };
}

/** Immutable nested-field update via dot-path. */
function setByPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const result: Record<string, unknown> = { ...obj };
  let cursor = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const child = cursor[key];
    cursor[key] =
      typeof child === "object" && child !== null
        ? Array.isArray(child)
          ? [...child]
          : { ...child }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return result as T;
}

type PainCardStore = {
  card: PainCard;
  hydrated: boolean;
  createCard: () => void;
  updateField: (path: string, value: unknown) => void;
  advanceStep: (step: CurrentStep) => void;
  markAsDraft: () => void;
  markAsPaused: () => void;
  markAsCompleted: () => void;
  ensurePeopleSlots: (n: number) => void;
  reset: () => void;
  exportSnapshot: () => PainCard;
};

/** Numeric order for v3 steps (1..13, then 'result' = 14). */
function stepOrder(step: CurrentStep): number {
  return step === "result" ? 14 : step;
}

export const usePainCardStore = create<PainCardStore>()(
  persist(
    (set, get) => ({
      card: emptyPainCard(),
      hydrated: false,

      createCard: () => set({ card: emptyPainCard() }),

      updateField: (path, value) => {
        set((state) => ({
          card: {
            ...setByPath(state.card, path, value),
            updated_at: new Date().toISOString(),
          },
        }));
      },

      advanceStep: (step) => {
        set((state) => {
          // current_step records the highest step reached; jumping back to earlier cards
          // does not lower it. UI uses URL to know "where am I now".
          const current = stepOrder(state.card.current_step);
          const next = stepOrder(step);
          const newStep = next > current ? step : state.card.current_step;
          const isResult = newStep === "result";
          return {
            card: {
              ...state.card,
              current_step: newStep,
              updated_at: new Date().toISOString(),
              status: isResult ? "completed" : "in_progress",
            },
          };
        });
      },

      markAsDraft: () => {
        set((state) => ({
          card: { ...state.card, status: "draft", updated_at: new Date().toISOString() },
        }));
      },

      markAsPaused: () => {
        set((state) => ({
          card: { ...state.card, status: "paused", updated_at: new Date().toISOString() },
        }));
      },

      markAsCompleted: () => {
        set((state) => ({
          card: { ...state.card, status: "completed", updated_at: new Date().toISOString() },
        }));
      },

      ensurePeopleSlots: (n) => {
        set((state) => {
          const list = state.card.people_with_guesses.list;
          if (list.length >= n) return state;
          const filled = [...list];
          while (filled.length < n) {
            filled.push({
              name: "",
              contact: "",
              relation: "",
              why_pick_them: "",
              guessed_answers: [],
            });
          }
          return {
            card: {
              ...state.card,
              people_with_guesses: { ...state.card.people_with_guesses, list: filled },
            },
          };
        });
      },

      reset: () => set({ card: emptyPainCard() }),

      exportSnapshot: () => get().card,
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return throttledLocalStorage;
      }),
      partialize: (state) => ({ card: state.card }),
      version: 1,
      // v3.0 POC mode: any persisted data from an older version is wiped clean.
      // The data we want to keep should already match v3.0 shape from `emptyPainCard()`.
      migrate: (persistedState: unknown, version: number) => {
        if (version < 1) {
          return { card: emptyPainCard() };
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
