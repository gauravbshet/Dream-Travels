import { cn } from "@/lib/utils";

export function ResponsiveScroller({
  children,
  className,
  gridClassName,
}: {
  children: React.ReactNode;
  className?: string;
  gridClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto no-scrollbar px-4 -mx-4 sm:px-6 sm:-mx-6 pb-2 snap-x snap-mandatory",
        "lg:grid lg:overflow-visible lg:px-0 lg:mx-0 lg:pb-0 lg:snap-none",
        gridClassName,
        className
      )}
    >
      {children}
    </div>
  );
}
