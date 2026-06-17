export type PrototypeType =
  | "slide"
  | "animation"
  | "3d"
  | "dashboard"
  | "survey"
  | "other";

export interface SlackMessage {
  /** Role of the sender */
  role: "user" | "hermes";
  /** Display name */
  name: string;
  /** Message content (verbatim) */
  content: string;
  /** ISO timestamp */
  timestamp?: string;
}

export interface PrototypeManifest {
  /** URL-safe slug — matches the Next.js route path (e.g. "colour-palette") */
  slug: string;
  /** Human-readable name */
  name: string;
  /** 1–2 sentence description of what this prototype does */
  description: string;
  /** Short prompt shown on the card (verbatim user request, may be truncated) */
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
  /** Filename of the thumbnail relative to public/prototypes/<slug>/ */
  thumbnail: string;

  // ─── Rich context for the detail drawer ────────────────────────────────

  /** Full verbatim Slack request (may be longer than prompt) */
  full_prompt?: string;
  /** The Slack channel or DM where the request was made */
  slack_channel?: string;
  /** Session ID in the Hermes session DB */
  session_id?: string;
  /** Key design decisions Hermes made while building */
  design_decisions?: string[];
  /** Technical implementation notes */
  tech_notes?: string[];
  /** What makes this prototype notable */
  what_made_it_special?: string;
  /** Reconstructed Slack thread messages (user + Hermes turns, trimmed for clarity) */
  slack_thread?: SlackMessage[];
  /** Admin access code if the prototype has a gated admin view */
  admin_code?: string;
  /** Admin URL if different from the main URL */
  admin_url?: string;
}
