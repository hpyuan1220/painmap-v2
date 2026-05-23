/**
 * cardValidators — pure functions for "ready to continue" (L1) checks.
 *
 * Each function takes the matching slice of a PainCard and returns whether the
 * card has enough content for the user to advance. Routes import these instead
 * of inlining the check logic, which keeps the route code thin and the rules
 * testable in isolation.
 *
 * Rules sourced from `docs/painmap_worksheet/references/exit_gates_matrix.md` §1.
 * Soft hints (L2) are owned by route components — these only handle L1 / CTA gating.
 */

import type {
  AiNarrowing,
  Assumptions,
  AiEvidence,
  Complaint,
  Contradiction,
  EmpathyMap,
  FocusedPain,
  Interview,
  PainCard,
  PainDiary,
  PeopleWithGuesses,
  PostInterviewSynthesis,
  ResultBlock,
  StuckFormulaWithSolutions,
} from "@/types/painCard";

/** Card 1 · complaint — all five fields non-empty, verbatim ≥ 10 chars. */
export function isCard1Ready(c: Complaint): boolean {
  return (
    c.verbatim.trim().length >= 10 &&
    c.source_name.trim().length > 0 &&
    c.source_relation.trim().length > 0 &&
    c.datetime.trim().length > 0 &&
    c.scene.trim().length > 0
  );
}

/** Card A · pain_diary — ≥ 1 entry with timestamp + location + note. */
export function isCardAReady(d: PainDiary): boolean {
  if (d.entries.length < 1) return false;
  return d.entries.every(
    (e) => e.timestamp.trim().length > 0 && e.location.trim().length > 0 && e.note.trim().length > 0,
  );
}

/** Card 1-A · directions[] length == 3 + picked direction id non-null. */
export function isCard1AReady(an: AiNarrowing): boolean {
  return (
    an.directions.length === 3 &&
    an.directions.every((d) => d.title.trim() && d.description.trim()) &&
    an.picked_direction_id !== null
  );
}

/** Card 1-B · drill_rounds — at least 2 rounds with all three subfields. */
export function isCard1BReady(an: AiNarrowing): boolean {
  if (an.drill_rounds.length < 2) return false;
  return an.drill_rounds.every(
    (r) =>
      r.user_question.trim().length > 0 &&
      r.ai_response.trim().length > 0 &&
      r.user_reflection.trim().length > 0,
  );
}

/** Card 3 · focused_pain — summary ≥ 60 chars + 2 other fields non-empty. */
export function isCard3Ready(fp: FocusedPain): boolean {
  return (
    fp.summary.trim().length >= 60 &&
    fp.in_their_own_words.trim().length > 0 &&
    fp.why_this_one.trim().length > 0
  );
}

/** Card B · empathy_map — all six cells non-empty. */
export function isCardBReady(em: EmpathyMap): boolean {
  return !!(
    em.think.trim() &&
    em.feel.trim() &&
    em.say.trim() &&
    em.do.trim() &&
    em.pain.trim() &&
    em.gain.trim()
  );
}

/** Card 4 · user_draft non-empty + ≥ 3 reasoned verdicts. */
export function isCard4Ready(s: StuckFormulaWithSolutions): boolean {
  if (s.user_draft.trim().length === 0) return false;
  if (s.user_solution_verdicts.length < 3) return false;
  return s.user_solution_verdicts.every((v) => v.reason.trim().length > 0);
}

/** Card 5 · ≥ 1 fully-written contradiction pair. */
export function isCard5Ready(c: Contradiction): boolean {
  if (c.pairs.length < 1) return false;
  return c.pairs.every(
    (p) => p.side_a.trim() && p.side_b.trim() && p.reason.trim(),
  );
}

/** Card 6 · ≥ 3 evidences fully written + landscape_note non-empty. */
export function isCard6Ready(ae: AiEvidence): boolean {
  if (ae.evidences.length < 3) return false;
  if (!ae.evidences.every((e) => e.source.trim() && e.quote.trim() && e.relevance.trim())) {
    return false;
  }
  return ae.landscape_note.trim().length > 0;
}

/** Card 7 · exactly 3 people, each fully written + ≥ 3 non-empty guessed answers. */
export function isCard7Ready(p: PeopleWithGuesses): boolean {
  if (p.list.length !== 3) return false;
  return p.list.every(
    (person) =>
      person.name.trim() &&
      person.contact.trim() &&
      person.relation.trim() &&
      person.why_pick_them.trim() &&
      person.guessed_answers.filter((a) => a.trim()).length >= 3,
  );
}

/** Card D · ≥ 2 assumption items + biases_to_watch non-empty. */
export function isCardDReady(a: Assumptions): boolean {
  if (a.items.length < 2) return false;
  if (
    !a.items.every(
      (i) =>
        i.assumption.trim() &&
        i.evidence_so_far.trim() &&
        i.what_would_change_my_mind.trim(),
    )
  ) {
    return false;
  }
  return a.biases_to_watch.trim().length > 0;
}

/** Card 8 · ≥ 1 interview session with required fields + ≥ 1 non-empty key_quote. */
export function isCard8Ready(i: Interview): boolean {
  if (i.sessions.length < 1) return false;
  return i.sessions.every(
    (s) =>
      s.person_name.trim() &&
      s.datetime.trim() &&
      !!s.mode &&
      s.key_quotes.filter((q) => q.trim()).length >= 1,
  );
}

/** Card G · user_summary ≥ 80 chars + ≥ 1 member_check question. */
export function isCardGReady(pis: PostInterviewSynthesis): boolean {
  if (pis.user_summary.trim().length < 80) return false;
  return pis.member_check_questions.filter((q) => q.trim()).length >= 1;
}

/** Result · story_one_liner + next_step_note non-empty + next_step_hint chosen. */
export function isResultReady(r: ResultBlock): boolean {
  return (
    r.story_one_liner.trim().length > 0 &&
    r.next_step_note.trim().length > 0 &&
    r.next_step_hint !== null
  );
}

/** Map a step to its readiness predicate. Helpful for stepper / dashboard. */
export function isStepReady(card: PainCard, step: PainCard["current_step"]): boolean {
  switch (step) {
    case 1:
      return isCard1Ready(card.complaint);
    case 2:
      return isCardAReady(card.pain_diary);
    case 3:
      return isCard1AReady(card.ai_narrowing);
    case 4:
      return isCard1BReady(card.ai_narrowing);
    case 5:
      return isCard3Ready(card.focused_pain);
    case 6:
      return isCardBReady(card.empathy_map);
    case 7:
      return isCard4Ready(card.stuck_formula_with_solutions);
    case 8:
      return isCard5Ready(card.contradiction);
    case 9:
      return isCard6Ready(card.ai_evidence);
    case 10:
      return isCard7Ready(card.people_with_guesses);
    case 11:
      return isCardDReady(card.assumptions);
    case 12:
      return isCard8Ready(card.interview);
    case 13:
      return isCardGReady(card.post_interview_synthesis);
    case "result":
      return isResultReady(card.result);
  }
}
