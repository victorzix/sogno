import Link from "next/link";

type Props = { productName: string };

export function ProductDefaultBreadcrumb({ productName }: Props) {
  return (
    <nav className="text-xs text-primary/60 font-sans mb-8 md:mb-10" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            href="/catalogo"
            className="text-primary/70 font-serif text-base tracking-wide border-b border-primary/20 pb-0.5 hover:text-primary transition-colors"
          >
            Catálogo
          </Link>
        </li>
        <li aria-hidden className="text-primary/30">
          /
        </li>
        <li className="text-on-surface/80 line-clamp-1">{productName}</li>
      </ol>
    </nav>
  );
}
