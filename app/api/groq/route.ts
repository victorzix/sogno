import { generateResponse, getModels } from "@/lib/groq";
import {
  checkRateLimit,
  getClientIpFromRequest,
  rateGroqGet,
  rateGroqPost,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rl = checkRateLimit(`groq:post:${ip}`, rateGroqPost.max, rateGroqPost.windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em breve.", retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const msg =
    typeof b?.message === "string" ? b.message : typeof b?.input === "string" ? b.input : null;

  if (!msg?.trim()) {
    return NextResponse.json(
      { error: "Send a JSON body with a string `message` or `input`." },
      { status: 400 },
    );
  }

  try {
    const completion = await generateResponse(msg);
    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({
      text,
      model: completion.model,
      id: completion.id,
      usage: completion.usage,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Groq request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rl = checkRateLimit(`groq:get:${ip}`, rateGroqGet.max, rateGroqGet.windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em breve.", retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  try {
    const data = await getModels();
    return NextResponse.json({
      data
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Groq request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}