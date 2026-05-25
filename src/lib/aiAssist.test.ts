import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAiDirections, fetchAiDrill } from "@/lib/aiAssist";

function mockFetch(impl: () => Promise<Response> | Response) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchAiDirections", () => {
  it("returns directions on a 200 response", async () => {
    const directions = [
      { id: "d1", title: "發音焦慮", description: "怕講錯被笑", why_it_matters: "" },
    ];
    mockFetch(() => new Response(JSON.stringify({ directions }), { status: 200 }));

    const result = await fetchAiDirections({ complaint: "我不敢講英文" });
    expect(result).toEqual({ ok: true, directions });
  });

  it("signals fallback when the backend is not configured (501)", async () => {
    mockFetch(() => new Response(JSON.stringify({ error: "ai_not_configured" }), { status: 501 }));

    const result = await fetchAiDirections({ complaint: "我不敢講英文" });
    expect(result).toEqual({ ok: false, reason: "not_configured" });
  });

  it("signals fallback when the network throws", async () => {
    mockFetch(() => Promise.reject(new Error("offline")));

    const result = await fetchAiDirections({ complaint: "我不敢講英文" });
    expect(result).toEqual({ ok: false, reason: "network" });
  });

  it("signals fallback when the response has no directions", async () => {
    mockFetch(() => new Response(JSON.stringify({ directions: [] }), { status: 200 }));

    const result = await fetchAiDirections({ complaint: "我不敢講英文" });
    expect(result).toEqual({ ok: false, reason: "error" });
  });
});

describe("fetchAiDrill", () => {
  const input = {
    complaint: "我不敢講英文",
    directionTitle: "發音焦慮",
    directionDescription: "怕講錯被笑",
    question: "是不是發音沒把握？",
  };

  it("returns the AI response on a 200", async () => {
    mockFetch(() => new Response(JSON.stringify({ ai_response: "聽起來像…那你下一輪想問什麼？" }), { status: 200 }));

    const result = await fetchAiDrill(input);
    expect(result).toEqual({ ok: true, aiResponse: "聽起來像…那你下一輪想問什麼？" });
  });

  it("signals fallback on 501", async () => {
    mockFetch(() => new Response("{}", { status: 501 }));

    const result = await fetchAiDrill(input);
    expect(result).toEqual({ ok: false, reason: "not_configured" });
  });

  it("signals fallback on a 502 error", async () => {
    mockFetch(() => new Response(JSON.stringify({ error: "ai_failed" }), { status: 502 }));

    const result = await fetchAiDrill(input);
    expect(result).toEqual({ ok: false, reason: "error" });
  });
});
