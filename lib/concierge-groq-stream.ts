import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionChunk,
} from "groq-sdk/resources/chat/completions";
import { CONCIERGE_PRODUCT_TOOLS, executeGetProductDetailsTool } from "@/lib/concierge-tools";
import { CONCIERGE_CHAT_SYSTEM, groq } from "@/lib/groq";

const MAX_TOOL_ROUNDS = 5;

/**
 * Modelo com loop clássico tool_calls no cliente.
 * `compound-beta-mini` orquestra tools no servidor e não encaixa no nosso loop manual.
 */
const CONCIERGE_TOOLS_STREAM_MODEL = "llama-3.1-8b-instant" as const;

const SYSTEM_WITH_TOOLS = `${CONCIERGE_CHAT_SYSTEM}

Você tem a ferramenta get_product_details para dados factuais desta ficha (variantes, preços, quantidade mínima, descontos por volume, imagem). Chame quando precisar informar ou confirmar números, listas de opções ou descontos. Nunca invente preço ou variante que não venha do resultado da ferramenta.`;

type ToolAccRow = { id: string; name: string; args: string };

function mergeToolCallDelta(
  acc: Map<number, ToolAccRow>,
  chunk: ChatCompletionChunk
): void {
  const delta = chunk.choices[0]?.delta;
  const tcs = delta?.tool_calls;
  if (!tcs?.length) return;
  for (const tc of tcs) {
    const idx = typeof tc.index === "number" ? tc.index : 0;
    let row = acc.get(idx);
    if (!row) {
      row = { id: "", name: "", args: "" };
      acc.set(idx, row);
    }
    if (tc.id) row.id = tc.id;
    if (tc.function?.name) row.name = tc.function.name;
    if (tc.function?.arguments) row.args += tc.function.arguments;
  }
}

function toolAccToMessageToolCalls(acc: Map<number, ToolAccRow>): ChatCompletionMessageToolCall[] {
  const sorted = [...acc.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
  return sorted.map((row, i) => ({
    id: row.id || `call_${i}_${crypto.randomUUID()}`,
    type: "function" as const,
    function: {
      name: row.name || "get_product_details",
      arguments: row.args.trim() || "{}",
    },
  }));
}

/**
 * Stream de resposta do concierge com suporte a tool calls (loop até texto final).
 */
export async function streamConciergeChatWithTools(
  conversationMessages: ChatCompletionMessageParam[],
  productId: string,
  onToken: (t: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_WITH_TOOLS },
    ...conversationMessages,
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const stream = await groq.chat.completions.create(
      {
        model: CONCIERGE_TOOLS_STREAM_MODEL,
        messages,
        tools: CONCIERGE_PRODUCT_TOOLS,
        tool_choice: "auto",
        stream: true,
        temperature: 0.65,
        max_tokens: 2048,
      },
      { signal }
    );

    let assistantContent = "";
    const toolAcc = new Map<number, ToolAccRow>();
    let finishReason: "stop" | "length" | "tool_calls" | "function_call" | null = null;

    for await (const chunk of stream) {
      const choice = chunk.choices[0];
      if (!choice) continue;
      if (choice.finish_reason != null) finishReason = choice.finish_reason;
      const d = choice.delta;
      if (d.content) {
        assistantContent += d.content;
        onToken(d.content);
      }
      mergeToolCallDelta(toolAcc, chunk);
    }

    if (finishReason !== "tool_calls") {
      return;
    }

    const toolCalls = toolAccToMessageToolCalls(toolAcc);
    if (toolCalls.length === 0) {
      return;
    }

    messages.push({
      role: "assistant",
      content: assistantContent.length > 0 ? assistantContent : null,
      tool_calls: toolCalls,
    });

    for (const tc of toolCalls) {
      const name = tc.function.name;
      let content: string;
      if (name === "get_product_details") {
        content = await executeGetProductDetailsTool(productId, tc.function.arguments);
      } else {
        content = JSON.stringify({ ok: false, error: "ferramenta_desconhecida", name });
      }
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content,
      });
    }
  }

  throw new Error(
    "O concierge atingiu o limite de consultas à ficha. Recarregue a página ou tente de novo."
  );
}
