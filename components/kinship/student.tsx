import { cn, deterministicColor } from "@/lib/utils";

interface StudentAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

/** Color-coded initials circle. Color is deterministic from name. */
export function StudentAvatar({ name, size = "md", className }: StudentAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const bg = deterministicColor(name);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium text-white flex-shrink-0",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: bg }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

type StatusType = "active" | "struggling" | "needs-attention" | "inactive" | "offline";

const statusDotColor: Record<StatusType, string> = {
  "active":          "bg-green-500",
  "struggling":      "bg-red-500",
  "needs-attention": "bg-amber-500",
  "inactive":        "bg-gray-300",
  "offline":         "bg-gray-400",
};

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
}

/** Colored status dot */
export function StudentStatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn("inline-block w-2 h-2 rounded-full", statusDotColor[status], className)}
      title={status}
    />
  );
}
