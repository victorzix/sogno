import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions";
import { prisma } from "@/lib/prisma";
import { formatBRL, variantLinePrice } from "@/lib/product-display";
import {
  productPageQueryInclude,
  serializeProductPagePayload,
  type ProductPagePayload,
} from "@/lib/product-page-payload";

/** Primeira tool do concierge: dados factuais da ficha (variantes, preços, descontos, etc.). */
export const CONCIERGE_PRODUCT_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_product_details",
      description:
        "Obtém dados atualizados do produto desta página (nome, descrição, preço base, quantidade mínima, variantes com preço final, descontos por volume, imagem). Use quando o cliente perguntar opções, preços, combinações, descontos ou quiser comparar variantes — não invente valores.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          sections: {
            type: "array",
            description:
              "Quais blocos trazer. Se omitir ou vazio, retorna tudo. Use subconjuntos para respostas mais leves.",
            items: {
              type: "string",
              enum: ["overview", "variants", "discounts", "media"],
            },
          },
        },
      },
    },
  },
];

type DetailSection = "overview" | "variants" | "discounts" | "media";

function buildProductDetailsJson(
  p: ProductPagePayload,
  sections: DetailSection[] | undefined
): Record<string, unknown> {
  const use = (s: DetailSection) => !sections?.length || sections.includes(s);
  const base = Number(p.basePrice);
  const out: Record<string, unknown> = {};

  if (use("overview")) {
    out.overview = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      minQuantity: p.minQuantity,
      category: p.category?.name ?? null,
      basePriceBRL: formatBRL(base),
      theme: p.theme,
    };
  }
  if (use("variants")) {
    out.variants = p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      linePriceBRL: formatBRL(variantLinePrice(base, v)),
      imageUrls: v.imageUrls,
    }));
  }
  if (use("discounts")) {
    out.discounts = p.discounts.map((d) => ({
      fromQuantity: d.quantityThreshold,
      discountPercent: Number(d.discountPercent),
    }));
  }
  if (use("media")) {
    out.media = { imageUrls: p.imageUrls, imageUrl: p.imageUrl };
  }

  return out;
}

/**
 * Executa a tool `get_product_details` (só leitura no DB).
 * `productId` vem do contexto da página (não confie no modelo para o id do produto).
 */
export async function executeGetProductDetailsTool(
  productId: string,
  argumentsJson: string
): Promise<string> {
  let sections: DetailSection[] | undefined;
  try {
    const raw = JSON.parse(argumentsJson || "{}") as { sections?: unknown };
    if (Array.isArray(raw.sections)) {
      const allowed = new Set<DetailSection>(["overview", "variants", "discounts", "media"]);
      sections = raw.sections.filter((s): s is DetailSection => typeof s === "string" && allowed.has(s as DetailSection));
      if (sections.length === 0) sections = undefined;
    }
  } catch {
    return JSON.stringify({ ok: false, error: "argumentos_json_invalidos" });
  }

  const row = await prisma.product.findUnique({
    where: { id: productId },
    include: productPageQueryInclude,
  });
  if (!row) {
    return JSON.stringify({ ok: false, error: "produto_nao_encontrado", productId });
  }

  const payload = serializeProductPagePayload(row);
  const data = buildProductDetailsJson(payload, sections);
  return JSON.stringify({ ok: true, productId, ...data });
}
