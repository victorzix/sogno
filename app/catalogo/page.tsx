import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { SeedButton } from "@/components/cart/SeedButton";
import { formatBRL, getStartingPrice } from "@/lib/product-display";
import { productHeroImage } from "@/lib/product-images";

const PLACEHOLDER = "/file.svg";

export default async function CatalogoPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      variants: { select: { price: true } },
    },
  });

  return (
    <div className="flex flex-col flex-1 bg-surface px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <span className="tracking-archival text-[10px] sm:text-xs text-primary font-medium">Coleções Curadas</span>
          <h1 className="text-2xl sm:text-3xl font-serif text-on-surface mt-1">Catálogo</h1>
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
        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 py-6 border-t border-primary/5 list-none p-0 m-0">
          {products.map((product) => {
            const from = getStartingPrice(product);
            const hero = productHeroImage(product);
            const src = hero || PLACEHOLDER;
            const external = Boolean(hero);
            const isRemote = src.startsWith("http");

            return (
              <li
                key={product.id}
                className="group flex flex-col gap-2 bg-surface-container-lowest/50 rounded-xl sm:rounded-2xl ghost-border glass overflow-hidden"
              >
                <Link
                  href={`/produto/${product.slug}`}
                  className="block pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-t-xl sm:rounded-t-2xl"
                >
                  <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-surface-container-highest">
                    <Image
                      src={src}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 20vw"
                      className={
                        external
                          ? "object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          : "object-contain p-6 opacity-30 grayscale"
                      }
                      unoptimized={isRemote || src.endsWith(".svg")}
                    />
                  </div>
                  <div className="px-2.5 sm:px-3 pt-0.5 flex flex-col gap-0.5">
                    <h2 className="text-sm sm:text-base font-serif text-on-surface leading-tight line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-xs text-primary/70 font-sans">
                      A partir de{" "}
                      <span className="text-primary not-italic font-medium tabular-nums">{formatBRL(from)}</span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
