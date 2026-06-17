"use client";
// Admin view — requires 4-digit code gate, shows sortable/filterable response table

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Lock,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SurveyConfig } from "@/mock/surveys";
import type { SurveyResponse } from "@/lib/survey-store";

const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];

/* ─── Code Gate ─────────────────────────────────────────────── */

function CodeGate({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    if (code.length !== 4) {
      setShake(true);
      setError(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onSubmit(code);
  };

  return (
    <div className="min-h-screen bg-[var(--kinship-cream)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="flex flex-col items-center gap-6 max-w-sm w-full"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "var(--kinship-ink)" }}
        >
          <Lock className="w-6 h-6 text-[var(--kinship-cream)]" />
        </div>
        <div className="text-center">
          <h1 className="text-serif text-2xl text-[var(--kinship-ink)] mb-2">
            Admin Access
          </h1>
          <p className="text-sm text-[var(--kinship-mid)]">
            Enter the 4-digit code to view survey results
          </p>
        </div>

        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 4);
              setCode(val);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="0000"
            className={cn(
              "w-full text-center text-3xl font-bold tracking-[0.5em] rounded-xl border-2 px-6 py-5 outline-none transition-colors bg-white",
              error
                ? "border-red-400 text-red-500"
                : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)] focus:border-[var(--kinship-mid)] text-[var(--kinship-ink)]"
            )}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              Invalid code. Try again.
            </p>
          )}
        </motion.div>

        <button
          onClick={submit}
          className="w-full py-3 rounded-full text-[var(--kinship-cream)] font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--kinship-ink)" }}
        >
          Unlock
        </button>
      </motion.div>
    </div>
  );
}

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

  // Filtered + sorted data
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
        let aVal =
          sortCol === "submittedAt"
            ? a.submittedAt
            : formatAnswer(a.answers[sortCol]);
        let bVal =
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
                      <span
                        className="max-w-[140px] truncate"
                        title={col.label}
                      >
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
  const [unlocked, setUnlocked] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResponses = useCallback(
    async (code: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/survey/${survey.slug}/responses?code=${code}`
        );
        const data = await res.json();
        if (res.ok) {
          setResponses(data.responses);
          setUnlocked(true);
          setWrongCode(false);
          // Store code in sessionStorage so refresh still works
          sessionStorage.setItem(`survey-admin-code-${survey.slug}`, code);
        } else {
          setWrongCode(true);
        }
      } catch {
        setWrongCode(true);
      } finally {
        setLoading(false);
      }
    },
    [survey.slug]
  );

  // Check sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(`survey-admin-code-${survey.slug}`);
    if (saved) fetchResponses(saved);
  }, [survey.slug, fetchResponses]);

  const handleCodeSubmit = (code: string) => {
    fetchResponses(code);
  };

  const handleRefresh = () => {
    const saved = sessionStorage.getItem(`survey-admin-code-${survey.slug}`);
    if (saved) fetchResponses(saved);
  };

  if (!unlocked) {
    return (
      <div className="relative">
        <CodeGate onSubmit={handleCodeSubmit} />
        {wrongCode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm px-4 py-2 rounded-full"
          >
            Incorrect code — try again
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--kinship-cream)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
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
          {loading ? (
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
              onRefresh={handleRefresh}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
