/**
 * cardValidators.test — covers the 14 L1 readiness predicates from
 * exit_gates_matrix.md §1 (Cards 1, A, 1-A, 1-B, 3, B, 4, 5, 6, 7, D, 8, G, Result).
 *
 * Each test asserts the empty/partial state is "not ready" and a happy-path
 * state is "ready", plus 1-2 edge cases that match a specific exit-gate rule.
 */

import { describe, expect, it } from "vitest";

import {
  isCard1Ready,
  isCard1AReady,
  isCard1BReady,
  isCard3Ready,
  isCard4Ready,
  isCard5Ready,
  isCard6Ready,
  isCard7Ready,
  isCard8Ready,
  isCardAReady,
  isCardBReady,
  isCardDReady,
  isCardGReady,
  isResultReady,
  isStepReady,
} from "@/lib/cardValidators";
import { emptyPainCard } from "@/store/painCard";

describe("Card 1 · complaint", () => {
  it("is not ready when empty", () => {
    expect(isCard1Ready(emptyPainCard().complaint)).toBe(false);
  });

  it("requires verbatim length ≥ 10", () => {
    const c = {
      verbatim: "短",
      source_name: "林老師",
      source_relation: "本人",
      datetime: "2026-05-22",
      scene: "週六晚上",
    };
    expect(isCard1Ready(c)).toBe(false);
    expect(isCard1Ready({ ...c, verbatim: "我每週六晚上要寫家長 LINE" })).toBe(true);
  });

  it("rejects any single empty field", () => {
    const base = {
      verbatim: "我每週六晚上要寫家長 LINE",
      source_name: "林老師",
      source_relation: "本人",
      datetime: "2026-05-22",
      scene: "週六晚上",
    };
    for (const k of Object.keys(base) as Array<keyof typeof base>) {
      expect(isCard1Ready({ ...base, [k]: "" })).toBe(false);
    }
  });
});

describe("Card A · pain_diary", () => {
  it("is not ready with zero entries", () => {
    expect(isCardAReady({ entries: [] })).toBe(false);
  });

  it("requires every entry to have timestamp + location + note", () => {
    expect(
      isCardAReady({
        entries: [
          {
            timestamp: "2026-05-22T20:00",
            location: "家",
            mood: "煩",
            trigger: "",
            note: "又熬夜寫",
          },
        ],
      }),
    ).toBe(true);
    expect(
      isCardAReady({
        entries: [
          { timestamp: "2026-05-22T20:00", location: "", mood: "", trigger: "", note: "x" },
        ],
      }),
    ).toBe(false);
  });
});

describe("Card 1-A · ai_narrowing.directions", () => {
  it("requires exactly 3 directions + a picked id", () => {
    const valid = {
      directions: [
        { id: "d1", title: "整週零散資料", description: "desc1", why_it_matters: "" },
        { id: "d2", title: "具體 vs 不傷感情", description: "desc2", why_it_matters: "" },
        { id: "d3", title: "少數個案耗時", description: "desc3", why_it_matters: "" },
      ],
      picked_direction_id: "d1",
      drill_rounds: [],
    };
    expect(isCard1AReady(valid)).toBe(true);
    expect(isCard1AReady({ ...valid, picked_direction_id: null })).toBe(false);
    expect(
      isCard1AReady({ ...valid, directions: valid.directions.slice(0, 2) }),
    ).toBe(false);
  });
});

describe("Card 1-B · drill_rounds", () => {
  it("requires ≥ 2 rounds with all three subfields", () => {
    const fullRound = (n: 1 | 2 | 3) => ({
      round: n,
      user_question: "q",
      ai_response: "r",
      user_reflection: "ref",
    });
    expect(
      isCard1BReady({
        directions: [],
        picked_direction_id: null,
        drill_rounds: [fullRound(1)],
      }),
    ).toBe(false);
    expect(
      isCard1BReady({
        directions: [],
        picked_direction_id: null,
        drill_rounds: [fullRound(1), fullRound(2)],
      }),
    ).toBe(true);
    expect(
      isCard1BReady({
        directions: [],
        picked_direction_id: null,
        drill_rounds: [fullRound(1), { ...fullRound(2), user_reflection: "" }],
      }),
    ).toBe(false);
  });
});

