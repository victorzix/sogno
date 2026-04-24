type VariantRow = { price: unknown };

type ProductRow = {
  basePrice: unknown;
  variants: VariantRow[];
};

/** Preço mínimo entre `basePrice` e variantes (preço nulo da variante = base). */
export function getStartingPrice(product: ProductRow): number {
  const base = Number(product.basePrice);
  if (product.variants.length === 0) return base;
  const fromVariants = product.variants.map((v) =>
    v.price == null ? base : Number(v.price),
  );
  return Math.min(base, ...fromVariants);
}

export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function variantLinePrice(
  base: number,
  v: { price: unknown } | null,
) {
  if (!v) return base;
  return v.price == null ? base : Number(v.price);
}
