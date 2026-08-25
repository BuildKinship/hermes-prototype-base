"use client";
// Client component — interactive entity explorer with copy-to-clipboard functionality

import React, { useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { entities, relationships, dataQualityFlags, migrationOrder } from "@/mock/crm-schema";
import type { Entity, Field, FieldType, FieldFlag } from "@/mock/crm-schema";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  ink: "var(--kinship-ink)",
  cream: "var(--kinship-cream)",
  mid: "var(--kinship-mid)",
  dim: "var(--kinship-dim)",
};

// ─── Field type pill config ───────────────────────────────────────────────────
const TYPE_CONFIG: Record<FieldType, { label: string; bg: string; text: string; dot: string }> = {
  title:        { label: "title",        bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  id:           { label: "ID",           bg: "#faf5ff", text: "#7c3aed", dot: "#8b5cf6" },
  text:         { label: "text",         bg: "#f9fafb", text: "#374151", dot: "#9ca3af" },
  select:       { label: "select",       bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  "multi-select": { label: "multi-sel", bg: "#fefce8", text: "#854d0e", dot: "#eab308" },
  number:       { label: "number",       bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  date:         { label: "date",         bg: "#f0f9ff", text: "#0c4a6e", dot: "#0ea5e9" },
  person:       { label: "person",       bg: "#fdf4ff", text: "#6b21a8", dot: "#a855f7" },
  url:          { label: "URL",          bg: "#f0fdf4", text: "#065f46", dot: "#10b981" },
  email:        { label: "email",        bg: "#ecfdf5", text: "#065f46", dot: "#34d399" },
  phone:        { label: "phone",        bg: "#f0fdf4", text: "#065f46", dot: "#6ee7b7" },
  checkbox:     { label: "checkbox",     bg: "#fafafa", text: "#52525b", dot: "#71717a" },
  rollup:       { label: "rollup",       bg: "#fff1f2", text: "#9f1239", dot: "#f43f5e" },
  relation:     { label: "→ relation",   bg: "#eff6ff", text: "#1e40af", dot: "#60a5fa" },
  status:       { label: "status",       bg: "#f0fdf4", text: "#166534", dot: "#86efac" },
  files:        { label: "files",        bg: "#f9fafb", text: "#374151", dot: "#d1d5db" },
};

const FLAG_CONFIG: Record<FieldFlag, { icon: string; label: string; color: string }> = {
  "migration-key": { icon: "🔑", label: "Join key",     color: "#d97706" },
  "broken":        { icon: "🔴", label: "Broken",       color: "#dc2626" },
  "warning":       { icon: "⚠️", label: "Warning",      color: "#d97706" },
  "automation":    { icon: "⚡", label: "Automation",   color: "#7c3aed" },
  "non-crm":       { icon: "📦", label: "Non-CRM",      color: "#6b7280" },
  "duplicate":     { icon: "♻️", label: "Duplicate",    color: "#ef4444" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function fieldToText(field: Field): string {
  let out = `${field.name} (${field.type})`;
  if (field.values?.length) out += ` — [${field.values.join(", ")}]`;
  if (field.notes) out += ` · ${field.notes}`;
  if (field.flags?.length) out += ` · [${field.flags.join(", ")}]`;
  return out;
}

function entityToMarkdown(entity: Entity): string {
  const lines: string[] = [
    `## ${entity.emoji} ${entity.name}`,
    `**CRM analog:** ${entity.crmAnalog}`,
    `**Description:** ${entity.description}`,
    ``,
    `| Property | Type | Notes |`,
    `|---|---|---|`,
    ...entity.fields.map((f) => {
      const type = f.type === "relation" ? `→ ${f.relatesTo ?? "?"}` : f.type;
      const notes = [f.notes, f.values?.length ? `Values: ${f.values.join(", ")}` : "", f.flags?.map((fl) => FLAG_CONFIG[fl].label).join(", ") ?? ""]
        .filter(Boolean)
        .join(" · ");
      return `| ${f.name} | ${type} | ${notes} |`;
    }),
  ];
  if (entity.dataQualityNotes?.length) {
    lines.push("", "**⚠️ Data quality notes:**");
    entity.dataQualityNotes.forEach((n) => lines.push(`- ${n}`));
  }
  return lines.join("\n");
}

function allEntitiesToMarkdown(): string {
  return [
    `# Kinship Brain — CRM Entity Schemas`,
    `*Captured from live Notion introspection, Aug 25, 2026*`,
    ``,
    entities.map(entityToMarkdown).join("\n\n---\n\n"),
    ``,
    `---`,
    ``,
    `## Migration order`,
    migrationOrder.map((m) => `${m.step}. **${m.entity}** — ${m.reason}`).join("\n"),
  ].join("\n");
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ getText, label = "Copy", variant = "ghost" }: { getText: () => string; label?: string; variant?: "ghost" | "solid" }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const handle = useCallback(() => {
    navigator.clipboard.writeText(getText()).then(() => {
      setState("copied");
      setTimeout(() => setState("idle"), 1800);
    });
  }, [getText]);

  const base = "inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-2.5 py-1 transition-all cursor-pointer select-none";
  const styles =
    variant === "solid"
      ? "bg-[var(--kinship-ink)] text-[var(--kinship-cream)] hover:opacity-80"
      : state === "copied"
      ? "bg-green-100 text-green-700 border border-green-200"
      : "border border-[#e2e8f0] text-[var(--kinship-mid)] hover:bg-[#f8fafc] hover:text-[var(--kinship-ink)]";

  return (
    <button onClick={handle} className={cn(base, styles)}>
      {state === "copied" ? (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="4" y="1" width="7" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="3" width="7" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" fill="var(--kinship-cream)"/></svg>
          {label}
        </>
      )}
    </button>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({ field, entityColor }: { field: Field; entityColor: string }) {
  const tc = TYPE_CONFIG[field.type];
  const isRelation = field.type === "relation";
  const isBroken = field.flags?.includes("broken");
  const isWarning = field.flags?.includes("warning") || field.flags?.includes("duplicate");
  const isKey = field.flags?.includes("migration-key");

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-2.5 border-b border-[#f1f5f9] last:border-0 hover:bg-[#fafbff] transition-colors group",
        isBroken && "bg-red-50/40 hover:bg-red-50",
        isWarning && "bg-amber-50/30 hover:bg-amber-50/60"
      )}
    >
      {/* Type pill */}
      <span
        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5"
        style={{ background: tc.bg, color: tc.text }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tc.dot }} />
        {tc.label}
      </span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-[var(--kinship-ink)] leading-snug">
            {field.name}
          </span>
          {isRelation && field.relatesTo && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
              → {field.relatesTo}
            </span>
          )}
          {field.flags?.map((flag) => {
            const fc = FLAG_CONFIG[flag];
            return (
              <span
                key={flag}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: fc.color + "18", color: fc.color }}
                title={fc.label}
              >
                {fc.icon} {fc.label}
              </span>
            );
          })}
        </div>
        {field.notes && (
          <p className="text-[11px] text-[var(--kinship-dim)] mt-0.5 leading-relaxed">{field.notes}</p>
        )}
        {field.values && field.values.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {field.values.map((v) => (
              <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-[#f8fafc] border border-[#e8edf3] text-[var(--kinship-mid)]">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Entity card ──────────────────────────────────────────────────────────────
function EntityCard({ entity, isActive, onClick }: { entity: Entity; isActive: boolean; onClick: () => void }) {
  const fieldCount = entity.fields.length;
  const relationCount = entity.fields.filter((f) => f.type === "relation").length;
  const flagCount = entity.fields.filter((f) => f.flags && f.flags.length > 0).length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all hover:shadow-sm group",
        isActive
          ? "border-[var(--entity-color)] shadow-sm"
          : "border-[#e2e8f0] hover:border-[#cbd5e1]"
      )}
      style={
        {
          "--entity-color": entity.color,
          background: isActive ? entity.accentColor : "white",
        } as React.CSSProperties
      }
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{entity.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className="font-semibold text-sm"
              style={{ color: isActive ? entity.color : T.ink }}
            >
              {entity.name}
            </span>
            {isActive && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ background: entity.color }}>
                OPEN
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--kinship-dim)] mt-0.5 leading-snug">{entity.crmAnalog}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[var(--kinship-mid)]">{fieldCount} fields</span>
            <span className="text-[10px] text-blue-500">{relationCount} relations</span>
            {flagCount > 0 && (
              <span className="text-[10px] text-amber-600">⚠️ {flagCount} flags</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Relation map mini diagram ─────────────────────────────────────────────────
function RelationMap({ activeEntityId, onSelect }: { activeEntityId: string | null; onSelect: (id: string) => void }) {
  const entityMap = Object.fromEntries(entities.map((e) => [e.id, e]));

  // Group: from Schools (1 col), then the rest
  const schoolRelations = relationships.filter((r) => r.from === "schools");
  const otherRelations = relationships.filter((r) => r.from !== "schools");

  return (
    <div className="rounded-xl border border-[#e2e8f0] overflow-hidden">
      <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--kinship-ink)]">Relation Map</h3>
        <span className="text-[11px] text-[var(--kinship-dim)]">Click entity to explore</span>
      </div>
      <div className="p-4 space-y-3">
        {/* Schools keystone */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => onSelect("schools")}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 font-semibold text-sm transition-all"
            style={{
              borderColor: activeEntityId === "schools" ? entityMap["schools"].color : "#e2e8f0",
              background: activeEntityId === "schools" ? entityMap["schools"].accentColor : "white",
              color: entityMap["schools"].color,
            }}
          >
            <span>🏫</span> Schools
            <span className="text-[10px] font-normal ml-1 opacity-70">keystone</span>
          </button>
          <div className="flex-1 space-y-1 pt-1">
            {schoolRelations.map((rel) => {
              const target = entityMap[rel.to];
              if (!target) return null;
              return (
                <div key={rel.to} className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--kinship-dim)] w-4">├─</span>
                  <button
                    onClick={() => onSelect(rel.to)}
                    className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-all"
                    style={{
                      background: activeEntityId === rel.to ? target.accentColor : "#f8fafc",
                      color: activeEntityId === rel.to ? target.color : T.ink,
                      border: `1px solid ${activeEntityId === rel.to ? target.color + "60" : "#e2e8f0"}`,
                    }}
                  >
                    {target.emoji} {target.name}
                  </button>
                  <span className="text-[10px] text-[var(--kinship-dim)]">{rel.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cross relations */}
        <div className="border-t border-[#f1f5f9] pt-3">
          <p className="text-[11px] font-medium text-[var(--kinship-dim)] mb-2">Cross-entity relations</p>
          <div className="space-y-1.5">
            {otherRelations.map((rel, i) => {
              const from = entityMap[rel.from];
              const to = entityMap[rel.to];
              if (!from || !to) return null;
              return (
                <div key={i} className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => onSelect(rel.from)}
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ background: from.accentColor, color: from.color }}
                  >
                    {from.emoji} {from.name}
                  </button>
                  <span className="text-[11px] text-[var(--kinship-dim)]">──→</span>
                  <button
                    onClick={() => onSelect(rel.to)}
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ background: to.accentColor, color: to.color }}
                  >
                    {to.emoji} {to.name}
                  </button>
                  <span className="text-[10px] text-[var(--kinship-dim)]">{rel.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Data quality panel ───────────────────────────────────────────────────────
function DataQualityPanel() {
  const SEVERITY_CONFIG = {
    critical: { bg: "#fff1f2", border: "#fecdd3", text: "#9f1239", badge: "#e11d48", icon: "🔴" },
    warning:  { bg: "#fffbeb", border: "#fde68a", text: "#854d0e", badge: "#d97706", icon: "⚠️" },
    info:     { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", badge: "#3b82f6", icon: "ℹ️" },
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] overflow-hidden">
      <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--kinship-ink)]">Data Quality Flags</h3>
        <span className="text-[11px] text-[var(--kinship-dim)]">Resolve before Reevo migration</span>
      </div>
      <div className="divide-y divide-[#f1f5f9]">
        {dataQualityFlags.map((flag) => {
          const sc = SEVERITY_CONFIG[flag.severity as keyof typeof SEVERITY_CONFIG];
          return (
            <div key={flag.id} className="p-4" style={{ background: sc.bg }}>
              <div className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">{sc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: sc.text }}>
                      {flag.title}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white" style={{ background: sc.badge }}>
                      {flag.entity}
                    </span>
                    {flag.field && (
                      <code className="text-[10px] px-1.5 py-0.5 rounded bg-white/60 border font-mono" style={{ borderColor: sc.border, color: sc.text }}>
                        {flag.field}
                      </code>
                    )}
                  </div>
                  <p className="text-[12px] mt-1 leading-relaxed" style={{ color: sc.text }}>
                    {flag.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Migration order panel ─────────────────────────────────────────────────────
function MigrationPanel({ onSelect }: { onSelect: (id: string) => void }) {
  const entityMap = Object.fromEntries(entities.map((e) => [e.id, e]));
  const copyText = migrationOrder.map((m) => `${m.step}. ${m.entity} — ${m.reason}`).join("\n");

  return (
    <div className="rounded-xl border border-[#e2e8f0] overflow-hidden">
      <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--kinship-ink)]">Migration Order</h3>
        <CopyButton getText={() => copyText} label="Copy order" />
      </div>
      <div className="divide-y divide-[#f1f5f9]">
        {migrationOrder.map((m) => {
          const entity = entityMap[m.entity.toLowerCase().replace(" ", "-")] || 
            entities.find((e) => e.name === m.entity);
          return (
            <div key={m.step} className="flex items-center gap-3 px-4 py-3">
              <span className="w-6 h-6 rounded-full bg-[var(--kinship-ink)] text-[var(--kinship-cream)] text-xs font-bold flex items-center justify-center shrink-0">
                {m.step}
              </span>
              {entity ? (
                <button
                  onClick={() => onSelect(entity.id)}
                  className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                  style={{ color: entity.color }}
                >
                  {entity.emoji} {m.entity}
                </button>
              ) : (
                <span className="text-sm font-medium text-[var(--kinship-ink)]">{m.entity}</span>
              )}
              <span className="text-[11px] text-[var(--kinship-dim)] flex-1">{m.reason}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function KinshipCrmSchemaPage() {
  const [activeEntityId, setActiveEntityId] = useState<string>(entities[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"fields" | "quality">("fields");
  const detailRef = useRef<HTMLDivElement>(null);

  const activeEntity = entities.find((e) => e.id === activeEntityId) ?? entities[0];

  const filteredFields = activeEntity.fields.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.notes?.toLowerCase().includes(q) ||
      f.values?.some((v) => v.toLowerCase().includes(q))
    );
  });

  const handleSelect = (id: string) => {
    setActiveEntityId(id);
    setSearchQuery("");
    setActiveTab("fields");
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const entityTsv = activeEntity.fields
    .map((f) => `${f.name}\t${f.type}${f.relatesTo ? ` → ${f.relatesTo}` : ""}\t${f.values?.join(", ") ?? ""}\t${f.notes ?? ""}\t${f.flags?.join(", ") ?? ""}`)
    .join("\n");

  const entityCsvHeader = "Property,Type,Values,Notes,Flags\n";
  const entityCsv = entityCsvHeader + activeEntity.fields
    .map((f) => `"${f.name}","${f.type}${f.relatesTo ? ` → ${f.relatesTo}` : ""}","${f.values?.join("; ") ?? ""}","${f.notes ?? ""}","${f.flags?.join(", ") ?? ""}"`)
    .join("\n");

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--kinship-cream)", fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 border-b border-[#e2e8f0] px-4 sm:px-8"
        style={{ background: "var(--kinship-cream)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg">🧠</span>
            <div className="min-w-0">
              <h1 className="font-bold text-[var(--kinship-ink)] text-sm sm:text-base leading-tight truncate">
                Kinship Brain — CRM Schemas
              </h1>
              <p className="text-[11px] text-[var(--kinship-dim)] hidden sm:block">
                7 entities · Live Notion introspection · Aug 25, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CopyButton
              getText={allEntitiesToMarkdown}
              label="Copy all (MD)"
              variant="solid"
            />
          </div>
        </div>
      </header>

      {/* ── Entity type legend ── */}
      <div className="border-b border-[#e2e8f0] bg-white/60 px-4 sm:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-2 min-w-max">
          {entities.map((e) => (
            <button
              key={e.id}
              onClick={() => handleSelect(e.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: activeEntityId === e.id ? e.color : "transparent",
                color: activeEntityId === e.id ? "white" : e.color,
                border: `1px solid ${e.color}40`,
              }}
            >
              {e.emoji} {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* ── Left: entity list + maps ── */}
        <aside className="space-y-4">
          {/* Entity cards */}
          <div className="space-y-2">
            {entities.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                isActive={activeEntityId === entity.id}
                onClick={() => handleSelect(entity.id)}
              />
            ))}
          </div>

          {/* Relation map */}
          <RelationMap activeEntityId={activeEntityId} onSelect={handleSelect} />

          {/* Migration order */}
          <MigrationPanel onSelect={handleSelect} />
        </aside>

        {/* ── Right: entity detail ── */}
        <main ref={detailRef} className="space-y-4">
          {/* Entity header */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: activeEntity.color + "50", background: activeEntity.accentColor }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{activeEntity.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold" style={{ color: activeEntity.color }}>
                      {activeEntity.name}
                    </h2>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: activeEntity.color + "20", color: activeEntity.color }}
                    >
                      {activeEntity.crmAnalog}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--kinship-mid)] mt-1 max-w-xl">
                    {activeEntity.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <CopyButton
                  getText={() => entityTsv}
                  label="Copy TSV"
                />
                <CopyButton
                  getText={() => entityCsv}
                  label="Copy CSV"
                />
                <CopyButton
                  getText={() => entityToMarkdown(activeEntity)}
                  label="Copy MD"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t flex-wrap" style={{ borderColor: activeEntity.color + "30" }}>
              {[
                { label: "Total fields", value: activeEntity.fields.length },
                { label: "Relations", value: activeEntity.fields.filter((f) => f.type === "relation").length },
                { label: "Select/multi", value: activeEntity.fields.filter((f) => ["select", "multi-select", "status"].includes(f.type)).length },
                { label: "Quality flags", value: activeEntity.fields.filter((f) => f.flags && f.flags.length > 0).length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold" style={{ color: activeEntity.color }}>{s.value}</div>
                  <div className="text-[11px] text-[var(--kinship-dim)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#e2e8f0] pb-0">
            {(["fields", "quality"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px"
                style={{
                  borderColor: activeTab === tab ? activeEntity.color : "transparent",
                  color: activeTab === tab ? activeEntity.color : T.mid,
                }}
              >
                {tab === "fields" ? `Fields (${activeEntity.fields.length})` : `Data Quality`}
              </button>
            ))}
          </div>

          {activeTab === "fields" && (
            <>
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kinship-dim)]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder={`Search ${activeEntity.fields.length} fields…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border border-[#e2e8f0] bg-white focus:outline-none focus:border-[var(--entity-color)] transition-colors"
                  style={{ "--entity-color": activeEntity.color } as React.CSSProperties}
                />
              </div>

              {/* Field type legend */}
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(activeEntity.fields.map((f) => f.type))).map((type) => {
                  const tc = TYPE_CONFIG[type];
                  const count = activeEntity.fields.filter((f) => f.type === type).length;
                  return (
                    <span key={type} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: tc.dot }} />
                      {tc.label} ({count})
                    </span>
                  );
                })}
              </div>

              {/* Fields list */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white overflow-hidden">
                {filteredFields.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[var(--kinship-dim)] text-sm">
                    No fields match "{searchQuery}"
                  </div>
                ) : (
                  filteredFields.map((field) => (
                    <FieldRow key={field.name} field={field} entityColor={activeEntity.color} />
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "quality" && (
            <div className="space-y-4">
              {activeEntity.dataQualityNotes && activeEntity.dataQualityNotes.length > 0 ? (
                <>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-amber-200">
                      <h3 className="text-sm font-semibold text-amber-900">Notes for {activeEntity.name}</h3>
                    </div>
                    <div className="divide-y divide-amber-100">
                      {activeEntity.dataQualityNotes.map((note, i) => (
                        <div key={i} className="flex gap-3 px-4 py-3">
                          <span className="text-amber-500 shrink-0">⚠️</span>
                          <p className="text-sm text-amber-800 leading-relaxed">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center">
                  <p className="text-green-700 font-medium text-sm">No data quality issues for {activeEntity.name}</p>
                </div>
              )}

              <DataQualityPanel />
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e2e8f0] px-4 sm:px-8 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <p className="text-[11px] text-[var(--kinship-dim)]">
            Kinship Brain CRM · 7 entities · Live Notion introspection, Aug 25, 2026 · For Reevo evaluation
          </p>
          <CopyButton getText={allEntitiesToMarkdown} label="Copy all schemas (Markdown)" variant="solid" />
        </div>
      </footer>
    </div>
  );
}
