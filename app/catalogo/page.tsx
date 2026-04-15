import { Button } from "@/components/ui/Button";

export default function CatalogoPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-7xl mx-auto w-full">
      <header className="mb-12">
        <span className="tracking-archival text-xs text-primary font-medium">Coleções Curadas</span>
        <h1 className="text-4xl md:text-6xl font-serif text-on-surface mt-2">Catálogo</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center py-20 border-t border-primary/5">
        <p className="col-span-full font-sans italic text-primary/60">
          Nossa coleção está sendo cuidadosamente catalogada. <br /> Em breve, você poderá explorar nossos itens exclusivos.
        </p>
        <div className="col-span-full flex justify-center">
          <Button variant="primary">Notificar-me</Button>
        </div>
      </div>
    </div>
  );
}
