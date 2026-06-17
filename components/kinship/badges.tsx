import { cn } from "@/lib/utils";

type SubjectKey = "math" | "reading" | "science" | "social" | "hebrew" | "cs";

const subjectColors: Record<SubjectKey, string> = {
  math:    "#8B5CF6",
  reading: "#F59E0B",
  science: "#22C55E",
  social:  "#06B6D4",
  hebrew:  "#EC4899",
  cs:      "#3B82F6",
};

interface SubjectBadgeProps {
  subject: SubjectKey | string;
  className?: string;
}

/** Monochromatic pill badge — subject colors reserved for charts only */
export function SubjectBadge({ subject, className }: SubjectBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-[color-mix(in_oklch,var(--kinship-mid)_8%,transparent)]",
        "border border-[color-mix(in_oklch,var(--kinship-mid)_25%,transparent)]",
        "text-[var(--kinship-ink)]",
        className
      )}
    >
      {subject}
    </span>
  );
}

interface PlatformBadgeProps {
  platform: string;
  className?: string;
}

/** Same as SubjectBadge but for platform names */
export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-[color-mix(in_oklch,var(--kinship-mid)_8%,transparent)]",
        "border border-[color-mix(in_oklch,var(--kinship-mid)_25%,transparent)]",
        "text-[var(--kinship-ink)]",
        className
      )}
    >
      {platform}
    </span>
  );
}

/** Dot badge for subject color in charts */
export function SubjectDot({ subject }: { subject: SubjectKey | string }) {
  const color = subjectColors[subject as SubjectKey] ?? "var(--kinship-dim)";
  return <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
}
