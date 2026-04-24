import { cn } from "@/lib/utils";

type Props = { text: string; className?: string };

export function ProductDefaultEssence({ text, className }: Props) {
  return (
    <section className={cn("space-y-0", className)}>
      <h2 className="font-sans uppercase tracking-[0.1rem] text-[10px] text-stone-500 mb-4">A essência</h2>
      <p className="text-on-surface-variant leading-loose font-light text-[15px] md:text-base">{text}</p>
    </section>
  );
}
