import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: string; // CSS color value
  className?: string;
}

/** Single metric card — Kinship stat card design */
export function StatCard({ label, value, subtext, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        "bg-[color-mix(in_oklch,var(--kinship-mid)_6%,white)]",
        "border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)]",
        className
      )}
    >
      <p className="section-label mb-3">{label}</p>
      <p
        className="text-serif text-3xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-[var(--kinship-dim)]">{subtext}</p>
      )}
    </div>
  );
}

interface StatGridProps {
  children: React.ReactNode;
  className?: string;
}

/** Responsive 4→2→1 column stat grid */
export function StatGrid({ children, className }: StatGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
