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
        "relative left-1/2 -translate-x-1/2 min-w-[100vw] max-w-none flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 snap-x snap-mandatory",
        "sm:px-6 lg:left-0 lg:translate-x-0 lg:min-w-full lg:max-w-full lg:px-0 lg:grid lg:overflow-visible lg:pb-0 lg:snap-none",
        gridClassName,
        className
      )}
    >
      {children}
    </div>
  );
}
