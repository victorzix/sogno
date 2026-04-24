import type { ConciergeMessage } from "@/lib/concierge-messages";

const VERSION = 2;
const LEGACY_VERSION = 1;
const NS = "sogno:concierge:product";

function key(userId: string, productId: string): string {
  return `${NS}:v${VERSION}:${userId}:${productId}`;
}

function legacyKey(userId: string, productId: string): string {
  return `${NS}:v${LEGACY_VERSION}:${userId}:${productId}`;
}

/** v1: JSON array of messages. v2: { chatId, messages }. O id identifica a conversa na app; o Groq não usa este id. */
export type ProductConciergeCachePayload = { chatId: string; messages: ConciergeMessage[] };

function isMessage(x: unknown): x is ConciergeMessage {
  return (
    x != null &&
    typeof x === "object" &&
    typeof (x as ConciergeMessage).id === "string" &&
    ((x as ConciergeMessage).role === "user" || (x as ConciergeMessage).role === "assistant") &&
    typeof (x as ConciergeMessage).text === "string"
  );
}

function parsePayload(parsed: unknown): ProductConciergeCachePayload | null {
  if (Array.isArray(parsed)) {
    const messages = parsed.filter(isMessage).map((m) => ({ id: m.id, role: m.role, text: m.text }));
    if (messages.length === 0) return null;
    return { chatId: crypto.randomUUID(), messages };
  }
  if (parsed && typeof parsed === "object" && "messages" in parsed) {
    const p = parsed as { chatId?: unknown; messages?: unknown };
    if (typeof p.chatId !== "string" || p.chatId.length < 8) return null;
    if (!Array.isArray(p.messages)) return null;
    const messages = p.messages.filter(isMessage).map((m) => ({ id: m.id, role: m.role, text: m.text }));
    return { chatId: p.chatId, messages };
  }
  return null;
}

/** Sem dados guardados: `null` (o widget cria `chatId` e persiste com a 1.ª bolha). */
export function loadProductConciergeCache(
  userId: string,
  productId: string
): ProductConciergeCachePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const k = key(userId, productId);
    const raw = localStorage.getItem(k);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      return parsePayload(parsed);
    }
    const legacy = localStorage.getItem(legacyKey(userId, productId));
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      const migrated = parsePayload(parsed);
      if (migrated) {
        try {
          localStorage.setItem(k, JSON.stringify(migrated));
          localStorage.removeItem(legacyKey(userId, productId));
        } catch {
          // ignore
        }
        return migrated;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProductConciergeCache(
  userId: string,
  productId: string,
  payload: ProductConciergeCachePayload
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(userId, productId), JSON.stringify(payload));
  } catch {
    // quota / private mode
  }
}

export function clearProductConciergeCache(userId: string, productId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key(userId, productId));
    localStorage.removeItem(legacyKey(userId, productId));
  } catch {
    // ignore
  }
}
