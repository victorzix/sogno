import { generateConciergeGreetingMessage } from "@/lib/groq";
import { checkRateLimit, getClientIpFromRequest, rateGroqPost } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function firstName(raw: string): string {
  const t = raw.trim();
  if (!t) return "aí";
  return t.split(/\s+/)[0] ?? t;
}

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rl = checkRateLimit(`concierge:greeting:${ip}`, rateGroqPost.max, rateGroqPost.windowMs);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "Muitas requisições. Tente novamente em breve." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
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
  const productName = typeof b?.productName === "string" ? b.productName.trim() : "";
  const displayName = typeof b?.displayName === "string" ? b.displayName.trim() : "";

  if (!productName) {
    return new Response(JSON.stringify({ error: "productName é obrigatório." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const text = await generateConciergeGreetingMessage(
      productName,
      firstName(displayName || "aí")
    );
    if (!text) {
      return new Response(JSON.stringify({ error: "Resposta vazia do modelo." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao gerar saudação";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
