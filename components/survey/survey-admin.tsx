"use client";
// Admin view — guarded by Google auth (@buildkinship.com) via (internal) route group layout
// PIN gate removed — replaced by GoogleAuthGate at the route level
// Fetches responses from /api/survey/[slug]/responses using the signed-in user's ID token

import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SurveyConfig } from "@/mock/surveys";
import type { SurveyResponse } from "@/lib/survey-store";
import { useAuth } from "@/components/auth/AuthProvider";

const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];

/* ─── Empty State ───────────────────────────────────────────── */

function EmptyState({ surveyTitle }: { surveyTitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "color-mix(in oklch, var(--kinship-dim) 15%, transparent)" }}
      >
        <ClipboardList className="w-8 h-8 text-[var(--kinship-dim)]" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-[var(--kinship-ink)] mb-1">
          No responses yet
        </h3>
        <p className="text-sm text-[var(--kinship-mid)] max-w-xs">
          Share the survey link for{" "}
          <span className="font-medium">{surveyTitle}</span> to start collecting
          responses.
        </p>
      </div>
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────── */

function formatAnswer(value: string | string[] | number | undefined): string {
  if (value === undefined || value === null) return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number") return String(value);
  return String(value);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SortDir = "asc" | "desc" | null;

/* ─── Admin Table ───────────────────────────────────────────── */

function AdminTable({
  survey,
  responses,
  onRefresh,
}: {
  survey: SurveyConfig;
  responses: SurveyResponse[];
  onRefresh: () => void;
}) {
  const [filter, setFilter] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const columns = [
    { key: "submittedAt", label: "Submitted" },
    ...survey.questions.map((q) => ({ key: q.id, label: q.title })),
  ];

  const filtered = useMemo(() => {
    let rows = responses;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      rows = rows.filter((r) => {
        return (
          r.submittedAt.toLowerCase().includes(q) ||
          Object.values(r.answers).some((v) =>
            formatAnswer(v).toLowerCase().includes(q)
          )
        );
      });
    }
    if (sortCol && sortDir) {
      rows = [...rows].sort((a, b) => {
        const aVal =
          sortCol === "submittedAt"
            ? a.submittedAt
            : formatAnswer(a.answers[sortCol]);
        const bVal =
          sortCol === "submittedAt"
            ? b.submittedAt
            : formatAnswer(b.answers[sortCol]);
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [responses, filter, sortCol, sortDir]);

  const cycleSort = (col: string) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortCol(null);
      setSortDir(null);
    }
  };

  const exportCSV = () => {
    const headers = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`);
    const rows = filtered.map((r) =>
      columns
        .map((c) => {
          const val =
            c.key === "submittedAt"
              ? formatDate(r.submittedAt)
              : formatAnswer(r.answers[c.key]);
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${survey.slug}-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col)
      return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />;
    if (sortDir === "asc") return <ChevronUp className="w-3.5 h-3.5" />;
    return <ChevronDown className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--kinship-dim)]" />
          <input
            type="text"
            placeholder="Search responses…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white text-sm text-[var(--kinship-ink)] outline-none focus:border-[var(--kinship-mid)] transition-colors"
          />
        </div>
        <span className="text-sm text-[var(--kinship-dim)] whitespace-nowrap">
          {filtered.length} of {responses.length} response{responses.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={onRefresh}
          className="text-sm text-[var(--kinship-mid)] hover:text-[var(--kinship-ink)] transition-colors px-3 py-2 rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white"
        >
          Refresh
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg text-[var(--kinship-cream)] transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
          style={{ background: "var(--kinship-ink)" }}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      {responses.length === 0 ? (
        <EmptyState surveyTitle={survey.title} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[color-mix(in_oklch,var(--kinship-ink)_4%,var(--kinship-cream))]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => cycleSort(col.key)}
                    className="text-left px-4 py-3 font-medium text-[var(--kinship-ink)] whitespace-nowrap cursor-pointer select-none hover:bg-[color-mix(in_oklch,var(--kinship-mid)_5%,transparent)] transition-colors border-b border-[color-mix(in_oklch,var(--kinship-dim)_20%,transparent)]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="max-w-[140px] truncate" title={col.label}>
                        {col.label}
                      </span>
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-[var(--kinship-dim)] text-sm"
                  >
                    No results match your search
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-[color-mix(in_oklch,var(--kinship-dim)_15%,transparent)] last:border-0 transition-colors",
                      idx % 2 === 0
                        ? "bg-white"
                        : "bg-[color-mix(in_oklch,var(--kinship-cream)_50%,white)]",
                      "hover:bg-[color-mix(in_oklch,var(--kinship-mid)_3%,white)]"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-[var(--kinship-mid)] align-top"
                      >
                        <span
                          className="max-w-[200px] truncate block"
                          title={
                            col.key === "submittedAt"
                              ? formatDate(row.submittedAt)
                              : formatAnswer(row.answers[col.key])
                          }
                        >
                          {col.key === "submittedAt"
                            ? formatDate(row.submittedAt)
                            : formatAnswer(row.answers[col.key])}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Main Admin View ───────────────────────────────────────── */

export function SurveyAdminView({ survey }: { survey: SurveyConfig }) {
  const { user, loading: authLoading } = useAuth();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = useCallback(async () => {
    // Wait until Firebase auth has resolved and we have a Google user
    if (authLoading || !user) return;

    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken(/* forceRefresh */ true);
      const res = await fetch(`/api/survey/${survey.slug}/responses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setResponses(data.responses);
      } else {
        setError(data.error ?? "Failed to load responses.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, [survey.slug, user, authLoading]);

  // Fetch once auth is ready
  useEffect(() => {
    if (!authLoading && user) {
      fetchResponses();
    }
  }, [fetchResponses, authLoading, user]);

  return (
    <div className="min-h-screen bg-[var(--kinship-cream)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Error state */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="mb-10"
        >
          <p className="section-label mb-3 text-[var(--kinship-dim)]">
            survey admin
          </p>
          <h1
            className="text-serif text-[var(--kinship-ink)] mb-3 leading-tight"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            {survey.title}
          </h1>
          <p className="text-[var(--kinship-mid)] text-sm">
            {responses.length} response{responses.length !== 1 ? "s" : ""}{" "}
            collected
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
        >
          {loading || authLoading ? (
            <div className="flex justify-center py-24">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: "var(--kinship-mid)",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : (
            <AdminTable
              survey={survey}
              responses={responses}
              onRefresh={fetchResponses}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
