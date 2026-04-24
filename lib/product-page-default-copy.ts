import type { ProductPagePayload } from "@/components/product-pages/types";

/** Texto de abertura abaixo do título: descrição da base de dados ou fallback curatorial. */
export function productBaseLeadText(product: ProductPagePayload): string {
  const d = product.description?.trim();
  if (d) return d;
  return productTagline(product);
}

/** Rótulo estilo ficha de arquivo, estável para o mesmo produto. */
export function productArchiveRef(productId: string): string {
  let n = 0;
  for (let i = 0; i < productId.length; i++) {
    n = (n + productId.charCodeAt(i) * (i + 1)) % 1000;
  }
  return String(100 + (n % 900)).padStart(3, "0");
}

export function productTagline(product: ProductPagePayload): string {
  if (product.category?.name) {
    return `Papelaria curada na linha ${product.category.name}. Cada peça reúne textura, tempo e cuidado.`;
  }
  return "Papelaria artesanal com curadoria Sogni di Carta — do tacto à memória de quem oferta.";
}

export function productEssenceText(product: ProductPagePayload): string {
  return `Cada detalhe de ${product.name} reflete a nossa procura por materiais e acabamento honestos. Não é apenas um objecto, é a primeira página de um gesto: pensado para quem celebra com calma, coração e atenção ao que fica.`;
}
