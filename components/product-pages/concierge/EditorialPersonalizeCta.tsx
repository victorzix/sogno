"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useProductPageChat } from "./ProductPageChatContext";
import { cn } from "@/lib/utils";

export function EditorialPersonalizeCta() {
  const { isOpen, toggle } = useProductPageChat();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  return (
    <div className="w-full max-w-sm mx-auto pt-2">
      <button
        type="button"
        onClick={() => {
          if (!isAuthenticated) {
            openAuthModal("login");
            return;
          }
          toggle();
        }}
        className={cn(
          "w-full rounded-full bg-primary text-on-primary py-3 font-sans uppercase tracking-[0.12rem] text-sm whisper-shadow transition-all hover:bg-primary/90",
          isOpen && "ring-2 ring-on-primary/30"
        )}
        aria-pressed={isOpen}
      >
        Personalizar
      </button>
    </div>
  );
}
