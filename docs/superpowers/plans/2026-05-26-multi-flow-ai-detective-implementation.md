# Multi-Flow AI Detective Worksheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or the Execute Plan phase of superpowers:sunnydata-design to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one public PainMap app that supports multiple worksheet flows, with a reusable flow architecture and a first 8-card AI detective flow whose AI interactions round-trip through an LLM and write accepted results back into the card.

**Architecture:** Keep the existing `PainCard` store as the base data model, add a flow registry plus config-driven step definitions on top, and render steps through shared flow components rather than per-card bespoke pages. AI interactions use a new flow-coach server function that receives step context and returns structured, actionable candidates that users can accept back into card state.

**Tech Stack:** TanStack Start, React, Zustand, existing local-storage persistence, existing server-function pattern, OpenAI server runtime, Vercel deployment.

---

### Task 1: Add planning artifacts

**Files:**
- Create: `docs/superpowers/plans/2026-05-26-multi-flow-ai-detective-implementation.md`

- [x] **Step 1: Write the implementation plan**
- [ ] **Step 2: Keep the plan aligned with actual implementation choices**

### Task 2: Extend the data model for flow-aware AI interactions

**Files:**
- Modify: `src/types/painCard.ts`
- Modify: `src/store/painCard.ts`

- [ ] **Step 1: Add flow-aware AI session/result types to `PainCard`**
- [ ] **Step 2: Add empty defaults in `emptyPainCard()`**
- [ ] **Step 3: Add migration logic for the new fields**
- [ ] **Step 4: Verify store updates still preserve timestamps and persistence**

### Task 3: Build the flow registry and shared step schema

**Files:**
- Create: `src/lib/worksheetFlowTypes.ts`
- Create: `src/lib/worksheetFlowRegistry.ts`

- [ ] **Step 1: Define step, field, validation, and AI action types**
- [ ] **Step 2: Define reusable flow registry lookup helpers**
- [ ] **Step 3: Add `worksheet-lite` config using the shared schema**
- [ ] **Step 4: Add `worksheet-ai-detective` 8-card config using the shared schema**

### Task 4: Build the server-side AI round-trip layer

**Files:**
- Create: `src/lib/flowCoach.server.ts`
- Create: `src/lib/flowCoach.ts`

- [ ] **Step 1: Define a structured response contract for flow coach outputs**
- [ ] **Step 2: Implement server function payload handling with OpenAI**
- [ ] **Step 3: Add safe fallback behavior when no API key / model call fails**
- [ ] **Step 4: Add client wrapper for invoking the server function**

### Task 5: Build reusable flow UI primitives

**Files:**
- Create: `src/components/flow/FlowLayout.tsx`
- Create: `src/components/flow/FlowProgressStepper.tsx`
- Create: `src/components/flow/FlowFieldRenderer.tsx`
- Create: `src/components/flow/FlowFooterNav.tsx`
- Create: `src/components/flow/AiCoachPanel.tsx`
- Create: `src/components/flow/AiDeepChatPanel.tsx`

- [ ] **Step 1: Extract a shared flow layout and progress UI**
- [ ] **Step 2: Create field renderer support for text, textarea, select, radio, people-list, and questions**
- [ ] **Step 3: Create inline AI coach panel with action buttons**
- [ ] **Step 4: Create deep chat panel with write-back actions**

### Task 6: Build the generic flow page/runtime

**Files:**
- Create: `src/components/flow/FlowStepPage.tsx`
- Create: `src/components/flow/FlowResultPage.tsx`
- Create: `src/lib/flowRuntime.ts`

- [ ] **Step 1: Resolve current flow and current step from route params**
- [ ] **Step 2: Bind configured fields to `PainCard` paths**
- [ ] **Step 3: Evaluate validation rules from config**
- [ ] **Step 4: Implement AI write-back actions into card state**
- [ ] **Step 5: Render result pages from flow config**

### Task 7: Add public multi-flow routes

**Files:**
- Create: `src/routes/learn.flow.tsx`
- Create: `src/routes/learn.flow.$flowId.tsx`
- Create: `src/routes/learn.flow.$flowId.$stepId.tsx`
- Create: `src/routes/learn.flow.$flowId.result.tsx`
- Modify: `src/routeTree.gen.ts`

- [ ] **Step 1: Add shared flow layout route**
- [ ] **Step 2: Add flow landing redirect route**
- [ ] **Step 3: Add dynamic step route**
- [ ] **Step 4: Add dynamic result route**
- [ ] **Step 5: Update route tree references**

### Task 8: Update the landing experience to choose flows

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`
- Modify: `src/components/landing/LandingPage.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Change homepage messaging from one 6-card CTA to multi-flow selection**
- [ ] **Step 2: Add clear entry points for 6-card and 8-card flows**
- [ ] **Step 3: Update homepage metadata for the broader multi-flow app**

### Task 9: Keep the old lite route working as a compatibility alias

**Files:**
- Modify: `src/lib/painCardLite.ts`
- Modify: `src/routes/learn.worksheet-lite*.tsx` as needed

- [ ] **Step 1: Point existing lite start helpers toward the shared flow system**
- [ ] **Step 2: Preserve existing external `/learn/worksheet-lite` access where practical**

### Task 10: Verify and deploy

**Files:**
- Modify: deployment/config files only if needed

- [ ] **Step 1: Run TypeScript checks**
- [ ] **Step 2: Sanity-check route wiring and shared flow rendering**
- [ ] **Step 3: Commit changes**
- [ ] **Step 4: Push to `hpyuan1220/painmap-v2`**
- [ ] **Step 5: Verify Vercel deployment**
