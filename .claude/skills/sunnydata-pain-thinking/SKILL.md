---
name: sunnydata-pain-thinking
description: Use when exploring or validating whether a pain point is real (not whether it can make money). Stage 1 only — runs the 9-step pain discovery flow with SECI/TRIZ lenses and first-principles/Socratic engines. Outputs written true/fake pain verdict + Pain Quality Score (teaching mode) or Validation Status draft/structured (production mode). Money, payment, manual delivery, and BCG DRI belong to Stage 2 (sprint manual) and are NOT triggered by this skill.
---

# Pain Thinking — 階段一痛點發想（v2 兩階段版）

> **Authoritative source:** `docs/product/painmap/painmap_pain_thinking_system.md`
> **Companion lecture:** `docs/workshop/painpoint_systematic_thinking_lecture.md`
> **Beginner worksheet:** `docs/workshop/painpoint_beginner_worksheet.md`
> **Engine docs:** `docs/product/first_principles_playbook.md`, `docs/product/socratic_first_principles_rnd_workflow.md`
> **Stage 2 hand-off:** `docs/product/first_principles_sprint_manual.md` (commercial validation, NOT loaded by this skill)

## When to use

Load this skill whenever:
- A user describes a complaint, gripe, or "wouldn't it be cool if…" idea
- A PM/founder asks whether a pain point is **real**, not whether it's **profitable**
- You're about to brainstorm features before validating the underlying pain
- You hear claims like "the market needs X" without named people behind it
- A pain point is going from teaching mode (workshop) to production mode (R&D)

**Do NOT skip when:**
- The complaint sounds obviously true (obvious complaints have hidden assumptions)
- The user already has a "score" from another tool (scores are anxiety products, not decision inputs — see `first_principles_playbook.md §7 反模式 A`)

**This skill does NOT cover:**
- Manual delivery design (Stage 2 — see sprint manual)
- Payment rail setup (Stage 2)
- Pre-sales / first-dollar capture (Stage 2)
- BCG DRI attack-layer decision (Stage 2 — applies AFTER pain is validated)

## The Iron Laws

```
1. Pain validation is INDEPENDENT from commercial validation.
2. Stage 1 outputs a written TRUE/FAKE verdict. NOT a payment.
3. NO step skipping. NO step's exit condition met → cannot advance.
4. NO money talk in Stage 1. If money comes up, it belongs in Stage 2.
```

## Architecture: Two Stages × Three Lenses × Two Engines

```
Stage 1 (this skill): PAIN DISCOVERY — no money
  ▸ 9 steps aligned with Sunny's workshop structure
  ▸ Lenses: SECI Externalize → TRIZ → SECI Combination → SECI Socialization
  ▸ Engines: First Principles (#1, #2 only) + Socratic (S1/S2)
  ▸ Endpoint: written true/fake verdict + Pain Quality Score (teaching) OR draft/structured (production)

Stage 2 (NOT in this skill): COMMERCIAL VALIDATION — money
  ▸ Physical quantities #3 (manual deliverable) + #4 (payment rail)
  ▸ BCG DRI attack layer
  ▸ 72-hour sprint → first real payment
  ▸ See: docs/product/first_principles_sprint_manual.md
```

## Physical Quantities (this skill uses #1, #2 only)

| # | Quantity | Check | Step | Stage |
| :-- | :--- | :--- | :--- | :--- |
| 1 | Specific people | Can you call 3 named individuals right now? | Step 2 | 1 ✓ |
| 2 | Pain w/ time/cost investment | Does the workaround have a name? | Step 2 | 1 ✓ |
| 3 | Manual deliverable | Can you do it tonight without code? | — | 2 (NOT here) |
| 4 | Payment rail | Do you have a shareable payment link now? | — | 2 (NOT here) |

**v2 wording fix:** #2 is "pain w/ time/cost investment" not "paying pain" — avoids implying you need a paying customer at the discovery stage.

## Socratic Templates

**S1 (Step 2):** Three elements required — Who / When / How observed.

**S2 (Step 9):** Three locked questions:
1. **Falsifiability:** What evidence would make me drop this pain?
2. **Alternative cause:** Is this actually a different pain in disguise?
3. **Definition drift:** Is the Step 1 pain owner still the Step 7 interview target?

## The Nine Steps — Run This as TodoWrite

When you load this skill, immediately create these 9 todos:

