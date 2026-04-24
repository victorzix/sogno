import Link from "next/link";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
] as const;

const FOOTER_LINKS = [
  { label: "Envio", href: "/contato" },
  { label: "Privacidade", href: "/contato" },
] as const;

export function ProductDefaultPageFooter() {
  return (
    <footer className="w-full border-t border-stone-200/20 bg-stone-100/50 mt-16 md:mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-12 py-12 md:py-16 max-w-screen-2xl mx-auto w-full">
        <div className="font-serif text-xl italic text-primary">Sogni di Carta</div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-stone-500 font-sans text-xs uppercase tracking-[0.1rem] hover:text-on-surface transition-opacity opacity-90 hover:opacity-100"
            >
              {s.label}
            </a>
          ))}
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-stone-500 font-sans text-xs uppercase tracking-[0.1rem] hover:text-on-surface transition-opacity opacity-90 hover:opacity-100"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-stone-500 font-sans text-xs uppercase tracking-[0.1rem] text-center">
          © {new Date().getFullYear()} Sogni di Carta
        </p>
      </div>
    </footer>
  );
}
