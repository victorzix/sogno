import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Hero Section - Mobile First */}
      <section className="relative px-6 py-16 md:py-32 flex flex-col items-center text-center signature-texture overflow-hidden">
        <div className="z-10 flex flex-col items-center gap-8 max-w-4xl">
          <header className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="tracking-archival text-xs md:text-sm text-primary font-medium">Ateliê</span>
            <h1 className="text-4xl md:text-8xl font-serif text-on-surface leading-[1.1] md:leading-tight">
              Sogni di Carta
            </h1>
            <p className="max-w-md md:text-lg text-primary/70 font-sans italic mt-4">
              Onde o papel ganha vida para contar a sua história. Papelaria fina e curadoria de detalhes para eventos inesquecíveis.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Ver Catálogo
            </Button>
            <Button variant="glass" size="lg" className="w-full sm:w-auto">
              Nossa História
            </Button>
          </div>
        </div>

        {/* Decorative Element - Ethereal Blur */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[150%] h-64 bg-primary-container/30 blur-[120px] rounded-full" />
      </section>

      {/* Featured Categories - Grid Layout Responsive */}
      <section className="px-6 py-20 mx-auto max-w-7xl w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="tracking-archival text-xs text-primary/60 font-medium">Coleções</span>
            <h2 className="text-3xl md:text-4xl font-serif text-on-surface">Essenciais do Escritor</h2>
          </div>
          <Link href="/catalogo" className="text-sm font-medium text-primary hover:underline tracking-archival">
            Explorar Tudo
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Papéis de Carta", desc: "Texturas que convidam ao toque.", img: "/window.svg" },
            { title: "Canetas Tinteiro", desc: "A fluidez do pensamento em tinta.", img: "/file.svg" },
            { title: "Cadernos de Couro", desc: "Onde seus segredos repousam.", img: "/globe.svg" },
          ].map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer flex flex-col gap-6 p-8 bg-surface-container-low rounded-xl transition-all hover:bg-surface-container-lowest hover:whisper-shadow"
            >
              <div className="aspect-[4/5] bg-surface-container-highest rounded-lg flex items-center justify-center p-12 transition-transform group-hover:scale-[1.02]">
                <Image src={item.img} alt={item.title} width={80} height={80} className="opacity-20 grayscale" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-2xl text-on-surface">{item.title}</h3>
                <p className="text-primary/60 text-sm italic">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Section - Tactile Experience */}
      <section className="bg-surface-container-high py-24 px-6 overflow-hidden">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 max-w-xl">
            <span className="tracking-archival text-xs text-primary font-medium">Filosofia Slow Design</span>
            <h2 className="text-4xl md:text-5xl font-serif text-on-surface leading-tight">
              Mais que uma papelaria, <br /> um santuário para a mente.
            </h2>
            <p className="text-lg text-primary/80 leading-relaxed font-sans italic">
              "Em um mundo digital efêmero, o papel é o âncora do que é eterno. Cada item em nosso arquivo é escolhido por sua capacidade de envelhecer com dignidade e contar uma história."
            </p>
            <div className="pt-4">
              <Button variant="secondary" className="ghost-border">Ler Manifesto</Button>
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto relative">
            <div className="aspect-square md:aspect-video bg-surface-container-lowest rounded-xl whisper-shadow flex items-center justify-center p-20 transform lg:rotate-2">
              <span className="font-serif text-primary/10 text-9xl select-none">Vellum</span>
            </div>
            {/* Absolute offset element to break the grid */}
            <div className="hidden md:block absolute -bottom-8 -left-8 size-48 bg-primary-container rounded-xl rotate-12 -z-10 opacity-30" />
          </div>
        </div>
      </section>
    </div>
  );
}
