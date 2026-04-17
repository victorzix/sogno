'use client';

import { useTransition } from 'react';
import { clearCart } from '@/app/actions/cart';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface CartSummaryProps {
  total: number;
}

export function CartSummary({ total }: CartSummaryProps) {
  const [isPending, startTransition] = useTransition();

  const handleClearCart = () => {
    if (!confirm('Deseja realmente limpar seu carrinho?')) return;
    
    startTransition(async () => {
      const res = await clearCart();
      if (res.success) {
        toast.success('Carrinho limpo com sucesso');
      } else {
        toast.error('Erro ao limpar carrinho');
      }
    });
  };

  const handleCheckout = () => {
    toast.success('Em breve: Checkout em desenvolvimento!');
  };

  return (
    <div className="bg-surface-container-lowest/50 p-6 rounded-3xl ghost-border glass flex flex-col gap-6">
      <h2 className="font-serif text-2xl text-primary border-b border-primary/10 pb-4">Resumo do Pedido</h2>
      
      <div className="flex justify-between items-center text-lg">
        <span className="text-primary/70">Subtotal</span>
        <span className="font-medium text-primary">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
        </span>
      </div>

      <div className="flex justify-between items-center text-xl font-bold border-t border-primary/10 pt-4">
        <span>Total</span>
        <span className="text-primary">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Button onClick={handleCheckout} className="w-full">
          Finalizar Compra
        </Button>
        <Button 
          variant="glass" 
          onClick={handleClearCart} 
          disabled={isPending}
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/5"
        >
          Limpar Carrinho
        </Button>
      </div>
    </div>
  );
}
