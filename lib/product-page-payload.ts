import type { Prisma } from "@/generated/client";
import { productImageUrlsFromRow } from "@/lib/product-images";

/** Include único para a ficha — manter alinhado com a query em `app/produto/[slug]/page.tsx`. */
export const productPageQueryInclude = {
  category: { select: { name: true } },
  variants: { orderBy: { name: "asc" as const } },
  discounts: { orderBy: { quantityThreshold: "asc" as const } },
} as const satisfies Prisma.ProductInclude;

type ProductPageQueryResult = Prisma.ProductGetPayload<{
  include: typeof productPageQueryInclude;
}>;

/**
 * Carga da ficha de produto com escalares em formato JSON-safe (RSC → Client).
 * `Decimal` e `Date` vêm do Prisma e não podem ser passados a Client Components.
 */
export type ProductPagePayload = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  /** Primeira URL (hero / compat). Derivado de `imageUrls` ou legado `imageUrl`. */
  imageUrl: string | null;
  /** Todas as imagens da ficha (URLs). */
  imageUrls: string[];
  basePrice: string;
  minQuantity: number;
  theme: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  category: { name: string } | null;
  variants: {
    id: string;
    productId: string;
    name: string;
    description: string | null;
    price: string | null;
    imageUrls: string[];
  }[];
  discounts: {
    id: string;
    productId: string;
    quantityThreshold: number;
    discountPercent: string;
  }[];
};

export function serializeProductPagePayload(
  p: ProductPageQueryResult
): ProductPagePayload {
  const imageUrls = productImageUrlsFromRow(p);
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    slug: p.slug,
    imageUrls,
    imageUrl: imageUrls[0] ?? null,
    basePrice: p.basePrice.toString(),
    minQuantity: p.minQuantity,
    theme: p.theme,
    categoryId: p.categoryId,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: p.category,
    variants: p.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      name: v.name,
      description: v.description,
      price: v.price != null ? v.price.toString() : null,
      imageUrls: (v.imageUrls ?? []).filter((u) => u.trim().length > 0),
    })),
    discounts: p.discounts.map((d) => ({
      id: d.id,
      productId: d.productId,
      quantityThreshold: d.quantityThreshold,
      discountPercent: d.discountPercent.toString(),
    })),
  };
}
