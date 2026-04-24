import { streamConciergeChatWithTools } from "@/lib/concierge-groq-stream";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { checkRateLimit, getClientIpFromRequest, rateGroqPost } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Máx. de mensagens anteriores (user+assistant) enviadas ao modelo, para caber no contexto. */
const MAX_PRIOR_MESSAGES = 32;

function parseHistoryItem(x: unknown): { role: "user" | "assistant"; text: string } | null {
  if (x == null || typeof x !== "object") return null;
  const o = x as { role?: unknown; text?: unknown };
  if (o.role !== "user" && o.role !== "assistant") return null;
  if (typeof o.text !== "string" || o.text.length > 32_000) return null;
  const text = o.text.trim();
  if (!text) return null;
  return { role: o.role, text };
}

/** Modelos tipo Llama esperam histórico útil a começar por `user` após o system. */
function stripLeadingAssistantPrefix<T extends { role: string }>(items: T[]): T[] {
  let i = 0;
  while (i < items.length && items[i].role === "assistant") i += 1;
  return items.slice(i);
}

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rl = checkRateLimit(`concierge:chat:sse:${ip}`, rateGroqPost.max, rateGroqPost.windowMs);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({
        error: "Muitas requisições. Tente novamente em breve.",
        retryAfterSec: rl.retryAfterSec,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const msg =
    typeof b?.message === "string" ? b.message : typeof b?.input === "string" ? b.input : null;

  if (!msg?.trim()) {
    return new Response(
      JSON.stringify({ error: "Envie `message` (string) no corpo." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const productId = typeof b?.productId === "string" ? b.productId.trim() : "";
  if (!productId) {
    return new Response(JSON.stringify({ error: "Envie `productId` (string) no corpo." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const historyRaw = b?.history;
  const historyItems: { role: "user" | "assistant"; text: string }[] = [];
  if (Array.isArray(historyRaw)) {
    for (const h of historyRaw) {
      const p = parseHistoryItem(h);
      if (p) historyItems.push(p);
    }
  }
  const trimmed =
    historyItems.length > MAX_PRIOR_MESSAGES
      ? historyItems.slice(-MAX_PRIOR_MESSAGES)
      : historyItems;
  const forModel = stripLeadingAssistantPrefix(trimmed);
  const conversationMessages: ChatCompletionMessageParam[] = [
    ...forModel.map((m) => ({ role: m.role, content: m.text } as const)),
    { role: "user", content: msg.trim() },
  ];

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const write = (obj: Record<string, unknown>) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      try {
        await streamConciergeChatWithTools(
          conversationMessages,
          productId,
          (t) => write({ type: "token", t })
        );
        write({ type: "done" });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Erro no modelo";
        write({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
