export default function HistoriaPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface px-6 py-12 max-w-4xl mx-auto w-full">
      <header className="mb-12">
        <span className="tracking-archival text-xs text-primary font-medium">Sobre Nós</span>
        <h1 className="text-4xl md:text-6xl font-serif text-on-surface mt-2 italic">Nossa História</h1>
      </header>
      
      <article className="space-y-12 font-sans text-lg text-on-surface/80 leading-relaxed pt-12 border-t border-primary/5">
        <p>
          "Fundado sob o desejo de preservar o tangível em um mundo cada vez mais digital, The Ethereal Archive nasceu da paixão por itens de papelaria que carregam alma e história."
        </p>
        <p>
          Em cada caneta tinteiro, cada textura de papel e cada aroma de couro, acreditamos que existe uma conexão única que ancora o pensamento humano ao momento presente. Nossa jornada começou em um pequeno ateliê de restauro de livros, onde a beleza do que é feito à mão se revelou eterna.
        </p>
        <p>
          Hoje, curamos e produzimos itens que são projetados para envelhecer com dignidade e para serem os repositórios dos seus sonhos mais profundos.
        </p>
      </article>
    </div>
  );
}
