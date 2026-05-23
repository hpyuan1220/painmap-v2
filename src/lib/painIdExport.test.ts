/**
 * painIdExport.test — pure-function tests for the Pain ID export pipeline.
 *
 * Coverage:
 * - generatePainId() shape
 * - isReadyForExport() against partial and complete cards
 * - toMarkdown() includes the right sections from data_model.md §匯出格式
 * - toJson() round-trips a card
 */

import { describe, expect, it } from "vitest";

import {
  generatePainId,
  isReadyForExport,
  toEmailHref,
  toJson,
  toMarkdown,
} from "@/lib/painIdExport";
import { emptyPainCard } from "@/store/painCard";

describe("generatePainId", () => {
  it("returns a pid-YYYYMMDD-<6chars> shape", () => {
    const id = generatePainId();
    expect(id).toMatch(/^pid-\d{8}-[a-z0-9]{6}$/);
  });

  it("returns a different id each call", () => {
    const a = generatePainId();
    const b = generatePainId();
    expect(a).not.toBe(b);
  });
});

describe("isReadyForExport", () => {
  it("rejects an empty card", () => {
    expect(isReadyForExport(emptyPainCard())).toBe(false);
  });

  it("requires story_one_liner + next_step_note + next_step_hint", () => {
    const card = emptyPainCard();
    card.result.story_one_liner = "我聽到了一段卡住的故事";
    expect(isReadyForExport(card)).toBe(false);

    card.result.next_step_note = "再找兩位老師聊";
    expect(isReadyForExport(card)).toBe(false);

    card.result.next_step_hint = "continue_listening";
    expect(isReadyForExport(card)).toBe(true);
  });
});

describe("toMarkdown", () => {
  it("starts with # Pain ID header", () => {
    const card = emptyPainCard();
    card.result.pain_id = "pid-test-abc123";
    const md = toMarkdown(card);
    expect(md.startsWith("# Pain ID · pid-test-abc123")).toBe(true);
  });

  it("falls back to (unassigned) when pain_id is empty", () => {
    const md = toMarkdown(emptyPainCard());
    expect(md).toContain("# Pain ID · (unassigned)");
  });

  it("renders complaint as blockquote with attribution", () => {
    const card = emptyPainCard();
    card.complaint.verbatim = "我每週六晚上要寫家長 LINE";
    card.complaint.source_name = "林老師";
    card.complaint.datetime = "2026-03-15";
    const md = toMarkdown(card);
    expect(md).toContain("> 我每週六晚上要寫家長 LINE");
    expect(md).toContain("> — 林老師，2026-03-15");
  });

  it("includes empathy map only when at least one cell is filled", () => {
    const card = emptyPainCard();
    expect(toMarkdown(card)).not.toContain("## 心情地圖");
    card.empathy_map.think = "想多睡";
    expect(toMarkdown(card)).toContain("## 心情地圖");
  });

  it("includes the user-written next step note", () => {
    const card = emptyPainCard();
    card.result.next_step_note = "再找兩位老師聊";
    const md = toMarkdown(card);
    expect(md).toContain("## 我的下一步");
    expect(md).toContain("再找兩位老師聊");
  });

  it("does not leak v2 verdict / 真痛點 / 評分 wording", () => {
    const card = emptyPainCard();
    card.complaint.verbatim = "test";
    card.complaint.source_name = "x";
    card.complaint.datetime = "y";
    const md = toMarkdown(card);
    for (const banned of ["真痛點", "假痛點", "評分", "分數", "驗證", "過關"]) {
      expect(md.includes(banned)).toBe(false);
    }
  });
});

describe("toJson", () => {
  it("produces valid JSON", () => {
    const json = toJson(emptyPainCard());
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("round-trips the schema_version", () => {
    const card = emptyPainCard();
    const parsed = JSON.parse(toJson(card));
    expect(parsed.schema_version).toBe("3.0");
  });
});

describe("toEmailHref", () => {
  it("builds a prefilled email draft for the Pain ID card", () => {
    const card = emptyPainCard();
    card.result.pain_id = "pid-test-abc123";
    card.result.story_one_liner = "我聽到了一段卡住的故事";
    card.result.next_step_hint = "continue_listening";
    card.result.next_step_note = "再找兩位老師聊";

    const href = toEmailHref(card, "hpyuan1220@gmail.com");
    const decoded = decodeURIComponent(href);

    expect(href).toContain("mailto:hpyuan1220%40gmail.com");
    expect(decoded).toContain("PainMap Pain ID · pid-test-abc123");
    expect(decoded).toContain("# Pain ID · pid-test-abc123");
    expect(decoded).toContain("我聽到了一段卡住的故事");
  });
});
