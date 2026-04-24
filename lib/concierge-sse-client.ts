/**
 * Consome a resposta SSE de POST /api/concierge/chat (eventos com `data: {…}`).
 * Chama onToken a cada token; onDone no fim; onError com mensagem se `type: error`.
 */
export async function consumeConciergeChatSse(
  res: Response,
  onToken: (t: string) => void,
  onDone: () => void,
  onError: (message: string) => void
): Promise<void> {
  if (!res.body) {
    onError("Resposta sem corpo.");
    return;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += dec.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const block of parts) {
        if (!block.trim()) continue;
        for (const line of block.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          let payload: { type?: string; t?: string; message?: string };
          try {
            payload = JSON.parse(json) as { type?: string; t?: string; message?: string };
          } catch {
            continue;
          }
          if (payload.type === "token" && typeof payload.t === "string") {
            onToken(payload.t);
          } else if (payload.type === "error") {
            onError(payload.message ?? "Erro desconhecido");
            return;
          } else if (payload.type === "done") {
            onDone();
            return;
          }
        }
      }
    }
    onDone();
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw e;
    }
    onError(e instanceof Error ? e.message : "Leitura interrompida");
  }
}
