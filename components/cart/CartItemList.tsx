'use client';

import { useState, useTransition } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { updateCartItemQuantity, removeFromCart } from '@/app/actions/cart';
import { toast } from 'sonner';

export type CartItemData = {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  variantName?: string | null;
  price: number;
};

interface CartItemListProps {
  items: CartItemData[];
}

export function CartItemList({ items }: CartItemListProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}

function CartItemRow({ item }: { item: CartItemData }) {
  const [isPending, startTransition] = useTransition();

  const handleIncrease = () => {
    startTransition(async () => {
      const res = await updateCartItemQuantity(item.id, item.quantity + 1);
      if (!res.success) toast.error('Erro ao atualizar quantidade');
    });
  };

  const handleDecrease = () => {
    startTransition(async () => {
      const res = await updateCartItemQuantity(item.id, item.quantity - 1);
      if (!res.success) toast.error('Erro ao atualizar quantidade');
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const res = await removeFromCart(item.id);
      if (res.success) {
        toast.success('Item removido do carrinho');
      } else {
        toast.error('Erro ao remover item');
      }
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-lowest/50 rounded-2xl ghost-border glass gap-4">
      <div className="flex-1">
        <h3 className="font-serif text-lg text-primary">{item.productName}</h3>
        {item.variantName && (
          <p className="text-sm text-primary/60 font-sans">{item.variantName}</p>
        )}
        <p className="text-sm font-medium mt-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-surface-container-low p-1 rounded-full">
        <button
          onClick={handleDecrease}
          disabled={isPending}
          className="p-2 hover:bg-surface-container-highest rounded-full transition-colors disabled:opacity-50"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center font-medium font-sans">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          disabled={isPending}
          className="p-2 hover:bg-surface-container-highest rounded-full transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="text-right w-24 font-medium text-lg text-primary">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
      </div>

      <button
        onClick={handleRemove}
        disabled={isPending}
        className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50"
        title="Remover item"
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
