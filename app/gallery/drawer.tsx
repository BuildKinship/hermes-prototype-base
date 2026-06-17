"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Tag,
  Lock,
  MessageSquare,
  Lightbulb,
  Code2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { PrototypeManifest, SlackMessage } from "@/types/manifest";

// ─── Type Badge ────────────────────────────────────────────────────────────────
const TYPE_META: Record<string, { label: string; color: string }> = {
  slide: { label: "Slide Deck", color: "#6B7280" },
  animation: { label: "Animation", color: "#8B5CF6" },
  "3d": { label: "3D / Interactive", color: "#059669" },
  dashboard: { label: "Dashboard", color: "#1A1A2E" },
  survey: { label: "Survey", color: "#0F766E" },
  other: { label: "Other", color: "#6B7280" },
};

// ─── Copy Button ───────────────────────────────────────────────────────────────
function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${className}`}
      style={{
        background: "color-mix(in oklch, white 10%, transparent)",
        color: copied ? "#6EE7B7" : "#9CA3AF",
      }}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Collapsible Section ───────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-3 text-left group"
        style={{ color: "#9CA3AF" }}
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 opacity-60" /> : <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Slack Message Bubble ──────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: SlackMessage }) {
  const isHermes = msg.role === "hermes";
  return (
    <div className={`flex gap-3 ${isHermes ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{
          background: isHermes
            ? "color-mix(in oklch, #6366F1 60%, #1A1A2E)"
            : "color-mix(in oklch, var(--kinship-ink) 80%, white)",
          color: "white",
        }}
      >
        {msg.name[0]}
      </div>
      <div className={`flex flex-col gap-1 max-w-[85%] ${isHermes ? "items-end" : ""}`}>
        <span className="text-[10px]" style={{ color: "#6B7280" }}>
          {msg.name}
          {msg.timestamp && (
            <span className="ml-2">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </span>
        <div
          className="text-xs leading-relaxed rounded-xl px-3 py-2 whitespace-pre-wrap"
          style={{
            background: isHermes
              ? "color-mix(in oklch, #6366F1 20%, rgba(255,255,255,0.05))"
              : "rgba(255,255,255,0.07)",
            color: "#E5E7EB",
            borderRadius: isHermes ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          }}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}

// ─── Main Drawer ───────────────────────────────────────────────────────────────
export function PrototypeDrawer({
  manifest,
  onClose,
}: {
  manifest: PrototypeManifest | null;
  onClose: () => void;
}) {
  const m = manifest;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll when prototype changes
  useEffect(() => {
    if (m && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [m?.slug]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const typeMeta = m ? (TYPE_META[m.type] ?? TYPE_META.other) : null;

  return (
    <AnimatePresence>
      {m && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: "min(480px, 92vw)",
              background: "#111118",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex-shrink-0 flex items-start justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex flex-col gap-2 pr-4">
                {/* Type badge */}
                <span
                  className="inline-flex items-center self-start text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    background: `${typeMeta?.color}25`,
                    color: typeMeta?.color,
                    border: `1px solid ${typeMeta?.color}40`,
                  }}
                >
                  {typeMeta?.label}
                </span>
                <h2 className="text-lg font-semibold leading-snug" style={{ color: "#F9FAFB" }}>
                  {m.name}
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                  {m.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors mt-0.5"
                style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">

              {/* Open prototype CTA */}
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: "var(--kinship-ink)", color: "var(--kinship-cream)" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Prototype
                </a>
                {m.admin_url && (
                  <a
                    href={m.admin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 mt-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Admin View
                    {m.admin_code && (
                      <span
                        className="ml-1 px-1.5 py-0.5 rounded font-mono text-[10px]"
                        style={{ background: "rgba(255,255,255,0.1)", color: "#E5E7EB" }}
                      >
                        code: {m.admin_code}
                      </span>
                    )}
                  </a>
                )}
              </div>

              {/* Creator + meta row */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "color-mix(in oklch, var(--kinship-ink) 80%, white)", color: "var(--kinship-cream)" }}
                  >
                    {m.created_by_name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: "#E5E7EB" }}>
                      {m.created_by_name}
                    </div>
                    <div className="text-[10px]" style={{ color: "#6B7280" }}>
                      {new Date(m.created_at).toLocaleDateString("en-CA", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {m.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.07)", color: "#9CA3AF" }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full prompt section */}
              <Section icon={<Sparkles className="w-3.5 h-3.5" />} title="Prompt" defaultOpen>
                <div
                  className="relative rounded-lg p-4 text-xs leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#D1D5DB",
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.full_prompt ?? m.prompt}
                  <div className="absolute top-2 right-2">
                    <CopyButton text={m.full_prompt ?? m.prompt} />
                  </div>
                </div>
              </Section>

              {/* Slack thread */}
              {m.slack_thread && m.slack_thread.length > 0 && (
                <Section icon={<MessageSquare className="w-3.5 h-3.5" />} title="Slack Thread" defaultOpen>
                  <div className="flex flex-col gap-4">
                    {m.slack_thread.map((msg, i) => (
                      <MessageBubble key={i} msg={msg} />
                    ))}
                  </div>
                </Section>
              )}

              {/* Design decisions */}
              {m.design_decisions && m.design_decisions.length > 0 && (
                <Section icon={<Lightbulb className="w-3.5 h-3.5" />} title="Design Decisions" defaultOpen={false}>
                  <ul className="flex flex-col gap-2">
                    {m.design_decisions.map((d, i) => (
                      <li key={i} className="flex gap-2.5 text-xs leading-relaxed" style={{ color: "#D1D5DB" }}>
                        <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                          style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}>
                          {i + 1}
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Tech notes */}
              {m.tech_notes && m.tech_notes.length > 0 && (
                <Section icon={<Code2 className="w-3.5 h-3.5" />} title="Technical Notes" defaultOpen={false}>
                  <ul className="flex flex-col gap-2">
                    {m.tech_notes.map((n, i) => (
                      <li key={i} className="flex gap-2.5 text-xs leading-relaxed" style={{ color: "#D1D5DB" }}>
                        <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: "#6B7280" }} />
                        {n}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* What made it special */}
              {m.what_made_it_special && (
                <Section icon={<Sparkles className="w-3.5 h-3.5" />} title="What Made This Special" defaultOpen={false}>
                  <p className="text-xs leading-relaxed" style={{ color: "#D1D5DB" }}>
                    {m.what_made_it_special}
                  </p>
                </Section>
              )}

              {/* Git / metadata */}
              <Section icon={<GitBranch className="w-3.5 h-3.5" />} title="Build Details" defaultOpen={false}>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Branch", value: m.branch },
                    { label: "Channel", value: m.slack_channel ?? "—" },
                    ...(m.session_id ? [{ label: "Session", value: m.session_id }] : []),
                    { label: "URL", value: m.url },
                    ...(m.short_url ? [{ label: "Short link", value: m.short_url }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-3 text-xs">
                      <span className="flex-shrink-0 font-medium" style={{ color: "#6B7280" }}>{label}</span>
                      <span
                        className="text-right font-mono truncate max-w-[240px]"
                        style={{ color: "#9CA3AF" }}
                        title={value}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* All tags */}
              {m.tags.length > 0 && (
                <Section icon={<Tag className="w-3.5 h-3.5" />} title="Tags" defaultOpen={false}>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.07)", color: "#9CA3AF" }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Bottom padding */}
              <div className="h-8" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
