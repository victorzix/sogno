import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SeedButton } from "@/components/cart/SeedButton";

export default async function CatalogoPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    }
  });

  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-7xl mx-auto w-full">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <span className="tracking-archival text-xs text-primary font-medium">Coleções Curadas</span>
          <h1 className="text-4xl md:text-6xl font-serif text-on-surface mt-2">Catálogo</h1>
        </div>
        {products.length === 0 && <SeedButton />}
      </header>
      
      {products.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center py-20 border-t border-primary/5">
          <p className="col-span-full font-sans italic text-primary/60">
            Nossa coleção está sendo cuidadosamente catalogada. <br /> Em breve, você poderá explorar nossos itens exclusivos.
          </p>
          <div className="col-span-full flex justify-center">
            <Button variant="primary">Notificar-me</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 border-t border-primary/5">
          {products.map(product => (
            <div key={product.id} className="bg-surface-container-lowest/50 p-6 rounded-3xl ghost-border glass flex flex-col gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-serif text-primary">{product.name}</h3>
                <p className="text-primary/70 font-sans mt-2">
                  A partir de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.basePrice))}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4 border-t border-primary/5 pt-4">
                {product.variants.length > 0 ? (
                  product.variants.map(variant => (
                    <div key={variant.id} className="flex items-center justify-between">
                      <span className="text-sm font-sans">{variant.name}</span>
                      <AddToCartButton 
                        productId={product.id} 
                        variantId={variant.id} 
                        label={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(variant.price || product.basePrice))} 
                      />
                    </div>
                  ))
                ) : (
                  <AddToCartButton productId={product.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