describe("Card 3 · focused_pain", () => {
  it("requires summary ≥ 60 chars", () => {
    const longSummary =
      "我聽到林老師卡在每週六晚上要把整整一週的零散資料，重新整理成 30 個家長都能讀懂、又不會傷感情的訊息，這件事既耗時又情緒勞動很高，讓他每週都熬夜寫到半夜。";
    expect(longSummary.length).toBeGreaterThanOrEqual(60);
    expect(
      isCard3Ready({
        summary: longSummary,
        in_their_own_words: "x",
        why_this_one: "y",
      }),
    ).toBe(true);
    expect(
      isCard3Ready({ summary: "太短", in_their_own_words: "x", why_this_one: "y" }),
    ).toBe(false);
  });
});

describe("Card B · empathy_map", () => {
  it("requires all six cells", () => {
    const full = {
      think: "想多睡",
      feel: "焦慮",
      say: "我來不及",
      do: "熬夜寫",
      pain: "週六崩潰",
      gain: "睡飽",
    };
    expect(isCardBReady(full)).toBe(true);
    expect(isCardBReady({ ...full, gain: "" })).toBe(false);
  });
});

describe("Card 4 · stuck_formula_with_solutions", () => {
  it("requires user_draft + ≥ 3 reasoned verdicts", () => {
    expect(
      isCard4Ready({
        user_draft: "我每次要 X 都卡在 Y",
        ai_polished: null,
        ai_clarifying_questions: [],
        ai_solutions: [],
        user_solution_verdicts: [
          { solution_id: "s1", verdict: "no", reason: "不解" },
          { solution_id: "s2", verdict: "partial", reason: "一半" },
          { solution_id: "s3", verdict: "helps", reason: "可以" },
        ],
      }),
    ).toBe(true);
    expect(
      isCard4Ready({
        user_draft: "",
        ai_polished: null,
        ai_clarifying_questions: [],
        ai_solutions: [],
        user_solution_verdicts: [
          { solution_id: "s1", verdict: "no", reason: "不解" },
          { solution_id: "s2", verdict: "partial", reason: "一半" },
          { solution_id: "s3", verdict: "helps", reason: "可以" },
        ],
      }),
    ).toBe(false);
  });
});

describe("Card 5 · contradiction.pairs", () => {
  it("requires ≥ 1 fully written pair", () => {
    expect(isCard5Ready({ pairs: [] })).toBe(false);
    expect(
      isCard5Ready({
        pairs: [{ side_a: "客製", side_b: "規模", picked: "b", reason: "活下來" }],
      }),
    ).toBe(true);
    expect(
      isCard5Ready({
        pairs: [{ side_a: "客製", side_b: "規模", picked: "b", reason: "" }],
      }),
    ).toBe(false);
  });
});

describe("Card 6 · ai_evidence", () => {
  it("requires ≥ 3 evidences + landscape_note", () => {
    const evidences = [
      { source: "Dcard A", quote: "Q1", relevance: "R1" },
      { source: "Dcard B", quote: "Q2", relevance: "R2" },
      { source: "Dcard C", quote: "Q3", relevance: "R3" },
    ];
    expect(
      isCard6Ready({
        ai_tool: "chatgpt_dr",
        evidences,
        landscape: "common_pain",
        landscape_note: "看起來不少人提",
      }),
    ).toBe(true);
    expect(
      isCard6Ready({
        ai_tool: "chatgpt_dr",
        evidences: evidences.slice(0, 2),
        landscape: null,
        landscape_note: "x",
      }),
    ).toBe(false);
  });
});

