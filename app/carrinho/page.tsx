import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CarrinhoPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-4xl mx-auto w-full items-center justify-center text-center gap-8">
      <div className="p-8 bg-surface-container-low rounded-full">
        <ShoppingBag className="size-16 text-primary/20" strokeWidth={1} />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-serif text-on-surface">Seu Carrinho está vazio</h1>
        <p className="text-primary/60 max-w-sm mx-auto italic font-sans">"O papel espera por suas ideias, mas primeiro ele precisa de um lar."</p>
      </div>
      <Button variant="primary" size="lg">Explorar Itens</Button>
    </div>
  );
}
