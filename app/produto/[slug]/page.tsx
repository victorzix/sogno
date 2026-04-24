import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/product-pages/ProductPageView";
import {
  productPageQueryInclude,
  serializeProductPagePayload,
} from "@/lib/product-page-payload";
import { resolveProductPageTheme } from "@/lib/product-themes";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true },
  });
  if (!product) return { title: "Produto" };
  return { title: `${product.name} · Sogni di Carta` };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productPageQueryInclude,
  });

  if (!product) {
    notFound();
  }

  const theme = resolveProductPageTheme(product.theme);

  return <ProductPageView theme={theme} product={serializeProductPagePayload(product)} />;
}
