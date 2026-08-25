"use client";
// Client component — CRM schema explorer + sample data viewer

import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { entities, relationships, dataQualityFlags, migrationOrder } from "@/mock/crm-schema";
import type { Entity, Field, FieldType, FieldFlag } from "@/mock/crm-schema";
import { sampleDatasets } from "@/mock/crm-sample-data";

// ─── Field type config ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<FieldType, { label: string; color: string }> = {
  title:          { label: "title",     color: "#2563eb" },
  id:             { label: "ID",        color: "#7c3aed" },
  text:           { label: "text",      color: "#64748b" },
  select:         { label: "select",    color: "#059669" },
  "multi-select": { label: "multi",     color: "#b45309" },
  number:         { label: "number",    color: "#c2410c" },
  date:           { label: "date",      color: "#0369a1" },
  person:         { label: "person",    color: "#7c3aed" },
  url:            { label: "URL",       color: "#0f766e" },
  email:          { label: "email",     color: "#0f766e" },
  phone:          { label: "phone",     color: "#0f766e" },
  checkbox:       { label: "checkbox",  color: "#64748b" },
  rollup:         { label: "rollup",    color: "#be123c" },
  relation:       { label: "relation",  color: "#1d4ed8" },
  status:         { label: "status",    color: "#059669" },
  files:          { label: "files",     color: "#64748b" },
};

