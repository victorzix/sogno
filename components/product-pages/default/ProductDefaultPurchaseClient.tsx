"use client";

import { type ReactNode } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useProductPageChat } from "../concierge/ProductPageChatContext";
import { formatBRL, variantLinePrice } from "@/lib/product-display";
import { cn } from "@/lib/utils";
import type { ProductPagePayload } from "../types";
import { ProductDefaultLeadBlock } from "./ProductDefaultLeadBlock";

type VariantRow = ProductPagePayload["variants"][number];

type Props = {
  product: ProductPagePayload;
  /** Ex.: &lt;ProductDefaultEssence /&gt; — só conteúdo adicional, depois do lead. */
  children?: ReactNode;
};

const personalizeBtn =
  "h-auto w-full rounded-full bg-primary text-on-primary py-6 font-sans uppercase tracking-[0.2rem] text-sm whisper-shadow transition-all hover:bg-primary/90 active:scale-[0.98]";

export function ProductDefaultPurchaseClient({ product, children }: Props) {
  const { isOpen, toggle } = useProductPageChat();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const onPersonalize = (options?: { variantId?: string | null; variantName?: string | null }) => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    toggle(options);
  };
  const base = Number(product.basePrice);
  const variants = product.variants;

  const lineFor = (v: VariantRow) => variantLinePrice(base, v);

  if (variants.length === 0) {
    return (
      <div className="space-y-8 md:space-y-10">
        <ProductDefaultLeadBlock product={product} selectedVariant={null} />
        {children}
        <div className="space-y-6">
          <p className="text-sm text-primary/80 font-sans">
            A partir de{" "}
            <span className="text-primary font-medium tabular-nums not-italic">{formatBRL(Number(product.basePrice))}</span>
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onPersonalize()}
              className={cn(personalizeBtn, isOpen && "ring-2 ring-on-primary/30")}
              aria-pressed={isOpen}
            >
              Personalizar
            </button>
          </div>
          <p className="text-center text-[10px] text-stone-500 uppercase tracking-widest italic">
            Prazos e opções de envio no fecho do pedido.
          </p>
          <MetaLines product={product} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <ProductDefaultLeadBlock product={product} selectedVariant={null} />
      {children}
      <div className="space-y-5">
        <div>
          <p className="font-sans uppercase tracking-[0.12rem] text-[9px] text-stone-400 mb-2">
            {variants.length > 1 ? "Variações" : "Variação"}
          </p>
          <ul className="space-y-2 border-l border-stone-200/45 pl-3">
            {variants.map((v) => (
              <li key={v.id}>
                <p className="text-[11px] leading-snug text-stone-600 font-sans">
                  <span className="font-serif italic text-stone-700">{v.name}</span>
                  <span className="mx-1.5 text-stone-300/90" aria-hidden>
                    ·
                  </span>
                  <span className="tabular-nums text-stone-500">{formatBRL(lineFor(v))}</span>
                </p>
                {v.description?.trim() ? (
                  <p className="mt-1 text-[10px] leading-relaxed text-stone-500/95 font-sans font-light whitespace-pre-line max-w-md">
                    {v.description.trim()}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onPersonalize()}
            className={cn(personalizeBtn, isOpen && "ring-2 ring-on-primary/30")}
            aria-pressed={isOpen}
          >
            Personalizar
          </button>
          <p className="text-center mt-4 text-[10px] text-stone-500 uppercase tracking-widest italic">
            Prazos e opções de envio no fecho do pedido.
          </p>
        </div>
        <MetaLines product={product} />
      </div>
    </div>
  );
}

function MetaLines({ product }: { product: ProductPagePayload }) {
  return (
    <div className="space-y-3 border-t border-stone-200/50 pt-6">
      {product.minQuantity > 1 && (
        <p className="text-xs text-stone-500 text-center">Quantidade mínima do produto: {product.minQuantity} un.</p>
      )}
      {product.discounts.length > 0 && (
        <div className="text-center">
          <h3 className="font-sans uppercase tracking-[0.1rem] text-[10px] text-stone-500 mb-2">Desconto por volume</h3>
          <ul className="text-sm text-on-surface-variant space-y-1 font-sans">
            {product.discounts.map((d) => (
              <li key={d.id}>
                A partir de {d.quantityThreshold} un. — {String(d.discountPercent)}% de desconto
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
