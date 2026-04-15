import { Button } from "@/components/ui/Button";

export default function ContatoPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-4xl mx-auto w-full">
      <header className="mb-12">
        <span className="tracking-archival text-xs text-primary font-medium">Fale Conosco</span>
        <h1 className="text-4xl md:text-6xl font-serif text-on-surface mt-2">Contato</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-primary/5 pt-12">
        <section className="space-y-8">
          <p className="font-sans italic text-lg text-primary/80">"Toda grande história começa com um primeiro contato. Estamos aqui para ouvir a sua."</p>
          <div className="space-y-4 text-on-surface/60">
            <p className="flex flex-col">
              <span className="tracking-archival text-xs text-primary font-medium">E-mail</span>
              <span>atendimento@etherealarchive.com</span>
            </p>
            <p className="flex flex-col">
              <span className="tracking-archival text-xs text-primary font-medium">Endereço</span>
              <span>Rua das Letras, 42 - Centro Cultural</span>
            </p>
          </div>
        </section>
        
        <form className="space-y-6 bg-surface-container-low p-8 rounded-xl ghost-border">
          <div className="flex flex-col gap-2">
            <label className="tracking-archival text-xs text-primary font-medium">Nome</label>
            <input type="text" className="bg-surface p-3 rounded-lg ghost-border focus:outline-primary/20" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="tracking-archival text-xs text-primary font-medium">Mensagem</label>
            <textarea rows={4} className="bg-surface p-3 rounded-lg ghost-border focus:outline-primary/20" />
          </div>
          <Button variant="primary" className="w-full">Enviar Mensagem</Button>
        </form>
      </div>
    </div>
  );
}
