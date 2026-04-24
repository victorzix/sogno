import { User } from "@/generated/client";
import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const CHAT_MODEL = "compound-beta-mini" as const;

export async function generateResponse(msg: string, user?: User) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: msg,
        name: user?.name,
      },
    ],
    model: CHAT_MODEL,
    user: user?.id,
  });
}

export const CONCIERGE_CHAT_SYSTEM =
  "Você é o concierge da Sogni di Carta, papelaria artesanal. Responda em português brasileiro, de forma clara, calorosa e prática, sem parecer um robô. Evite markdown com títulos forçados; pode usar parágrafos curtos. Ajude a personalizar o produto e a esclarecer dúvidas.";

export type GroqChatTurn = { role: "user" | "assistant" | "system"; content: string };

/**
 * Uma conclusão curta para a 1.ª bolha (sem stream) — alinhada ao estilo do chat.
 */
export async function generateConciergeGreetingMessage(
  productName: string,
  firstName: string
): Promise<string> {
  const r = await groq.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.85,
    max_tokens: 220,
    messages: [
      {
        role: "system",
        content:
          "Você é o concierge da Sogni di Carta, papelaria artesanal. Escreva só a saudação ao cliente, em português brasileiro, em 2 a 4 frases, de forma natural e acolhedora. Sem markdown, listas, títulos ou cara de robô. Mencione o produto e o primeiro nome do cliente quando fizer sentido.",
      },
      {
        role: "user",
        content: `Primeiro nome: ${firstName}. Produto na ficha: ${productName}. Cumprimente, fale de personalizar e convide a fazer as perguntas que quiser.`,
      },
    ],
  });
  return (r.choices[0]?.message?.content ?? "").trim();
}

export async function getModels() {
  return groq.models.list();
}
