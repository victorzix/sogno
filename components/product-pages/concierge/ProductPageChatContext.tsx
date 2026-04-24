"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductPagePayload } from "../types";

export type ProductChatOpenOptions = {
  variantId?: string | null;
  variantName?: string | null;
};

type Ctx = {
  product: ProductPagePayload;
  isOpen: boolean;
  lastOpenOptions: ProductChatOpenOptions | undefined;
  open: (options?: ProductChatOpenOptions) => void;
  close: () => void;
  toggle: (options?: ProductChatOpenOptions) => void;
};

const ProductPageChatContext = createContext<Ctx | null>(null);

type ChatState = { isOpen: boolean; lastOpenOptions: ProductChatOpenOptions | undefined };

const closedState = (): ChatState => ({ isOpen: false, lastOpenOptions: undefined });

export function ProductPageChatProvider({
  product,
  children,
}: {
  product: ProductPagePayload;
  children: ReactNode;
}) {
  const [state, setState] = useState<ChatState>(closedState);

  const isOpen = state.isOpen;
  const lastOpenOptions = state.lastOpenOptions;

  useEffect(() => {
    setState(closedState());
  }, [product.id]);

  const open = useCallback((options?: ProductChatOpenOptions) => {
    setState({ isOpen: true, lastOpenOptions: options });
  }, []);

  const close = useCallback(() => {
    setState(closedState());
  }, []);

  const toggle = useCallback((options?: ProductChatOpenOptions) => {
    setState((s) =>
      s.isOpen
        ? closedState()
        : { isOpen: true, lastOpenOptions: options }
    );
  }, []);

  const value = useMemo(
    () => ({ product, isOpen, lastOpenOptions, open, close, toggle }),
    [product, isOpen, lastOpenOptions, open, close, toggle]
  );

  return <ProductPageChatContext.Provider value={value}>{children}</ProductPageChatContext.Provider>;
}

export function useProductPageChat() {
  const ctx = useContext(ProductPageChatContext);
  if (!ctx) {
    throw new Error("useProductPageChat must be used within ProductPageChatProvider");
  }
  return ctx;
}
