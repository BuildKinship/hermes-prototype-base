"use client";
// needed for search/filter/sort state and interactive gallery

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Box,
  LayoutDashboard,
  ClipboardList,
  Shapes,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrototypeManifest, PrototypeType } from "@/types/manifest";

/* ─── Constants ─────────────────────────────────────────── */

const TYPE_META: Record<
  PrototypeType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  slide: { label: "Slide Deck", icon: Layers, color: "var(--subject-reading)" },
  animation: { label: "Animation", icon: Sparkles, color: "var(--subject-math)" },
  "3d": { label: "3D / Interactive", icon: Box, color: "var(--subject-science)" },
  dashboard: { label: "Dashboard", icon: LayoutDashboard, color: "var(--kinship-mid)" },
  survey: { label: "Survey", icon: ClipboardList, color: "var(--subject-writing)" },
  other: { label: "Other", icon: Shapes, color: "var(--kinship-dim)" },
};

type SortKey = "newest" | "oldest" | "creator" | "name";

/* ─── Sub-components ────────────────────────────────────── */

function TypeBadge({ type }: { type: PrototypeType }) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border"
      style={{
        color: meta.color,
        borderColor: meta.color,
        background: `color-mix(in oklch, ${meta.color} 10%, transparent)`,
      }}
    >
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

function PrototypeCard({ m }: { m: PrototypeManifest }) {
  const date = new Date(m.created_at).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const initials = m.created_by_name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border flex flex-col overflow-hidden"
      style={{ borderColor: "color-mix(in oklch, var(--kinship-dim) 40%, transparent)" }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: "color-mix(in oklch, var(--kinship-mid) 6%, var(--kinship-cream))" }}
      >
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center group"
        >
          {m.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/prototypes/${m.slug}/thumbnail.png`}
              alt={m.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "color-mix(in oklch, var(--kinship-mid) 8%, var(--kinship-cream))" }}
            >
              <span className="text-4xl opacity-20">⬡</span>
            </div>
          )}
          {/* hover overlay */}
          <div className="absolute inset-0 bg-[var(--kinship-ink)] opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
              style={{ background: "var(--kinship-ink)", color: "var(--kinship-cream)" }}
            >
              <ExternalLink className="w-3 h-3" /> Open
            </span>
          </div>
        </a>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1" style={{ background: "white" }}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-sm leading-snug"
            style={{ color: "var(--kinship-ink)" }}
          >
            {m.name}
          </h3>
          <TypeBadge type={m.type} />
        </div>

        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--kinship-mid)" }}>
          {m.description}
        </p>

        {/* Prompt excerpt */}
        <div
          className="rounded-md px-3 py-2 text-xs italic line-clamp-2"
          style={{
            background: "color-mix(in oklch, var(--kinship-cream) 60%, transparent)",
            color: "var(--kinship-mid)",
            borderLeft: "2px solid var(--kinship-dim)",
          }}
        >
          "{m.prompt}"
        </div>

        {/* Tags */}
        {m.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {m.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "color-mix(in oklch, var(--kinship-dim) 20%, transparent)",
                  color: "var(--kinship-mid)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: "var(--kinship-mid)", color: "white" }}
            >
              {initials}
            </div>
            <span className="text-xs" style={{ color: "var(--kinship-mid)" }}>
              {m.created_by_name}
            </span>
          </div>
          <span className="text-[11px]" style={{ color: "var(--kinship-dim)" }}>
            {date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Gallery Client ───────────────────────────────── */

export function GalleryClient({ manifests }: { manifests: PrototypeManifest[] }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<PrototypeType | "all">("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");

  // Collect all unique tags from manifests
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    manifests.forEach((m) => m.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [manifests]);

  // All unique creators
  const allCreators = useMemo(() => {
    const names = new Set(manifests.map((m) => m.created_by_name));
    return Array.from(names).sort();
  }, [manifests]);

  const filtered = useMemo(() => {
    let list = [...manifests];

    // Text search across name, prompt, description, creator, tags
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.prompt.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.created_by_name.toLowerCase().includes(q) ||
          m.tags.some((t) => t.includes(q))
      );
    }

    if (activeType !== "all") {
      list = list.filter((m) => m.type === activeType);
    }

    if (activeTag) {
      list = list.filter((m) => m.tags.includes(activeTag));
    }

    // Sort
    switch (sort) {
      case "newest":
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "creator":
        list.sort((a, b) => a.created_by_name.localeCompare(b.created_by_name));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [manifests, query, activeType, activeTag, sort]);

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--kinship-cream)", color: "var(--kinship-ink)" }}
    >
      {/* Header */}
      <div
        className="border-b px-6 py-8"
        style={{ borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-2">kinship prototype engine</p>
          <h1 className="text-serif text-4xl font-bold mb-1">Prototype Gallery</h1>
          <p className="text-sm" style={{ color: "var(--kinship-mid)" }}>
            {manifests.length} prototype{manifests.length !== 1 ? "s" : ""} built by the team
          </p>
        </div>
      </div>

      {/* Controls */}
      <div
        className="sticky top-0 z-10 border-b px-6 py-4 backdrop-blur-sm"
        style={{
          borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)",
          background: "color-mix(in oklch, var(--kinship-cream) 90%, transparent)",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--kinship-dim)" }}
            />
            <input
              type="text"
              placeholder="Search by name, prompt, creator, tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm outline-none focus:ring-2"
              style={{
                background: "white",
                borderColor: "var(--kinship-dim)",
                color: "var(--kinship-ink)",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--kinship-dim)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["all", ...Object.keys(TYPE_META)] as (PrototypeType | "all")[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
                  activeType === t ? "border-transparent" : "bg-white"
                )}
                style={
                  activeType === t
                    ? { background: "var(--kinship-ink)", color: "var(--kinship-cream)", borderColor: "var(--kinship-ink)" }
                    : { borderColor: "var(--kinship-dim)", color: "var(--kinship-mid)" }
                }
              >
                {t === "all" ? "All types" : TYPE_META[t as PrototypeType].label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border px-3 py-1.5 text-xs outline-none"
            style={{
              background: "white",
              borderColor: "var(--kinship-dim)",
              color: "var(--kinship-mid)",
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="creator">By creator</option>
            <option value="name">By name</option>
          </select>
        </div>

        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="max-w-6xl mx-auto mt-3 flex gap-2 flex-wrap">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded font-mono border transition-all duration-150",
                  activeTag === tag ? "border-transparent" : ""
                )}
                style={
                  activeTag === tag
                    ? { background: "var(--kinship-mid)", color: "white", borderColor: "var(--kinship-mid)" }
                    : {
                        background: "color-mix(in oklch, var(--kinship-dim) 20%, transparent)",
                        color: "var(--kinship-mid)",
                        borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)",
                      }
                }
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: "var(--kinship-dim)" }}>
            <p className="text-2xl mb-2">No prototypes found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-6" style={{ color: "var(--kinship-dim)" }}>
              {filtered.length} of {manifests.length} prototype{manifests.length !== 1 ? "s" : ""}
            </p>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((m) => (
                  <PrototypeCard key={m.slug} m={m} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
