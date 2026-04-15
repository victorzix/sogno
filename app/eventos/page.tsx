export default function EventosPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-7xl mx-auto w-full">
      <header className="mb-12">
        <span className="tracking-archival text-xs text-primary font-medium">Momentos de Escrita</span>
        <h1 className="text-4xl md:text-6xl font-serif text-on-surface mt-2">Próximos Eventos</h1>
      </header>
      
      <div className="flex flex-col gap-12 border-t border-primary/5 pt-12">
        <div className="bg-surface-container-low p-12 rounded-xl flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-serif text-primary mb-4 italic">Nenhum evento agendado no momento.</h2>
          <p className="text-on-surface/60 font-sans max-w-md">Estamos preparando novos workshops e encontros de caligrafia. Inscreva-se em nossa newsletter para ficar por dentro.</p>
        </div>
      </div>
    </div>
  );
}
