import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic color from a string (for StudentAvatar) */
export function deterministicColor(name: string): string {
  const colors = [
    "#7A5590", "#8B5CF6", "#F59E0B", "#22C55E",
    "#06B6D4", "#EC4899", "#3B82F6", "#EF4444",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Format a number as a percentage string */
export function pct(n: number, decimals = 0) {
  return `${n.toFixed(decimals)}%`;
}

/** Accuracy threshold → status color */
export function accuracyColor(accuracy: number | null): string {
  if (accuracy === null) return "var(--status-inactive)";
  if (accuracy >= 80) return "var(--status-success)";
  if (accuracy >= 60) return "var(--status-warning)";
  return "var(--status-danger)";
}

/** Accuracy threshold → Tailwind color class */
export function accuracyClass(accuracy: number | null): string {
  if (accuracy === null) return "text-gray-400";
  if (accuracy >= 80) return "text-green-500";
  if (accuracy >= 60) return "text-amber-500";
  return "text-red-500";
}

/** Slugify for branch names */
export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
