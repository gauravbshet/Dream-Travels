import { cn } from "@/lib/utils";

export type SectionTone = "light" | "sage" | "dark" | "image";

const toneClassName: Record<SectionTone, string> = {
  light: "bg-canvas",
  sage: "bg-surface-sage",
  dark: "bg-surface-dark relative overflow-hidden",
  image: "bg-canvas",
};

// Every tone sets an explicit data-tone — none of them may rely on an
// implicit ":root" default, since that default is not guaranteed to stay
// dark (see globals.css history). "image" sections sit on the same light
// canvas as a regular section — headings, captions, etc. outside the photo
// tiles must read as section foreground (dark-on-light), not image-overlay
// foreground. Photo tiles that overlay text directly on a darkened photo
// must opt into `data-tone="dark"` locally, scoped to just that tile, so the
// light-on-dark pairing never leaks into the surrounding section chrome.
const toneDataAttr: Record<SectionTone, "light" | "sage" | "dark"> = {
  light: "light",
  sage: "sage",
  dark: "dark",
  image: "light",
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
        !flush && "py-2.5 sm:py-3.5 lg:py-4.5",
        toneClassName[tone],
        className
      )}
    >
      {children}
    </section>
  );
}
