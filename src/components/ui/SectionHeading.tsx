import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-2 sm:mb-2.5 lg:mb-3",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      <h2 className="display-section text-ink">{title}</h2>
      {description && (
        <p
          className={cn(
            "prose-measure mt-1 sm:mt-1.5 text-sm sm:text-base leading-relaxed text-ink-muted",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