```
[ ] Step 1. 聆聽          — verbatim complaint + 1 specific scene
[ ] Step 2. 5 要素 + S1   — pain sentence + 5 elements + 3-person list + workaround name (#1, #2)
[ ] Step 3. 找矛盾 TRIZ   — pick 1 of 6 contradictions
[ ] Step 4. 選 AI 工具    — choose ChatGPT DR / Claude / Perplexity / Gemini
[ ] Step 5. AI 找證據     — run the 8-question evidence prompt (NO product/biz model)
[ ] Step 6. 自己先猜+讀 AI — write 3 guesses BEFORE reading AI; then compare deltas
[ ] Step 7. 規劃真人訪談   — pick 2 interview targets + 3 questions + interview taboos
[ ] Step 8. Pain Quality Score — 5 dims × 5 pts (teaching mirror only)
[ ] Step 9. 真/假判斷 + S2 — written verdict + 3 S2 answers + next action
```

Mark each todo `in_progress` on entry, `completed` only when its exit condition passes.

### Step exit conditions (the gates)

| Step | Exit condition |
| :--- | :--- |
| 1 | At least one specific named person in the verbatim transcript |
| 2 | All 5 elements concrete (no "should" / "probably") + 3-person list + workaround has a name |
| 3 | Single contradiction label + both ends concretely described |
| 4 | AI tool chosen with 1-sentence reason |
| 5 | AI returned 8 answers + did NOT enter solution mode |
| 6 | 3 written guesses + 4 readability checkpoints passed + 3 deltas identified |
| 7 | At least 1 interview target with concrete contact + 3 non-pitch questions |
| 8 | All 5 dimensions scored + understands "score is mirror not verdict" |
| 9 | Written verdict (true/fake/pending-interview) + 3 S2 answers + 100-word reason + next action |