describe("Card 7 · people_with_guesses", () => {
  it("requires exactly 3 people, each with 3+ guesses", () => {
    const person = (n: number) => ({
      name: `林老師${n}`,
      contact: "line:abc",
      relation: "同行",
      why_pick_them: "在線",
      guessed_answers: ["a", "b", "c"],
    });
    expect(
      isCard7Ready({ background: "補習班", list: [person(1), person(2), person(3)] }),
    ).toBe(true);
    expect(
      isCard7Ready({ background: "x", list: [person(1), person(2)] }),
    ).toBe(false);
    expect(
      isCard7Ready({
        background: "x",
        list: [person(1), person(2), { ...person(3), guessed_answers: ["a", "b"] }],
      }),
    ).toBe(false);
  });
});

describe("Card D · assumptions", () => {
  it("requires ≥ 2 items + biases_to_watch", () => {
    const item = (n: number) => ({
      assumption: `a${n}`,
      evidence_so_far: `e${n}`,
      what_would_change_my_mind: `c${n}`,
    });
    expect(
      isCardDReady({ items: [item(1), item(2)], biases_to_watch: "確認偏誤" }),
    ).toBe(true);
    expect(isCardDReady({ items: [item(1)], biases_to_watch: "x" })).toBe(false);
    expect(
      isCardDReady({ items: [item(1), item(2)], biases_to_watch: "" }),
    ).toBe(false);
  });
});

describe("Card 8 · interview.sessions", () => {
  it("requires ≥ 1 session with name + datetime + mode + ≥ 1 key_quote", () => {
    const fullSession = {
      person_name: "林老師",
      datetime: "2026-05-22T20:00",
      mode: "in_person" as const,
      consent_recorded: true,
      key_quotes: ["他真的這樣說"],
      surprises: [],
      confirmed_guesses: [],
      new_threads: [],
    };
    expect(isCard8Ready({ sessions: [fullSession] })).toBe(true);
    expect(isCard8Ready({ sessions: [] })).toBe(false);
    expect(
      isCard8Ready({ sessions: [{ ...fullSession, key_quotes: [] }] }),
    ).toBe(false);
    expect(
      isCard8Ready({ sessions: [{ ...fullSession, person_name: "" }] }),
    ).toBe(false);
  });
});

describe("Card G · post_interview_synthesis", () => {
  it("requires user_summary ≥ 80 chars + ≥ 1 member_check question", () => {
    const longSummary =
      "我訪了三個老師後最大的驚訝是，原來大家其實對家長期待的差異很大，重點不在訊息內容多寡，而是家長心裡那種被理解感的承載方式不同，有些人要儀式感，有些人只是要簡短具體一句話就夠了。";
    expect(longSummary.length).toBeGreaterThanOrEqual(80);
    expect(
      isCardGReady({
        ai_clustered_themes: [],
        user_summary: longSummary,
        member_check_questions: ["要再問一次"],
      }),
    ).toBe(true);
    expect(
      isCardGReady({
        ai_clustered_themes: [],
        user_summary: "太短的話不行",
        member_check_questions: ["要再問一次"],
      }),
    ).toBe(false);
    expect(
      isCardGReady({
        ai_clustered_themes: [],
        user_summary: longSummary,
        member_check_questions: [""],
      }),
    ).toBe(false);
  });
});

describe("Result · pain ID", () => {
  it("requires story_one_liner + next_step_note + next_step_hint", () => {
    expect(
      isResultReady({
        pain_id: "pid-x",
        story_one_liner: "我聽到了一段被資料淹沒的故事",
        next_step_hint: "continue_listening",
        next_step_note: "再找兩位老師聊",
        handoff_to_sprint: false,
        exported_at: null,
        export_format: null,
      }),
    ).toBe(true);
    expect(
      isResultReady({
        pain_id: "pid-x",
        story_one_liner: "x",
        next_step_hint: null,
        next_step_note: "x",
        handoff_to_sprint: false,
        exported_at: null,
        export_format: null,
      }),
    ).toBe(false);
  });
});

describe("isStepReady dispatcher", () => {
  it("returns false for every step on an empty card", () => {
    const empty = emptyPainCard();
    for (const step of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, "result"] as const) {
      expect(isStepReady(empty, step)).toBe(false);
    }
  });
});
