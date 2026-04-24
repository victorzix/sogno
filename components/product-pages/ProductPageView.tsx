import type { ComponentType } from "react";
import type { ProductPageTheme } from "@/lib/product-themes";
import { ProductPageChatLayout } from "./concierge/ProductPageChatLayout";
import { ProductPageDefault } from "./ProductPageDefault";
import { ProductPageEditorial } from "./ProductPageEditorial";
import type { ProductPagePayload } from "./types";

const VIEWS: Record<ProductPageTheme, ComponentType<{ product: ProductPagePayload }>> = {
  default: ProductPageDefault,
  editorial: ProductPageEditorial,
};

export function ProductPageView({
  theme,
  product,
}: {
  theme: ProductPageTheme;
  product: ProductPagePayload;
}) {
  const Comp = VIEWS[theme] ?? VIEWS.default;
  return (
    <ProductPageChatLayout product={product}>
      <Comp product={product} />
    </ProductPageChatLayout>
  );
}
