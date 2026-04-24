"use client";

import { cn } from "@/lib/utils";
import { productBaseLeadText } from "@/lib/product-page-default-copy";
import type { ProductPagePayload } from "../types";

type VariantRow = ProductPagePayload["variants"][number];

type Props = {
  product: ProductPagePayload;
  selectedVariant: VariantRow | null;
  className?: string;
};

export function ProductDefaultLeadBlock({ product, selectedVariant, className }: Props) {
  const base = productBaseLeadText(product);
  const hasCustomBase = Boolean(product.description?.trim());
  const variantNote = selectedVariant?.description?.trim();

  return (
    <div className={cn("mt-3 md:mt-4 mb-8 md:mb-10 space-y-4 max-w-2xl", className)}>
      <p
        className={cn(
          "text-lg md:text-xl text-primary leading-relaxed max-w-2xl",
          hasCustomBase ? "font-sans not-italic font-light" : "font-serif italic opacity-90"
        )}
      >
        {base}
      </p>

      {product.variants.length > 0 && selectedVariant && variantNote ? (
        <div className="border-t border-stone-200/70 pt-4 space-y-2">
          <p className="font-sans uppercase tracking-[0.1rem] text-[10px] text-stone-500">Opção: {selectedVariant.name}</p>
          <p className="text-on-surface-variant text-[15px] md:text-base leading-loose font-light whitespace-pre-line">
            {variantNote}
          </p>
        </div>
      ) : null}
    </div>
  );
}
