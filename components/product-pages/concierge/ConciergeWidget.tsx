"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import type { ConciergeMessage } from "@/lib/concierge-messages";
import { consumeConciergeChatSse } from "@/lib/concierge-sse-client";
import {
  loadProductConciergeCache,
  saveProductConciergeCache,
} from "@/lib/concierge-product-chat-cache";
import { useProductPageChat } from "./ProductPageChatContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.75 };

function buildContextualUserMessage(
  productName: string,
  productId: string,
  opts: { variantName?: string | null; variantId?: string | null } | undefined,
  userInput: string
) {
  const parts = [
    `[Contexto: ficha do produto "${productName}" (ref. ${productId})]`,
    opts?.variantName
      ? `Opção de interesse: "${opts.variantName}"${opts.variantId ? ` (${opts.variantId})` : ""}.`
      : null,
    "",
    userInput.trim(),
  ].filter(Boolean) as string[];
  return parts.join("\n");
}

/** Enquanto o Groq gera a 1.ª mensagem (não é “carregar” cache em disco). */
function GreetingTypingPlaceholder({ reduceMotion }: { reduceMotion: boolean | null }) {
  const bubble =
    "mr-auto max-w-[92%] rounded-2xl bg-surface-container-high px-3 py-2.5 font-sans shadow-sm";
  if (reduceMotion) {
    return (
      <div className={bubble}>
        <p className="text-sm text-stone-600">Digitando…</p>
      </div>
    );
  }
  return (
    <div className={bubble} role="status" aria-live="polite">
      <span className="sr-only">Concierge está escrevendo</span>
      <div className="flex h-5 items-center gap-1.5 px-0.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-stone-400"
            animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }}
            transition={{
              repeat: Infinity,
              duration: 0.55,
              delay: i * 0.14,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Pontos animados dentro da bolha do assistente enquanto o stream ainda não mandou texto. */
function InlineReplyTypingDots({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) {
    return <span className="text-xs text-stone-500">Digitando…</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 py-0.5" role="status" aria-live="polite">
      <span className="sr-only">Concierge está respondendo</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-stone-400/90"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 0.55,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function ConciergeWidget() {
  const { isOpen, close, toggle, product, lastOpenOptions } = useProductPageChat();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const authModalOpen = useAuthStore((s) => s.authModalOpen);
  const reduceMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  /** Identificador local da conversa (útil para "nova conversa" ou sync; o Groq não usa este id). */
  const [chatId, setChatId] = useState<string | null>(null);
  const [cacheReady, setCacheReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  /** Uma requisição de cada vez (independe de re-renders do `sending`). */
  const inFlightRef = useRef(false);
  const abortStreamRef = useRef<AbortController | null>(null);
  const titleId = useId();
  const descId = useId();

  // Carregar cache; se vazio, saudação inicial via Groq (1 chamada) + persistência
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setMessages([]);
      setChatId(null);
      setCacheReady(true);
      return;
    }

    const stored = loadProductConciergeCache(user.id, product.id);
    if (stored && stored.messages.length > 0) {
      setMessages(stored.messages);
      setChatId(stored.chatId);
      setCacheReady(true);
      return;
    }

    setChatId(crypto.randomUUID());
    setCacheReady(false);
    const ac = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/concierge/greeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: product.name, displayName: user.name }),
          signal: ac.signal,
        });
        const data = (await res.json()) as { text?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "greeting");
        }
        const text = data.text?.trim();
        if (!text) {
          throw new Error("empty");
        }
        if (cancelled || ac.signal.aborted) return;
        setMessages((prev) => {
          if (prev.length > 0) return prev;
          return [
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text,
            },
          ];
        });
      } catch {
        if (cancelled || ac.signal.aborted) return;
        const fn = user.name.trim().split(/\s+/)[0] || "Olá";
        setMessages((prev) => {
          if (prev.length > 0) return prev;
          return [
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: `${fn}, vamos falar de ${product.name} — manda aí o que precisa que eu te ajudo a ajustar os detalhes.`,
            },
          ];
        });
      } finally {
        if (!cancelled) {
          setCacheReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [isAuthenticated, user?.id, user?.name, product.id, product.name]);

  /** Troca de ficha: cancelar stream/chat do produto anterior e libertar envio (`inFlightRef` / `sending`). */
  useEffect(() => {
    inFlightRef.current = false;
    setSending(false);
    abortStreamRef.current?.abort();
    abortStreamRef.current = null;
    setInput("");
    setError(null);
  }, [product.id]);

  // Persistir conversa
  useEffect(() => {
    if (!isAuthenticated || !user || !cacheReady || !chatId || messages.length === 0) return;
    saveProductConciergeCache(user.id, product.id, { chatId, messages });
  }, [messages, chatId, isAuthenticated, user?.id, product.id, cacheReady]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      const t = requestAnimationFrame(() => {
        if (isAuthenticated) inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(t);
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !authModalOpen) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close, authModalOpen]);

  useEffect(() => {
    if (isOpen) return;
    abortStreamRef.current?.abort();
    abortStreamRef.current = null;
  }, [isOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, isOpen]);

  const send = useCallback(async () => {
    if (!isAuthenticated || !user) {
      openAuthModal("login");
      return;
    }
    if (inFlightRef.current) {
      return;
    }
    const text = input.trim();
    if (!text) {
      return;
    }

    inFlightRef.current = true;
    setSending(true);
    setError(null);
    setInput("");

    const userMsg: ConciergeMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const asstId = crypto.randomUUID();
    const historyForApi = messages
      .filter((m) => m.text.trim().length > 0)
      .map((m) => ({ role: m.role, text: m.text.trim() }));
    setMessages((m) => [
      ...m,
      userMsg,
      { id: asstId, role: "assistant", text: "" },
    ]);

    const body = buildContextualUserMessage(
      product.name,
      product.id,
      lastOpenOptions,
      text
    );

    const ac = new AbortController();
    abortStreamRef.current = ac;
    const streamTimeoutMs = 180_000;
    const timeoutId = window.setTimeout(() => ac.abort(), streamTimeoutMs);

    try {
      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: body,
          history: historyForApi,
          productId: product.id,
        }),
        signal: ac.signal,
      });

      if (!res.ok) {
        let errMsg = `Não foi possível obter resposta. (${res.status})`;
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) errMsg = j.error;
        } catch {
          // ignore
        }
        setError(errMsg);
        setMessages((m) => m.filter((x) => x.id !== asstId));
        return;
      }

      if (!res.body) {
        setError("Resposta vazia.");
        setMessages((m) => m.filter((x) => x.id !== asstId));
        return;
      }

      await consumeConciergeChatSse(
        res,
        (t) => {
          setMessages((m) =>
            m.map((x) => (x.id === asstId ? { ...x, text: x.text + t } : x))
          );
        },
        () => {
          // done
        },
        (em) => {
          setError(em);
          setMessages((m) =>
            m.map((x) =>
              x.id === asstId
                ? { ...x, text: x.text ? `${x.text}\n\n(${em})` : em }
                : x
            )
          );
        }
      );
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setMessages((m) => m.filter((x) => x.id !== asstId));
        return;
      }
      setError("Falha de rede.");
      setMessages((m) => m.filter((x) => x.id !== asstId));
    } finally {
      window.clearTimeout(timeoutId);
      inFlightRef.current = false;
      setSending(false);
      if (abortStreamRef.current === ac) {
        abortStreamRef.current = null;
      }
    }
  }, [
    messages,
    product.id,
    product.name,
    lastOpenOptions,
    isAuthenticated,
    user?.id,
    user?.name,
    openAuthModal,
  ]);

  const panelInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.86, y: 28 };
  const panelAnimate = { opacity: 1, scale: 1, y: 0 };
  const panelExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.92, y: 20 };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            key="concierge-backdrop"
            type="button"
            aria-label="Fechar chat"
            className="fixed inset-0 z-[85] cursor-default bg-on-surface/20 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <div
        className="pointer-events-none fixed bottom-5 right-4 z-[100] flex max-w-[calc(100vw-1.25rem)] flex-col items-end gap-3 md:bottom-8 md:right-8"
        role="none"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="concierge-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className="pointer-events-auto flex max-h-[min(70svh,28rem)] w-[min(100%,22rem)] flex-col overflow-hidden rounded-3xl border border-outline/15 bg-surface/95 text-left shadow-[0_-8px_40px_-8px_rgba(117,88,80,0.18),0_24px_48px_-12px_rgba(0,0,0,0.12)] ring-1 ring-primary/5 backdrop-blur-xl"
              style={{ transformOrigin: "bottom right" }}
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelExit}
              transition={reduceMotion ? { duration: 0.2 } : spring}
            >
              <div className="flex items-start justify-between gap-2 border-b border-outline/10 bg-surface-container-low/60 px-3 py-2.5">
                <div className="min-w-0">
                  <h2 id={titleId} className="font-serif text-base text-on-surface">
                    Concierge
                  </h2>
                  <p id={descId} className="line-clamp-2 text-[11px] text-stone-500 font-sans">
                    {product.name}
                    {lastOpenOptions?.variantName ? ` · ${lastOpenOptions.variantName}` : ""}
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={close}
                  className="shrink-0 rounded-full p-1.5 text-stone-500 transition-colors hover:bg-primary/5 hover:text-on-surface"
                  aria-label="Fechar"
                  whileTap={{ scale: 0.92 }}
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden>
                    close
                  </span>
                </motion.button>
              </div>

              <div
                ref={listRef}
                className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3"
              >
                {!isAuthenticated && (
                  <div className="space-y-3 text-center text-sm text-on-surface-variant font-sans">
                    <p className="leading-relaxed">
                      O concierge e a personalização com IA ficam disponíveis depois do login.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full h-12 text-xs uppercase tracking-widest"
                      onClick={() => openAuthModal("login")}
                    >
                      Entrar ou cadastrar
                    </Button>
                  </div>
                )}

                {isAuthenticated && !cacheReady && (
                  <GreetingTypingPlaceholder reduceMotion={reduceMotion} />
                )}

                {isAuthenticated &&
                  cacheReady &&
                  messages.map((m, i) => {
                    const awaitingStream =
                      sending &&
                      i === messages.length - 1 &&
                      m.role === "assistant" &&
                      m.text.trim() === "";
                    return (
                      <motion.div
                        key={m.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ ...spring, delay: reduceMotion ? 0 : Math.min(i * 0.03, 0.12) }}
                        className={cn(
                          "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                          m.role === "user"
                            ? "ml-auto bg-primary text-on-primary font-sans"
                            : "mr-auto bg-surface-container-high text-on-surface font-sans"
                        )}
                      >
                        {m.role === "assistant" && awaitingStream ? (
                          <InlineReplyTypingDots reduceMotion={reduceMotion} />
                        ) : (
                          m.text
                        )}
                      </motion.div>
                    );
                  })}

                {error && !sending && isAuthenticated && (
                  <p className="text-[11px] text-red-600 font-sans">{error}</p>
                )}
              </div>

              <div className="border-t border-outline/10 bg-surface-container-low/40 p-2.5">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isAuthenticated) {
                          openAuthModal("login");
                          return;
                        }
                        if (sending) return;
                        void send();
                      }
                    }}
                    rows={1}
                    placeholder={
                      isAuthenticated
                        ? "Sua mensagem…"
                        : "Faça login para escrever…"
                    }
                    disabled={!isAuthenticated || sending}
                    className="min-h-0 max-h-28 flex-1 resize-y rounded-2xl border-0 bg-surface/90 px-3 py-1.5 text-sm leading-snug text-on-surface ring-1 ring-inset ring-outline/12 focus:ring-2 focus:ring-primary/30 font-sans disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!isAuthenticated) {
                        openAuthModal("login");
                        return;
                      }
                      void send();
                    }}
                    disabled={!isAuthenticated ? false : sending || !input.trim()}
                    className="!h-10 !w-10 !min-h-0 !min-w-0 shrink-0 self-end rounded-full !p-0"
                    aria-label={isAuthenticated ? "Enviar mensagem" : "Entrar"}
                  >
                    <span className="material-symbols-outlined text-[22px] leading-none" aria-hidden>
                      {isAuthenticated ? "send" : "login"}
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => toggle()}
          className={cn(
            "pointer-events-auto flex max-w-full items-center justify-center gap-2 rounded-full border border-primary/10 bg-surface-container-lowest whisper-shadow text-primary",
            "px-2 py-2 sm:pl-3 sm:pr-2",
            isOpen && "ring-2 ring-primary/25"
          )}
          aria-pressed={isOpen}
          aria-label={isOpen ? "Fechar concierge" : "Abrir chat do concierge"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="hidden min-w-0 truncate pl-1 font-sans text-[10px] font-medium uppercase tracking-widest text-primary sm:block">
            Concierge
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "ic-close" : "ic-chat"}
              className="material-symbols-outlined text-2xl sm:shrink-0"
              aria-hidden
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.75, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.75, opacity: 0, rotate: 45 }}
              transition={reduceMotion ? { duration: 0.12 } : { ...spring, duration: 0.22 }}
            >
              {isOpen ? "close" : "chat_bubble"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
