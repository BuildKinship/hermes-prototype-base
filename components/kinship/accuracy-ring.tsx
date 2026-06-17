import { cn, accuracyColor } from "@/lib/utils";

interface AccuracyRingProps {
  accuracy: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** SVG circular progress ring — color follows accuracy thresholds */
export function AccuracyRing({
  accuracy,
  size = 48,
  strokeWidth = 4,
  className,
}: AccuracyRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = accuracy ?? 0;
  const offset = circumference - (pct / 100) * circumference;
  const color = accuracyColor(accuracy);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="color-mix(in oklch, var(--kinship-dim) 20%, transparent)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      {accuracy !== null && (
        <span
          className="absolute text-xs font-medium"
          style={{ color, fontSize: size * 0.22 }}
        >
          {Math.round(accuracy)}
        </span>
      )}
    </div>
  );
}
