import Link from "next/link";

export default function ProdutoNotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center gap-4">
      <h1 className="text-2xl font-serif text-on-surface">Produto não encontrado</h1>
      <p className="text-sm text-primary/60 max-w-sm">Esse item não existe ou foi removido.</p>
      <Link
        href="/catalogo"
        className="inline-flex items-center justify-center h-12 px-8 rounded-full font-sans font-medium bg-primary text-on-primary hover:opacity-90 whisper-shadow active:scale-95 transition-all"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
