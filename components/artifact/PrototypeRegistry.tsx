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
  // ─── Add new prototypes below this line ────────────────────────────────
  "kinship-magazine-issue-1": dynamic(() => import("@/app/kinship-magazine-issue-1/page")),
  "collective-intelligence-magazine": dynamic(
    () => import("@/app/collective-intelligence-magazine/page")
  ),
  "meet-hermes": dynamic(() => import("@/app/meet-hermes/page")),
  "kinship-magazine-issue-2": dynamic(() => import("@/app/kinship-magazine-issue-2/page")),
  "kinship-magazine-issue-3": dynamic(() => import("@/app/kinship-magazine-issue-3/page")),
};

export function getPrototypeComponent(slug: string): ComponentType | null {
  return registry[slug] ?? null;
}