const FLAG_CONFIG: Record<FieldFlag, { icon: string; label: string }> = {
  "migration-key": { icon: "key",     label: "Join key"   },
  "broken":        { icon: "broken",  label: "Broken"     },
  "warning":       { icon: "warn",    label: "Warning"    },
  "automation":    { icon: "auto",    label: "Auto"       },
  "non-crm":       { icon: "pkg",     label: "Non-CRM"    },
  "duplicate":     { icon: "dup",     label: "Duplicate"  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function entityToMarkdown(entity: Entity): string {
  const lines: string[] = [
    `## ${entity.emoji} ${entity.name}`,
    `**CRM analog:** ${entity.crmAnalog}`,
    `**Description:** ${entity.description}`,
    ``,
    `| Property | Type | Notes |`,
    `|---|---|---|`,
    ...entity.fields.map((f) => {
      const type = f.type === "relation" ? `relation → ${f.relatesTo ?? "?"}` : f.type;
      const notes = [f.notes, f.values?.length ? f.values.join(", ") : "", f.flags?.map((fl) => FLAG_CONFIG[fl].label).join(", ") ?? ""]
        .filter(Boolean).join(" · ");
      return `| ${f.name} | ${type} | ${notes} |`;
    }),
  ];
  if (entity.dataQualityNotes?.length) {
    lines.push("", "**Data quality notes:**");
    entity.dataQualityNotes.forEach((n) => lines.push(`- ${n}`));
  }
  return lines.join("\n");
}

function allEntitiesToMarkdown(): string {
  return [
    `# Kinship Brain — CRM Entity Schemas`,
    `Source: live Notion introspection, Aug 25, 2026`,
    ``,
    entities.map(entityToMarkdown).join("\n\n---\n\n"),
    ``,
    `---`,
    ``,
    `## Migration order`,
    migrationOrder.map((m) => `${m.step}. **${m.entity}** — ${m.reason}`).join("\n"),
  ].join("\n");
}

function sampleDatasetToMarkdown(ds: typeof sampleDatasets[number]): string {
  const lines: string[] = [`# ${ds.label}`, `*${ds.type}*`, ``];

  // School
  lines.push(`## School`, `| Field | Value |`, `|---|---|`);
  for (const [k, v] of Object.entries(ds.school)) {
    lines.push(`| ${k} | ${v} |`);
  }

  // Member schools (TDSB)
  if ("memberSchools" in ds && ds.memberSchools) {
    lines.push(``, `## Member Schools`);
    ds.memberSchools.forEach((s) => {
      lines.push(``, `### ${s.schoolName}`, `| Field | Value |`, `|---|---|`);
      for (const [k, v] of Object.entries(s)) lines.push(`| ${k} | ${v} |`);
    });
  }

  // Contacts
  lines.push(``, `## Contacts`);
  ds.contacts.forEach((c) => {
    lines.push(``, `### ${c.name}`, `| Field | Value |`, `|---|---|`);
    for (const [k, v] of Object.entries(c)) lines.push(`| ${k} | ${v} |`);
  });

  // Deals
  lines.push(``, `## Deals`);
  ds.deals.forEach((d) => {
    lines.push(``, `### ${d.dealName}`, `| Field | Value |`, `|---|---|`);
    for (const [k, v] of Object.entries(d)) lines.push(`| ${k} | ${v} |`);
  });

  // Engagements
  lines.push(``, `## Engagements`);
  ds.engagements.forEach((e) => {
    lines.push(``, `### ${e.title}`, `| Field | Value |`, `|---|---|`);
    for (const [k, v] of Object.entries(e)) lines.push(`| ${k} | ${String(v)} |`);
  });

  // Accounts
  if (ds.accounts.length > 0) {
    lines.push(``, `## Customer Accounts`);
    (ds.accounts as Record<string, unknown>[]).forEach((a) => {
      lines.push(``, `### ${(a as { accountName: string }).accountName}`, `| Field | Value |`, `|---|---|`);
      for (const [k, v] of Object.entries(a)) lines.push(`| ${k} | ${v} |`);
    });
  }

  return lines.join("\n");
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ getText, label = "Copy" }: { getText: () => string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(() => {
    navigator.clipboard.writeText(getText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [getText]);
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all cursor-pointer"
      style={{
        borderColor: copied ? "#bbf7d0" : "#e2e8f0",
        background: copied ? "#f0fdf4" : "white",
        color: copied ? "#15803d" : "#64748b",
      }}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="1" width="7" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
            <rect x="1" y="3" width="7" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" fill="white" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ─── Flag badge ───────────────────────────────────────────────────────────────
const FLAG_STYLES: Record<FieldFlag, { bg: string; text: string; label: string }> = {
  "migration-key": { bg: "#fef9c3", text: "#854d0e", label: "join key" },
  "broken":        { bg: "#fee2e2", text: "#991b1b", label: "broken"   },
  "warning":       { bg: "#fef3c7", text: "#92400e", label: "warning"  },
  "automation":    { bg: "#ede9fe", text: "#5b21b6", label: "auto"     },
  "non-crm":       { bg: "#f1f5f9", text: "#475569", label: "non-crm" },
  "duplicate":     { bg: "#fee2e2", text: "#991b1b", label: "dup"      },
};

function FlagBadge({ flag }: { flag: FieldFlag }) {
  const s = FLAG_STYLES[flag];
  return (
    <span className="text-[10px] font-medium px-1.5 py-px rounded" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({ field }: { field: Field }) {
  const tc = TYPE_CONFIG[field.type];
  const [open, setOpen] = useState(false);
  const hasValues = field.values && field.values.length > 0;
  const hasDetail = hasValues || field.notes;

  return (
    <div
      className="group"
      style={{ borderBottom: "1px solid #f1f5f9" }}
    >
      <div
        className={`flex items-center gap-3 px-4 py-2.5 ${hasDetail ? "cursor-pointer hover:bg-[#fafbff]" : ""}`}
        onClick={() => hasDetail && setOpen((v) => !v)}
      >
        {/* Type pill */}
        <span
          className="shrink-0 text-[10px] font-semibold px-1.5 py-px rounded"
          style={{ background: tc.color + "14", color: tc.color, minWidth: 46, textAlign: "center" as const }}
        >
          {tc.label}
        </span>

        {/* Name */}
        <span className="flex-1 text-sm text-[var(--kinship-ink)] font-medium leading-none">
          {field.name}
        </span>

        {/* Relation target */}
        {field.type === "relation" && field.relatesTo && (
          <span className="text-xs text-[#94a3b8] font-normal">
            → {field.relatesTo}
          </span>
        )}

        {/* Flags */}
        {field.flags?.map((f) => <FlagBadge key={f} flag={f} />)}

        {/* Expand chevron */}
        {hasDetail && (
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className="shrink-0 transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "#cbd5e1" }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Expanded detail */}
      {open && hasDetail && (
        <div className="px-4 pb-3 pt-1" style={{ background: "#fafbff" }}>
          {field.notes && (
            <p className="text-[11px] text-[#64748b] mb-2">{field.notes}</p>
          )}
          {hasValues && (
            <div className="flex flex-wrap gap-1">
              {field.values!.map((v) => (
                <span key={v} className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Nav pill ─────────────────────────────────────────────────────────────────
function NavPill({ entity, active, onClick }: { entity: Entity; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
      style={{
        background: active ? entity.color : "transparent",
        color: active ? "white" : "#64748b",
        border: `1.5px solid ${active ? entity.color : "#e2e8f0"}`,
      }}
    >
      {entity.emoji} {entity.name}
    </button>
  );
}

// ─── Sample data panel ────────────────────────────────────────────────────────
function SampleDataPanel() {
  const [activeDs, setActiveDs] = useState(0);
  const [activeSection, setActiveSection] = useState<"school" | "contacts" | "deals" | "engagements" | "accounts">("school");
  const ds = sampleDatasets[activeDs];

  const sections = [
    { id: "school" as const, label: "School" },
    { id: "contacts" as const, label: `Contacts (${ds.contacts.length})` },
    { id: "deals" as const, label: `Deals (${ds.deals.length})` },
    { id: "engagements" as const, label: `Engagements (${ds.engagements.length})` },
    ...(ds.accounts.length > 0 ? [{ id: "accounts" as const, label: "Accounts" }] : []),
  ];

  return (
    <div>
      {/* Dataset switcher */}
      <div className="flex gap-2 mb-4">
        {sampleDatasets.map((d, i) => (
          <button
            key={d.id}
            onClick={() => { setActiveDs(i); setActiveSection("school"); }}
            className="flex-1 text-left rounded-xl border p-3 transition-all"
            style={{
              borderColor: activeDs === i ? "#334155" : "#e2e8f0",
              background: activeDs === i ? "#0f172a" : "white",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{d.emoji}</span>
              <div>
                <div className="text-xs font-semibold" style={{ color: activeDs === i ? "white" : "#0f172a" }}>
                  {d.label}
                </div>
                <div className="text-[10px]" style={{ color: activeDs === i ? "#94a3b8" : "#94a3b8" }}>
                  {d.type}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
            style={{
              borderColor: activeSection === s.id ? "#0f172a" : "#e2e8f0",
              background: activeSection === s.id ? "#0f172a" : "white",
              color: activeSection === s.id ? "white" : "#64748b",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white overflow-hidden">
        {activeSection === "school" && (
          <>
            <SectionHeader title={ds.school.schoolName} copyFn={() => sampleDatasetToMarkdown(ds)} copyLabel="Copy full dataset" />
            {"memberSchools" in ds && ds.memberSchools && (
              <div className="px-4 py-2 bg-[#f8fafc] border-b border-[#e2e8f0]">
                <p className="text-[11px] text-[#64748b]">
                  District account with {ds.memberSchools.length} member schools: {ds.memberSchools.map((s) => s.schoolName).join(", ")}
                </p>
              </div>
            )}
            <RecordTable data={ds.school as unknown as Record<string, string | number>} />
          </>
        )}

        {activeSection === "contacts" && (
          <>
            <SectionHeader title={`Contacts — ${ds.label}`} copyFn={() => ds.contacts.map((c) => JSON.stringify(c, null, 2)).join("\n\n")} />
            {ds.contacts.map((c, i) => (
              <div key={c.contactId}>
                {i > 0 && <div className="border-t border-[#f1f5f9]" />}
                <div className="px-4 py-2 bg-[#f8fafc] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#334155]">{c.name}</span>
                  <span className="text-[10px] text-[#94a3b8]">{c.title}</span>
                </div>
                <RecordTable data={c as unknown as Record<string, string | number>} skip={["contactId", "schoolId", "name", "title"]} />
              </div>
            ))}
          </>
        )}

        {activeSection === "deals" && (
          <>
            <SectionHeader title={`Deals — ${ds.label}`} copyFn={() => ds.deals.map((d) => JSON.stringify(d, null, 2)).join("\n\n")} />
            {ds.deals.map((d, i) => (
              <div key={d.dealId}>
                {i > 0 && <div className="border-t border-[#f1f5f9]" />}
                <RecordTable data={d as unknown as Record<string, string | number>} />
              </div>
            ))}
          </>
        )}

        {activeSection === "engagements" && (
          <>
            <SectionHeader title={`Engagements — ${ds.label}`} copyFn={() => ds.engagements.map((e) => JSON.stringify(e, null, 2)).join("\n\n")} />
            {ds.engagements.map((e, i) => (
              <div key={e.engagementId}>
                {i > 0 && <div className="border-t border-[#f1f5f9]" />}
                <div className="px-4 py-2 bg-[#f8fafc]">
                  <span className="text-xs font-semibold text-[#334155]">{e.title}</span>
                </div>
                <RecordTable data={e as unknown as Record<string, string | number>} skip={["engagementId", "title"]} />
              </div>
            ))}
          </>
        )}

        {activeSection === "accounts" && ds.accounts.length > 0 && (
          <>
            <SectionHeader title={`Accounts — ${ds.label}`} copyFn={() => JSON.stringify(ds.accounts, null, 2)} />
            {(ds.accounts as Record<string, unknown>[]).map((a, i) => (
              <div key={i}>
                {i > 0 && <div className="border-t border-[#f1f5f9]" />}
                <RecordTable data={a as Record<string, string | number>} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, copyFn, copyLabel = "Copy" }: { title: string; copyFn: () => string; copyLabel?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
      <span className="text-xs font-semibold text-[#334155]">{title}</span>
      <CopyBtn getText={copyFn} label={copyLabel} />
    </div>
  );
}

function RecordTable({ data, skip = [] }: { data: Record<string, string | number | number[]>; skip?: string[] }) {
  const entries = Object.entries(data).filter(([k]) => !skip.includes(k));
  return (
    <div>
      {entries.map(([key, val]) => (
        <div key={key} className="flex items-start gap-4 px-4 py-2 border-b border-[#f8fafc] last:border-0">
          <span className="text-[11px] text-[#94a3b8] w-36 shrink-0 font-mono pt-px">{key}</span>
          <span className="text-[11px] text-[#334155] flex-1 leading-relaxed">
            {Array.isArray(val) ? val.join(", ") : String(val)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
type TabId = "schema" | "sample-data" | "relations" | "quality";

export default function KinshipCrmSchemaPage() {
  const [activeEntityId, setActiveEntityId] = useState<string>(entities[0].id);
  const [search, setSearch] = useState("");
  const [fieldTab, setFieldTab] = useState<"fields" | "quality">("fields");
  const [mainTab, setMainTab] = useState<TabId>("schema");

  const activeEntity = entities.find((e) => e.id === activeEntityId) ?? entities[0];

  const filteredFields = activeEntity.fields.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.type.toLowerCase().includes(q) ||
      f.notes?.toLowerCase().includes(q) ||
      f.values?.some((v) => v.toLowerCase().includes(q))
    );
  });

  const handleEntitySelect = (id: string) => {
    setActiveEntityId(id);
    setSearch("");
    setFieldTab("fields");
    // No auto-scroll — user stays in place
  };

  const entityCsv = "Property,Type,Values,Notes,Flags\n" +
    activeEntity.fields.map((f) =>
      `"${f.name}","${f.type}${f.relatesTo ? ` → ${f.relatesTo}` : ""}","${f.values?.join("; ") ?? ""}","${f.notes ?? ""}","${f.flags?.join(", ") ?? ""}"`
    ).join("\n");

  // Field type summary for current entity
  const typeCounts = activeEntity.fields.reduce<Record<string, number>>((acc, f) => {
    acc[f.type] = (acc[f.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>

      {/* ── Header ── */}
      <header className="border-b border-[#e2e8f0] bg-white px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] flex items-center justify-center">
              <span className="text-sm">🧠</span>
            </div>
            <div>
              <span className="font-semibold text-[#0f172a] text-sm">Kinship Brain</span>
              <span className="text-[#94a3b8] text-xs ml-2 hidden sm:inline">CRM Schema Reference</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#94a3b8] hidden sm:inline">Aug 25, 2026</span>
            <CopyBtn getText={allEntitiesToMarkdown} label="Export all" />
          </div>
        </div>
      </header>

      {/* ── Main tabs ── */}
      <div className="border-b border-[#e2e8f0] bg-white px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex gap-0">
          {([ 
            { id: "schema" as TabId, label: "Schema" },
            { id: "sample-data" as TabId, label: "Sample Data" },
            { id: "relations" as TabId, label: "Relations" },
            { id: "quality" as TabId, label: "Quality Flags" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id)}
              className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: mainTab === t.id ? "#0f172a" : "transparent",
                color: mainTab === t.id ? "#0f172a" : "#94a3b8",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-6">

        {/* ─── SCHEMA TAB ─────────────────────────────────────────────── */}
        {mainTab === "schema" && (
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

            {/* Entity nav */}
            <nav>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-3 px-1">Entities</p>
              <div className="space-y-px">
                {entities.map((e) => {
                  const isActive = e.id === activeEntityId;
                  const flagCount = e.fields.filter((f) => f.flags && f.flags.length > 0).length;
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleEntitySelect(e.id)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={{
                        background: isActive ? "white" : "transparent",
                        boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      <span className="text-base w-5 text-center">{e.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-sm font-medium block truncate"
                          style={{ color: isActive ? e.color : "#334155" }}
                        >
                          {e.name}
                        </span>
                        <span className="text-[10px] text-[#94a3b8]">
                          {e.fields.length} fields
                          {flagCount > 0 && ` · ${flagCount} flags`}
                        </span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick stats */}
              <div className="mt-6 px-1 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Schema</p>
                {[
                  { label: "Total entities", value: entities.length },
                  { label: "Total fields", value: entities.reduce((s, e) => s + e.fields.length, 0) },
                  { label: "Quality flags", value: dataQualityFlags.length },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-[#64748b]">{s.label}</span>
                    <span className="text-xs font-semibold text-[#334155]">{s.value}</span>
                  </div>
                ))}
              </div>
            </nav>

            {/* Entity detail */}
            <main>
              {/* Entity header */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 mb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeEntity.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold" style={{ color: activeEntity.color }}>
                          {activeEntity.name}
                        </h1>
                        <span className="text-xs text-[#94a3b8]">{activeEntity.crmAnalog}</span>
                      </div>
                      <p className="text-sm text-[#64748b] mt-0.5 max-w-lg">{activeEntity.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CopyBtn getText={() => entityCsv} label="CSV" />
                    <CopyBtn getText={() => entityToMarkdown(activeEntity)} label="Markdown" />
                  </div>
                </div>

                {/* Type breakdown */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-[#f1f5f9]">
                  {Object.entries(typeCounts).map(([type, count]) => {
                    const tc = TYPE_CONFIG[type as FieldType];
                    return (
                      <span
                        key={type}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: tc.color + "12", color: tc.color }}
                      >
                        {tc.label} {count}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-3 px-1">
                <button
                  onClick={() => setFieldTab("fields")}
                  className="text-sm font-medium pb-1 border-b-2 transition-colors"
                  style={{ borderColor: fieldTab === "fields" ? activeEntity.color : "transparent", color: fieldTab === "fields" ? activeEntity.color : "#94a3b8" }}
                >
                  Fields ({activeEntity.fields.length})
                </button>
                <button
                  onClick={() => setFieldTab("quality")}
                  className="text-sm font-medium pb-1 border-b-2 transition-colors"
                  style={{ borderColor: fieldTab === "quality" ? activeEntity.color : "transparent", color: fieldTab === "quality" ? activeEntity.color : "#94a3b8" }}
                >
                  {activeEntity.dataQualityNotes?.length
                    ? `Notes (${activeEntity.dataQualityNotes.length})`
                    : "Notes"}
                </button>
              </div>

              {fieldTab === "fields" && (
                <>
                  {/* Search */}
                  <div className="relative mb-3">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="#94a3b8" strokeWidth="1.3" />
                      <path d="M9.5 9.5L12 12" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Filter fields…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border border-[#e2e8f0] bg-white focus:outline-none focus:border-[#94a3b8] transition-colors"
                    />
                  </div>

                  {/* Fields */}
                  <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                    {filteredFields.length === 0 ? (
                      <p className="text-center py-8 text-sm text-[#94a3b8]">No fields match "{search}"</p>
                    ) : (
                      filteredFields.map((f) => <FieldRow key={f.name} field={f} />)
                    )}
                  </div>
                </>
              )}

              {fieldTab === "quality" && (
                <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                  {activeEntity.dataQualityNotes?.length ? (
                    activeEntity.dataQualityNotes.map((note, i) => (
                      <div key={i} className="flex gap-3 px-4 py-3 border-b border-[#f1f5f9] last:border-0">
                        <span className="text-[#d97706] shrink-0 text-sm mt-px">⚠</span>
                        <p className="text-sm text-[#334155] leading-relaxed">{note}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-[#94a3b8]">
                      No data quality notes for {activeEntity.name}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        )}

        {/* ─── SAMPLE DATA TAB ────────────────────────────────────────── */}
        {mainTab === "sample-data" && <SampleDataPanel />}

        {/* ─── RELATIONS TAB ──────────────────────────────────────────── */}
        {mainTab === "relations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Schools keystone */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-3">Schools — Keystone</p>
              <div className="flex items-start gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏫</span>
                  <span className="font-semibold text-[#0f172a]">Schools</span>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {relationships.filter((r) => r.from === "schools").map((rel) => {
                    const target = entities.find((e) => e.id === rel.to);
                    if (!target) return null;
                    return (
                      <div key={rel.to} className="flex items-center gap-2">
                        <span className="text-[#94a3b8] text-xs">1 →</span>
                        <button
                          onClick={() => { setActiveEntityId(target.id); setMainTab("schema"); }}
                          className="text-xs font-medium hover:underline"
                          style={{ color: target.color }}
                        >
                          {target.emoji} {target.name}
                        </button>
                        <span className="text-[10px] text-[#94a3b8] hidden sm:inline">{rel.label.replace("1 → many", "").replace("(only when live conversation exists)", "").replace("(post-close)", "").trim()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cross relations */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-4">Cross-entity relations</p>
              <div className="space-y-2">
                {relationships.filter((r) => r.from !== "schools").map((rel, i) => {
                  const from = entities.find((e) => e.id === rel.from);
                  const to = entities.find((e) => e.id === rel.to);
                  if (!from || !to) return null;
                  return (
                    <div key={i} className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => { setActiveEntityId(from.id); setMainTab("schema"); }}
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ background: from.color + "12", color: from.color }}
                      >
                        {from.emoji} {from.name}
                      </button>
                      <span className="text-[#cbd5e1] text-xs">→</span>
                      <button
                        onClick={() => { setActiveEntityId(to.id); setMainTab("schema"); }}
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ background: to.color + "12", color: to.color }}
                      >
                        {to.emoji} {to.name}
                      </button>
                      <span className="text-[11px] text-[#94a3b8]">{rel.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Migration order */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e2e8f0] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">Migration order</p>
                <CopyBtn
                  getText={() => migrationOrder.map((m) => `${m.step}. ${m.entity} — ${m.reason}`).join("\n")}
                  label="Copy"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {migrationOrder.map((m) => {
                  const ent = entities.find((e) => e.name === m.entity);
                  return (
                    <div key={m.step} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#0f172a] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {m.step}
                      </span>
                      {ent ? (
                        <button
                          onClick={() => { setActiveEntityId(ent.id); setMainTab("schema"); }}
                          className="text-sm font-medium hover:underline"
                          style={{ color: ent.color }}
                        >
                          {ent.emoji} {m.entity}
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-[#334155]">{m.entity}</span>
                      )}
                      <span className="text-xs text-[#94a3b8]">{m.reason}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── QUALITY FLAGS TAB ──────────────────────────────────────── */}
        {mainTab === "quality" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#64748b]">9 flags to resolve before Reevo migration</p>
              <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Critical</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Warning</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Info</span>
              </div>
            </div>
            {dataQualityFlags.map((flag) => {
              const sev = {
                critical: { dot: "#ef4444", bg: "white", border: "#fee2e2", labelBg: "#fee2e2", labelText: "#991b1b" },
                warning:  { dot: "#f59e0b", bg: "white", border: "#fef3c7", labelBg: "#fef3c7", labelText: "#92400e" },
                info:     { dot: "#3b82f6", bg: "white", border: "#dbeafe", labelBg: "#dbeafe", labelText: "#1e40af" },
              }[flag.severity as "critical" | "warning" | "info"];
              return (
                <div key={flag.id} className="bg-white rounded-xl border p-4 flex gap-4" style={{ borderColor: sev.border }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: sev.dot }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-[#0f172a]">{flag.title}</span>
                      <span className="text-[10px] font-medium px-1.5 py-px rounded" style={{ background: sev.labelBg, color: sev.labelText }}>
                        {flag.entity}
                      </span>
                      {flag.field && (
                        <code className="text-[10px] font-mono text-[#64748b] px-1.5 py-px rounded bg-[#f8fafc] border border-[#e2e8f0]">
                          {flag.field}
                        </code>
                      )}
                    </div>
                    <p className="text-sm text-[#64748b] leading-relaxed">{flag.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
