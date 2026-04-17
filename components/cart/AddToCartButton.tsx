'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { addToCart } from '@/app/actions/cart';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  label?: string;
}

export function AddToCartButton({ productId, variantId, label = "Adicionar ao Carrinho" }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(async () => {
      const res = await addToCart(productId, variantId, 1);
      if (res.success) {
        toast.success('Produto adicionado ao carrinho!');
      } else {
        toast.error(res.error || 'Não foi possível adicionar o produto.');
      }
    });
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleAdd} 
      disabled={isPending}
      className={isPending ? 'opacity-70' : ''}
    >
      {isPending ? 'Adicionando...' : label}
    </Button>
  );
}
