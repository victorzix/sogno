import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { EditorialPersonalizeCta } from "./concierge/EditorialPersonalizeCta";
import { formatBRL, getStartingPrice, variantLinePrice } from "@/lib/product-display";
import type { ProductPagePayload } from "./types";

const PLACEHOLDER = "/file.svg";

/**
 * Tema de exemplo: foco no hero, texto centrado, ritmo de revista.
 * Ajusta à vontade ou duplica o padrão de outro ficheiro.
 */
export function ProductPageEditorial({ product }: { product: ProductPagePayload }) {
  const base = Number(product.basePrice);
  const from = getStartingPrice({
    basePrice: product.basePrice,
    variants: product.variants.map((v) => ({ price: v.price })),
  });
  const src = product.imageUrl || PLACEHOLDER;
  const isRemote = src.startsWith("http");

  return (
    <div
      className="flex flex-col flex-1 bg-gradient-to-b from-surface via-surface-container-low/20 to-surface"
      data-theme="editorial"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 text-center">
        <Link href="/catalogo" className="text-xs text-primary/60 font-sans hover:text-primary hover:underline">
          ← Catálogo
        </Link>
        {product.category && (
          <p className="mt-4 tracking-archival text-[10px] uppercase text-primary/50 font-medium">
            {product.category.name}
          </p>
        )}
        <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-on-surface leading-tight">{product.name}</h1>
        {product.description?.trim() && (
          <p className="mt-4 max-w-xl mx-auto text-on-surface-variant font-light font-sans text-sm leading-relaxed">
            {product.description.trim()}
          </p>
        )}
        <p className="mt-4 text-sm text-primary/80 font-sans not-italic">
          A partir de {formatBRL(from)}
        </p>
        <EditorialPersonalizeCta />
      </div>

      <div className="relative w-full max-h-[min(55vh,480px)] aspect-[16/9] sm:max-w-3xl sm:mx-auto sm:rounded-2xl overflow-hidden bg-surface-container-highest">
        <Image
          src={src}
          alt={product.name}
          fill
          className={product.imageUrl ? "object-cover" : "object-contain p-12 opacity-30 grayscale"}
          sizes="(max-width: 768px) 100vw, 48rem"
          priority
          unoptimized={isRemote || src.endsWith(".svg")}
        />
      </div>

      <div className="mx-auto w-full max-w-lg px-4 sm:px-6 py-10 space-y-6">
        {product.variants.length > 0 && (
          <ul className="space-y-2 list-none p-0 m-0 text-left">
            {product.variants.map((v) => {
              const line = variantLinePrice(base, v);
              return (
                <li
                  key={v.id}
                  className="flex flex-col gap-2 border-b border-primary/10 py-3 last:border-0"
                >
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="text-on-surface font-sans">{v.name}</span>
                    <span className="text-primary/80 font-medium tabular-nums shrink-0">{formatBRL(line)}</span>
                  </div>
                  {v.description?.trim() && (
                    <p className="text-xs text-on-surface/70 font-sans font-light leading-relaxed">
                      {v.description.trim()}
                    </p>
                  )}
                  <AddToCartButton
                    productId={product.id}
                    variantId={v.id}
                    label="Adicionar"
                    className="w-full h-10 text-sm"
                  />
                </li>
              );
            })}
          </ul>
        )}

        {product.variants.length === 0 && (
          <div className="flex justify-center">
            <AddToCartButton productId={product.id} className="w-full max-w-sm" />
          </div>
        )}

        {product.minQuantity > 1 && (
          <p className="text-center text-xs text-on-surface/50">Quantidade mínima: {product.minQuantity} un.</p>
        )}

        {product.discounts.length > 0 && (
          <div className="pt-2 border-t border-primary/10 text-left space-y-2">
            <h2 className="text-xs tracking-archival uppercase text-primary/50 font-medium">Desconto por volume</h2>
            <ul className="text-sm text-primary/80 space-y-1 list-disc list-inside font-sans">
              {product.discounts.map((d) => (
                <li key={d.id}>
                  A partir de {d.quantityThreshold} un. — {String(d.discountPercent)}% de desconto
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
