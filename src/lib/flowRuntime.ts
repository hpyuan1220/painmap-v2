import type { FlowAiSession, FlowAiTurn, PainCard } from "@/types/painCard";

export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    if (Array.isArray(acc) && /^\d+$/.test(key)) return acc[Number(key)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

export function stringifyFieldValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          return Object.values(item as Record<string, unknown>)
            .filter(Boolean)
            .join("｜");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (value == null) return "";
  return String(value);
}

export function ensureFlowSession(card: PainCard, key: string): FlowAiSession {
  return (
    card.flow_ai_sessions?.[key] ?? {
      inlineTurns: [],
      deepChatDraft: "",
      deepChatTurns: [],
      acceptedSuggestionIds: [],
    }
  );
}

export function appendFlowTurn(
  card: PainCard,
  key: string,
  turn: FlowAiTurn,
  mode: "inline" | "deep",
): Record<string, FlowAiSession> {
  const existing = ensureFlowSession(card, key);
  return {
    ...(card.flow_ai_sessions ?? {}),
    [key]: {
      ...existing,
      inlineTurns: mode === "inline" ? [...existing.inlineTurns, turn] : existing.inlineTurns,
      deepChatTurns: mode === "deep" ? [...existing.deepChatTurns, turn] : existing.deepChatTurns,
    },
  };
}

export function markAcceptedSuggestion(
  card: PainCard,
  key: string,
  suggestionId: string,
): Record<string, FlowAiSession> {
  const existing = ensureFlowSession(card, key);
  return {
    ...(card.flow_ai_sessions ?? {}),
    [key]: {
      ...existing,
      acceptedSuggestionIds: Array.from(new Set([...existing.acceptedSuggestionIds, suggestionId])),
    },
  };
}
