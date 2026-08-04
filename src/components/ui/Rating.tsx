import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviews,
  className,
}: {
  value: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="h-3.5 w-3.5 fill-amber text-amber" />
      <span className="font-semibold text-ink">{value.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-ink-muted">({reviews})</span>
      )}
    </div>
  );
}
