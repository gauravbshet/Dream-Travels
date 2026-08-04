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
        !flush && "py-14 lg:py-24",
        tone === "dark" && "bg-bg-deep relative overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}
