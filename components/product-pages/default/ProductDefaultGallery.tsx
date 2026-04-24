"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/file.svg";

type Props = {
  productName: string;
  /** URLs da galeria: produto + variantes (ordem de amostragem). */
  imageUrls: string[];
  className?: string;
};

export function ProductDefaultGallery({ productName, imageUrls, className }: Props) {
  const urls = imageUrls.length > 0 ? imageUrls : [PLACEHOLDER];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeIndex = Math.min(Math.max(0, selectedIndex), urls.length - 1);
  const hero = urls[safeIndex] ?? urls[0];
  const hasRealGallery = imageUrls.length > 0;

  useEffect(() => {
    setSelectedIndex(0);
  }, [imageUrls.join("\n")]);

  const isRemote = useCallback((u: string) => u.startsWith("http"), []);
  const heroRemote = isRemote(hero);
  const heroUnoptimized = heroRemote || hero.endsWith(".svg");

  return (
    <div className={cn("flex flex-col space-y-6", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-container-low group">
        <Image
          key={hero}
          src={hero}
          alt={productName}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            hasRealGallery ? "group-hover:scale-[1.02]" : "object-contain p-10 opacity-30 grayscale"
          )}
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority
          unoptimized={heroUnoptimized}
        />
      </div>

      {hasRealGallery ? (
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[10px] uppercase tracking-[0.14rem] text-stone-400">
            Amostras — toque para ampliar
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {urls.map((src, idx) => {
              const remote = isRemote(src);
              const selected = idx === safeIndex;
              return (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  aria-label={`Ver imagem ${idx + 1} de ${urls.length}`}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    selected ? "ring-primary shadow-sm" : "ring-stone-200/70 hover:ring-stone-300"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={remote || src.endsWith(".svg")}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex justify-center pt-1">
        <Link
          href="/historia"
          className="group inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-surface-container-low px-5 py-2.5 font-serif text-sm italic text-primary transition hover:bg-primary/5"
        >
          <span>Ver processo</span>
          <span className="material-symbols-outlined text-lg transition group-hover:translate-x-0.5" aria-hidden>
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
