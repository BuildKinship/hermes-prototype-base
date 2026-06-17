export type PrototypeType =
  | "slide"
  | "animation"
  | "3d"
  | "dashboard"
  | "survey"
  | "other";

export interface PrototypeManifest {
  /** URL-safe slug — matches the Next.js route path (e.g. "colour-palette") */
  slug: string;
  /** Human-readable name */
  name: string;
  /** 1–2 sentence description of what this prototype does */
  description: string;
  /** Verbatim user request that triggered this prototype */
  prompt: string;
  /** Slack display name of the requester */
  created_by_name: string;
  /** Slack user ID of the requester (e.g. "U0AQ7SJRQ93") */
  created_by_slack_id: string;
  /** ISO 8601 timestamp */
  created_at: string;
  /** Prototype category */
  type: PrototypeType;
  /** Freeform tags for filtering (lowercase, hyphens) */
  tags: string[];
  /** Full GitHub branch name */
  branch: string;
  /** Public production URL */
  url: string;
  /** Kinship short link (may be empty if not yet shortened) */
  short_url: string;
  /** Relative path from prototypes/<slug>/ to thumbnail image */
  thumbnail: string;
}
