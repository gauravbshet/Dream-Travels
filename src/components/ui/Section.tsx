import { cn } from "@/lib/utils";

export type SectionTone = "light" | "sage" | "dark" | "image";

const toneClassName: Record<SectionTone, string> = {
  light: "bg-canvas",
  sage: "bg-surface-sage",
  dark: "bg-surface-dark relative overflow-hidden",
  image: "",
};

const toneDataAttr: Partial<Record<SectionTone, "light" | "sage">> = {
  light: "light",
  sage: "sage",
};

export function Section({
  children,
  id,
  tone = "light",
  flush = false,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  tone?: SectionTone;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-tone={toneDataAttr[tone]}
      className={cn(
        !flush && "py-14 lg:py-24",
        toneClassName[tone],
        className
      )}
    >
      {children}
    </section>
  );
}
