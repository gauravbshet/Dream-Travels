import { cn } from "@/lib/utils";

export function Section({
  children,
  id,
  tone = "light",
  flush = false,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  tone?: "light" | "dark";
  flush?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        !flush && "py-10 lg:py-16",
        tone === "dark" && "bg-ink relative overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}
