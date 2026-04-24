/**
 * Temas de ficha de produto — cada chave mapeia para um componente em `components/product-pages/`.
 * Novo tema: 1) adicionar à união, 2) criar o ficheiro, 3) registar em `ProductPageView`.
 */
export const PRODUCT_PAGE_THEMES = ["default", "editorial"] as const;
export type ProductPageTheme = (typeof PRODUCT_PAGE_THEMES)[number];

const FALLBACK: ProductPageTheme = "default";

export function isProductPageTheme(t: string): t is ProductPageTheme {
  return (PRODUCT_PAGE_THEMES as readonly string[]).includes(t);
}

export function resolveProductPageTheme(t: string | null | undefined): ProductPageTheme {
  if (t && isProductPageTheme(t)) return t;
  return FALLBACK;
}
