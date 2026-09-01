// Registry: maps prototype slug → lazy-loaded page component
// Every new prototype page must be registered here after being built
// Slug comes from the Firestore document's `slug` field

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const registry: Record<string, ComponentType> = {
  "colour-palette": dynamic(() => import("@/app/colour-palette/page")),
  "type-scale": dynamic(() => import("@/app/type-scale/page")),
  "pomodoro-timer": dynamic(() => import("@/app/pomodoro-timer/page")),
  "kinship-brain-allhands": dynamic(
    () => import("@/app/kinship-brain-allhands/page")
  ),
  // Survey artifacts are served at /artifact/[uuid]/survey/[slug]
  // The /artifact/[uuid] page redirects there when proto.type === "survey"
  //
  "ai-gtm-sales-workflows": dynamic(() => import("@/app/ai-gtm-sales-workflows/page")),
  // ─── Add new prototypes below this line ────────────────────────────────
  "kinship-magazine-issue-1": dynamic(() => import("@/app/kinship-magazine-issue-1/page")),
  "collective-intelligence-magazine": dynamic(
    () => import("@/app/collective-intelligence-magazine/page")
  ),
  "meet-hermes": dynamic(() => import("@/app/meet-hermes/page")),
  "kinship-magazine-issue-2": dynamic(() => import("@/app/kinship-magazine-issue-2/page")),
  "kinship-magazine-issue-3": dynamic(() => import("@/app/kinship-magazine-issue-3/page")),
  "kinship-magazine-issue-4": dynamic(() => import("@/app/kinship-magazine-issue-4/page")),
  "kinship-magazine-issue-5": dynamic(() => import("@/app/kinship-magazine-issue-5/page")),
  "claude-for-teachers": dynamic(() => import("@/app/claude-for-teachers/page")),
  "ai-gtm-stack": dynamic(() => import("@/app/ai-gtm-stack/page")),
  "brenda-claude-training": dynamic(() => import("@/app/brenda-claude-training/page")),
  "yc-qm-multi-agent": dynamic(() => import("@/app/yc-qm-multi-agent/page")),
  "kinship-magazine-issue-6": dynamic(() => import("@/app/kinship-magazine-issue-6/page")),
  "kinship-magazine-issue-7": dynamic(() => import("@/app/kinship-magazine-issue-7/page")),
  "ai-security-briefing": dynamic(() => import("@/app/ai-security-briefing/page")),
  "kinship-crm-schema": dynamic(() => import("@/app/kinship-crm-schema/page")),
  "the-signal": dynamic(() => import("@/app/the-signal/page")),
  // ─── End new prototypes ────────────────────────────────────────────────────
};

export function getPrototypeComponent(slug: string): ComponentType | null {
  return registry[slug] ?? null;
}
