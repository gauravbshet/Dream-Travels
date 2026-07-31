import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviews,
  light = false,
  className,
}: {
  value: number;
  reviews?: number;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
      <span className={cn("font-semibold", light ? "text-white" : "text-ink")}>
        {value.toFixed(1)}
      </span>
      {reviews !== undefined && (
        <span className={light ? "text-white/70" : "text-ink/50"}>
          ({reviews})
        </span>
      )}
    </div>
  );
}
