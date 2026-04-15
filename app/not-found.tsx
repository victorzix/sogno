import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-surface px-6 text-center gap-8 min-h-[70vh]">
      <div className="space-y-4">
        <h2 className="text-sm tracking-archival text-primary/60 font-medium">Erro 404</h2>
        <h1 className="text-5xl md:text-7xl font-serif text-primary italic">Página não encontrada</h1>
        <p className="text-on-surface/60 max-w-md mx-auto font-sans leading-relaxed">
          Parece que este fragmento de sonho ainda não foi escrito ou se perdeu entre as páginas do nosso arquivo.
        </p>
      </div>
      
      <div className="signature-texture p-1 rounded-full">
        <Button asChild variant="primary" className="px-12">
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>

      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
