import { headers } from "next/headers";

type WindowEntry = { count: number; reset: number };

const store = new Map<string, WindowEntry>();

/** Em serverless, cada instância tem o seu contador; para limite global usa Redis/Upstash. */
function touchStore() {
  const now = Date.now();
  for (const [k, e] of store) {
    if (e.reset < now) store.delete(k);
  }
}

export function getClientIpFromRequest(request: Request): string {
  const h = request.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || "unknown";
}

export async function getClientIpFromAction(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  if (max <= 0) return { ok: true };
  touchStore();
  const now = Date.now();
  let e = store.get(key);

  if (!e || now >= e.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }

  if (e.count >= max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((e.reset - now) / 1000)) };
  }

  e.count += 1;
  return { ok: true };
}

const MINUTE = 60_000;
const QUARTER_HOUR = 15 * 60_000;

export const rateAuthLogin = { max: 5, windowMs: QUARTER_HOUR } as const;
export const rateAuthRegister = { max: 3, windowMs: QUARTER_HOUR } as const;
export const rateGroqPost = { max: 30, windowMs: MINUTE } as const;
export const rateGroqGet = { max: 60, windowMs: MINUTE } as const;