**Failure routing:**
- Step 2 fails → return to Step 1 (you haven't met real users)
- Step 3 fails → return to Step 2 (5 elements not concrete enough)
- Step 5 fails (AI suggests solutions) → re-prompt with stronger "no solutions" rule
- Step 6 fails (4 checkpoints fail) → return to Step 5, give AI more details
- Step 7 fails → return to Step 2 (you haven't met this community)
- Step 9 S2 reveals definition drift → return to drift point and rebuild

## TRIZ Six Contradictions (Step 3)

Pick exactly ONE. No multi-select.

| # | Contradiction |
| :-- | :--- |
| 1 | Speed vs Quality |
| 2 | Personalization vs Scale |
| 3 | Speed vs Accuracy |
| 4 | Expert capability vs Novice usability |
| 5 | Automation vs Human judgment |
| 6 | High-frequency experimentation vs Low risk |

## Step 5 Standard Prompt (copy-paste)

```
我想研究一個可能的痛點：
[Step 2 痛點句]

痛點主人翁特徵：[Step 2 具體人群]
他現在用：[Step 2 workaround]
不滿之處：[Step 2 現有解法不滿]
矛盾本質：[Step 3 TRIZ 標籤 + 兩端]

⚠️ 重要規則：
- 請不要幫我設計產品，也不要提出商業模式
- 請不要建議 App、SaaS、解決方案
- 請只做痛點探索與證據蒐集

請回答 8 題：
1. 哪些具體人群最常遇到？請列 3–5 群
2. 通常在什麼場景發生？頻率多高？
3. 他們現在怎麼解決？請列 5 個 workaround
4. 現有解法有哪些不滿？分成時間/品質/情緒/資料整理
5. 公開證據？論壇/社群/產業文章/工具評論/搜尋趨勢
6. 背後 JTBD 是什麼？
7. 哪些可能是假痛點？
8. 應該訪談哪 5 種人？每種人 3 題訪談問題

最後請用 1–5 分評估 5 維度並給總分。
不確定的標 [推測]。
```

## Step 6 Self-Guess Discipline

**BEFORE** reading the AI response, write down:
- Who do you guess is most pained?
- Which scenario do you guess is most painful?
- One possible fake pain you guess might exist?

**THEN** read the AI response with these 4 checkpoints:
1. Did it segment people specifically? (no "office workers")
2. Did it find observable scenarios? (time + place + action)
3. Did it list workaround dissatisfactions? (≥3 with reasons)
4. Did it flag possible fake pains? (≥1)

**THEN** identify 3 deltas: AI added what / AI missed what / your guess wrong where.

**Why guess first:** Reading AI directly creates "yes it's right!" illusion (AI just paraphrases your question). Pre-guess is the only way to train judgment.

## Output: Two Modes

### Teaching mode (workshop / beginner)

Output Pain Quality Score (5 dims × 5 pts = 25). Frame it as:

> "Pain Quality Score is the diagnostic mirror, NOT the verdict.
> A 24/25 pain can still be fake (no real interview yet).
> A 14/25 complaint can still be real (you haven't dug deep).
> The verdict comes from real interviews (Step 7), not the score."

5 dimensions:
1. People specificity (Step 2 + #1)
2. Frequency (Step 2)
3. Pain intensity (Step 2 cost + Step 3 TRIZ sharpness)
4. Workaround dissatisfaction (Step 2 + #2)
5. Evidence credibility (Step 5–7)

### Production mode (R&D / painmap system)

Output Validation Status. **NEVER output 0–25 scores in this mode** — it violates `painmap_moat_design.md M3 Anti-Score Brand`.

| Status | Entry condition | Stage |
| :--- | :--- | :--- |
| `draft` | Step 1 complete | 1 |
| `structured` | Step 1–9 all passed + true-pain verdict | 1 |
| `verified_interview` | Stage 2 sprint Hour 24–48: ≥5 interviews + red-team | 2 |
| `verified_payment` | Stage 2 sprint Hour 48–72: ≥1 real payment | 2 |

### Mode switch handover card

```
Pain: [Step 2 sentence]
Teaching mode score: [N / 25]
Production mode status: [draft | structured]
Verdict: [真痛點 | 假痛點 | 待訪談]
Reason: [Step 9 100-word reason]
Transition date: [YYYY-MM-DD]
Owner: [name]
Note: Score is for student reflection only; downstream decisions use Validation Status.
```

## Anti-patterns (Red flags — STOP if you see these)

| Pattern | Symptom | Fix |
| :--- | :--- | :--- |
| **Stage-skip (NEW v2)** | "Let me design the manual delivery now" before Step 9 verdict | Stage 1 must complete with written verdict before Stage 2 begins |
| **Money in Stage 1** | "What's my pricing?" / "Where do I put the payment link?" | Block — that's Stage 2. Continue with current step. |
| **Step-skip** | "This needs Reshape" before Step 5/6 evidence | DRI is Stage 2. Force written output at every Stage 1 step |
| **Single-lens fixation** | Forcing every pain into TRIZ #2 | Step 9 S2 alt-cause check — if can't list 1 alt, lens failed |
| **Score-as-decision (IdeaCheck disease)** | "Score = 24, let's build" | Mode switch card mandatory; production mode = status not score |
| **AI-flattery** | Asking AI "is this a real pain?" | Step 9 verdict must be human-written; AI may red-team but not generate |
| **Synthetic persona** | Skipping real interviews via AI personas | Step 1 hard gate: real named person; Step 7 must come from Step 2 list |
| **Solution-jump in Step 5** | AI prompt response includes "you should build…" | Re-prompt with stronger "no solutions" rule |

## Quick reference card (paste at top of session)

```
ENGINES (every step):
  S1: who/when/how-observed
  S2: falsifiability / alt-cause / drift
  PQ: #1 specific people / #2 paying pain (Stage 1 only — #3, #4 in Stage 2)

LENSES (in order):
  Step 1+2 SECI Socialization+Externalization
  Step 3 TRIZ → 1 of 6 contradictions
  Step 5 SECI Combination (AI evidence)
  Step 6 Socratic self-articulation BEFORE reading AI
  Step 7 SECI Socialization confirmation (real interviews)

EXIT: Stage 1 ends with WRITTEN TRUE/FAKE VERDICT, not payment.
NEXT: True verdict → Stage 2 sprint manual (NOT this skill).
```

## When to defer to other skills

- **Pain confirmed true, ready for commercial validation** → load `first_principles_sprint_manual.md` (Stage 2)
- **Need to design disruptive GTM** → see `painmap_disruption_framework.md` (post-Stage 2)
- **Need to design moat strategy** → see `painmap_moat_design.md`
- **Pain confirmed, ready to code product** → only after Stage 2 verifies payment; load `superpowers:test-driven-development`

## Verification

After running this skill end-to-end on a pain, verify:
- [ ] All 9 todos completed in order (no jumps)
- [ ] Each step has written output
- [ ] Physical quantities #1, #2 each checked (NOT #3, #4 — those are Stage 2)
- [ ] Step 9 has written true/fake verdict + 100-word reason
- [ ] Mode switch card written if transitioning teaching → production
- [ ] No 0–25 score appears in any production-mode output
- [ ] No "let's build it" / "set up payment" suggested in Stage 1

If any item fails, the diagnosis is incomplete — do not claim the pain is validated.

## Why two stages (v2 design rationale)

v1 of this skill mixed pain discovery with commercial validation in a single 7-step flow. This caused:
- Beginners scared off by "set up payment link" demands at Step 4
- AI guidance violated (prompts kept jumping to "let's build")
- Judgment training lost (true/fake verdict swallowed by "can it pay?")

v2 enforces two-stage split because **pain validity** and **commercial viability** are independent questions:
- A real pain may not be a good business
- A fake pain cannot be a good business
- Stage 1 fails → Stage 2 wastes 72 hours on the wrong question
- Stage 1 passes → Stage 2 still might fail, but at least on the right question

This is the same separation Sunny uses in the workshop: 1-hour pain finding, 72-hour homework = "submit only the verdict, not the product, not the business model."
