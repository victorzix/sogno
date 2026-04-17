import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCart } from "@/app/actions/cart";
import { CartItemList, CartItemData } from "@/components/cart/CartItemList";
import { CartSummary } from "@/components/cart/CartSummary";
import Link from "next/link";

export default async function CarrinhoPage() {
  const cart = await getCart();

  const items = cart?.items || [];
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-4xl mx-auto w-full items-center justify-center text-center gap-8">
        <div className="p-8 bg-surface-container-low rounded-full">
          <ShoppingBag className="size-16 text-primary/20" strokeWidth={1} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-on-surface">Seu Carrinho está vazio</h1>
          <p className="text-primary/60 max-w-sm mx-auto italic font-sans">"O papel espera por suas ideias, mas primeiro ele precisa de um lar."</p>
        </div>
        <Link href="/catalogo">
          <Button variant="primary" size="lg">Explorar Itens</Button>
        </Link>
      </div>
    );
  }

  // Converter para o tipo usado no Client Component e calcular totais
  const serializedItems: CartItemData[] = items.map(item => {
    // Se a variante tem preço usa ele, senão usa o basePrice do produto.
    const price = Number(item.variant?.price || item.product.basePrice);
    
    return {
      id: item.id,
      productId: item.product.id,
      quantity: item.quantity,
      productName: item.product.name,
      variantName: item.variant?.name,
      price: price,
    };
  });

  const total = serializedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-6xl mx-auto w-full gap-12">
      <header>
        <span className="tracking-archival text-xs text-primary font-medium">Revisão de Pedido</span>
        <h1 className="text-4xl md:text-5xl font-serif text-on-surface mt-2">Carrinho</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          <CartItemList items={serializedItems} />
        </div>

        <div className="w-full lg:w-96 sticky top-28">
          <CartSummary total={total} />
        </div>
      </div>
    </div>
  );
}
