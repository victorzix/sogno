import { cn } from "@/lib/utils";

type Props = {
  archiveRef: string;
  title: string;
  className?: string;
};

export function ProductDefaultHeader({ archiveRef, title, className }: Props) {
  return (
    <header className={cn("mb-0", className)}>
      <span className="text-secondary font-sans uppercase tracking-[0.15rem] text-xs mb-4 block">
        Arquivo N.º {archiveRef}
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-on-surface leading-tight">
        {title}
      </h1>
    </header>
  );
}
