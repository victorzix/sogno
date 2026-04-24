"use client";

import type { ReactNode } from "react";
import type { ProductPagePayload } from "../types";
import { ConciergeWidget } from "./ConciergeWidget";
import { ProductPageChatProvider } from "./ProductPageChatContext";

export function ProductPageChatLayout({
  product,
  children,
}: {
  product: ProductPagePayload;
  children: ReactNode;
}) {
  return (
    <ProductPageChatProvider product={product}>
      {children}
      <ConciergeWidget />
    </ProductPageChatProvider>
  );
}
