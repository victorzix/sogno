/** URLs de imagem do produto: array no DB + legado `imageUrl`. */
export function productImageUrlsFromRow(p: {
  imageUrls?: string[] | null;
  imageUrl?: string | null;
}): string[] {
  const raw = (p.imageUrls ?? []).filter((u) => typeof u === "string" && u.trim().length > 0);
  if (raw.length) return [...new Set(raw.map((u) => u.trim()))];
  const legacy = p.imageUrl?.trim();
  return legacy ? [legacy] : [];
}

export function productHeroImage(p: {
  imageUrls?: string[] | null;
  imageUrl?: string | null;
}): string | null {
  return productImageUrlsFromRow(p)[0] ?? null;
}

/**
 * Galeria da ficha default: fotos do produto primeiro, depois fotos de cada variação (ordem das variantes preservada).
 * URLs duplicadas são omitidas.
 */
export function mergeProductSampleImageUrls(product: {
  imageUrls: string[];
  variants: { imageUrls: string[] }[];
}): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (u: string) => {
    const t = u.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  for (const u of product.imageUrls) push(u);
  for (const v of product.variants) {
    for (const u of v.imageUrls) push(u);
  }
  return out;
}
