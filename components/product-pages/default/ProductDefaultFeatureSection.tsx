import Image from "next/image";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/file.svg";

type Props = { imageUrls: string[]; productName: string; className?: string };

export function ProductDefaultFeatureSection({ imageUrls, productName, className }: Props) {
  const pick = imageUrls[1] ?? imageUrls[0];
  const src = pick || PLACEHOLDER;
  const hasPhoto = Boolean(pick);
  const isRemote = src.startsWith("http");

  return (
    <section
      className={cn(
        "mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center",
        className
      )}
    >
      <div className="order-2 md:order-1">
        <h2 className="font-serif text-3xl sm:text-4xl mb-6 md:mb-8 leading-snug text-on-surface">Curadoria de detalhes</h2>
        <div className="space-y-8">
          <div className="flex gap-5 md:gap-6 items-start">
            <span className="material-symbols-outlined text-secondary text-3xl shrink-0" aria-hidden>
              eco
            </span>
            <div>
              <h3 className="font-sans font-semibold text-xs uppercase tracking-widest mb-2 text-on-surface">
                Sustentabilidade
              </h3>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                Papéis e acabamentos escolhidos com cuidado, para hoje e para o arquivo de amanhã.
              </p>
            </div>
          </div>
          <div className="flex gap-5 md:gap-6 items-start">
            <span className="material-symbols-outlined text-secondary text-3xl shrink-0" aria-hidden>
              auto_fix_high
            </span>
            <div>
              <h3 className="font-sans font-semibold text-xs uppercase tracking-widest mb-2 text-on-surface">
                Artesanal
              </h3>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                Cada lote reflete mãos, tempo e material — longe do genérico, perto do significado.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="order-1 md:order-2 relative h-[min(50vh,400px)] md:h-[400px] w-full max-w-md mx-auto md:max-w-none rounded-full overflow-hidden bg-secondary-container whisper-shadow">
        <Image
          src={src}
          alt={`${productName} — oficina e processo`}
          fill
          className={hasPhoto ? "object-cover" : "object-contain p-8 opacity-40"}
          sizes="(max-width: 768px) 90vw, 40vw"
          unoptimized={isRemote || src.endsWith(".svg")}
        />
        {hasPhoto && <div className="absolute inset-0 bg-secondary/20 pointer-events-none" aria-hidden />}
      </div>
    </section>
  );
}
