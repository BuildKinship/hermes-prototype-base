"use client";
// Survey engine client component — manages state, animations, and question flow
// Uses react-hook-form + zod for validation to avoid stale-closure bugs

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import { ArrowRight, Check, ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SurveyConfig, Question, ChoiceOption } from "@/mock/surveys";
import { useAuth } from "@/components/auth/AuthProvider";

const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];

/* ─── Types ─────────────────────────────────────────────────── */

type AnswerValue = string | string[] | number | undefined;
type Answers = Record<string, AnswerValue>;

/* ─── Zod schema builder ─────────────────────────────────────── */

function buildAnswerSchema(question: Question): z.ZodTypeAny {
  switch (question.type) {
    case "single-choice": {
      const base = z.string();
      return question.required ? base.min(1, "Please select an option") : base.optional();
    }
    case "multiple-choice": {
      const base = z.array(z.string());
      return question.required
        ? base.min(1, "Please select at least one option")
        : base.optional();
    }
    case "rating": {
      // value is a number passed directly — just check it's a valid number
      const base = z.number({ error: "Please select a rating" });
      return question.required
        ? base.min(1, "Please select a rating")
        : base.optional();
    }
    case "email": {
      if (question.required) {
        return z.string().min(1, "This question is required").email("Please enter a valid email address");
      }
      return z.string().email("Please enter a valid email address").optional().or(z.literal(""));
    }
    case "number": {
      // value comes in as string from input, parse to number
      let schema = z.string().transform((s) => {
        if (s === "" || s === undefined) return undefined;
        const n = parseFloat(s);
        if (isNaN(n)) throw new z.ZodError([{ code: "custom", message: "Please enter a valid number", path: [] }]);
        return n;
      });
      // Can't refine mid-transform in v4 cleanly — handle min/max in validateAnswer post-parse
      if (question.required) {
        return schema.refine((v) => v !== undefined, "This question is required");
      }
      return schema.optional();
    }
    default: {
      // short-text, long-text
      let base = z.string();
      if (question.minLength) {
        base = base.min(
          question.minLength,
          `Please enter at least ${question.minLength} characters`
        );
      }
      if (question.maxLength) {
        base = base.max(
          question.maxLength,
          `Maximum ${question.maxLength} characters`
        );
      }
      return question.required ? base.min(1, "This question is required") : base.optional();
    }
  }
}

/* ─── Progress Bar ──────────────────────────────────────────── */

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[color-mix(in_oklch,var(--kinship-dim)_20%,transparent)]">
      <motion.div
        className="h-full bg-[var(--kinship-mid)]"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />
    </div>
  );
}

/* ─── Welcome Screen ────────────────────────────────────────── */

function WelcomeScreen({
  title,
  description,
  questionCount,
  adminUrl,
  onStart,
}: {
  title: string;
  description: string;
  questionCount: number;
  adminUrl: string;
  onStart: () => void;
}) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="flex flex-col items-start max-w-2xl"
    >
      <p className="section-label mb-6 text-[var(--kinship-dim)]">survey</p>
      <h1
        className="text-serif mb-6 leading-tight text-[var(--kinship-ink)]"
        style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
      >
        {title}
      </h1>
      <p className="text-[var(--kinship-mid)] text-lg leading-relaxed mb-4 max-w-lg">
        {description}
      </p>
      <p className="text-sm text-[var(--kinship-dim)] mb-10">
        {questionCount} questions · about 3 minutes
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
          className="flex items-center gap-3 px-8 py-4 rounded-full text-[var(--kinship-cream)] font-medium text-lg transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--kinship-ink)" }}
        >
          Start
          <ArrowRight className="w-5 h-5" />
        </button>
        <a
          href={adminUrl}
          className="flex items-center gap-1.5 px-4 py-4 text-sm text-[var(--kinship-dim)] hover:text-[var(--kinship-mid)] transition-colors"
        >
          <Settings className="w-4 h-4" />
          Admin
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Thank You Screen ──────────────────────────────────────── */

function ThankYouScreen({
  title,
  message,
  adminUrl,
}: {
  title: string;
  message: string;
  adminUrl: string;
}) {
  return (
    <motion.div
      key="thankyou"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="flex flex-col items-start max-w-2xl"
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8" style={{ background: "var(--kinship-mid)" }}>
        <Check className="w-7 h-7 text-[var(--kinship-cream)]" />
      </div>
      <h1
        className="text-serif mb-4 leading-tight text-[var(--kinship-ink)]"
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
      >
        {title}
      </h1>
      <p className="text-[var(--kinship-mid)] text-lg leading-relaxed max-w-lg">
        {message}
      </p>
      <a
        href={adminUrl}
        className="mt-8 flex items-center gap-1.5 text-sm text-[var(--kinship-dim)] hover:text-[var(--kinship-mid)] transition-colors"
        title="Admin view"
      >
        <Settings className="w-3.5 h-3.5" />
        Admin
      </a>
    </motion.div>
  );
}

/* ─── Question: Short/Long Text ─────────────────────────────── */

function TextQuestion({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onAdvance: () => void;
  error?: string;
}) {
  const isLong = question.type === "long-text";

  return (
    <div className="flex flex-col gap-4">
      {isLong ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={5}
          maxLength={question.maxLength}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              onAdvance();
            }
          }}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 resize-none text-base bg-white text-[var(--kinship-ink)] placeholder-[var(--kinship-dim)] outline-none transition-colors focus:border-[var(--kinship-mid)]",
            error
              ? "border-red-400"
              : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)]"
          )}
        />
      ) : (
        <input
          autoFocus
          type={question.type === "email" ? "email" : question.type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
          min={question.min}
          max={question.max}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdvance();
            }
          }}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 text-base bg-white text-[var(--kinship-ink)] placeholder-[var(--kinship-dim)] outline-none transition-colors focus:border-[var(--kinship-mid)]",
            error
              ? "border-red-400"
              : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)]"
          )}
        />
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
      <div className="flex items-center gap-4">
        <button
          onClick={onAdvance}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[var(--kinship-cream)] font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--kinship-ink)" }}
        >
          OK
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-[var(--kinship-dim)]">
          {isLong ? "or press Ctrl+Enter" : "or press Enter"}
        </span>
      </div>
    </div>
  );
}

/* ─── Question: Single Choice ───────────────────────────────── */

function SingleChoiceQuestion({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onAdvance: (val: string) => void;
  error?: string;
}) {
  const [showKeys, setShowKeys] = useState(false);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const options = question.options ?? [];

  // Show keyboard hints after 600ms
  useEffect(() => {
    setShowKeys(false);
    setJustSelected(null);
    const t = setTimeout(() => setShowKeys(true), 600);
    return () => clearTimeout(t);
  }, [question.id]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = e.key.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
      if (idx >= 0 && idx < options.length) {
        const opt = options[idx];
        setJustSelected(opt.id);
        onChange(opt.id);
        setTimeout(() => {
          setJustSelected(null);
          onAdvance(opt.id); // pass value directly — bypasses stale closure
        }, 250);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [options, onChange, onAdvance]);

  const select = (optId: string) => {
    setJustSelected(optId);
    onChange(optId);
    setTimeout(() => {
      setJustSelected(null);
      onAdvance(optId); // pass value directly — bypasses stale closure
    }, 250);
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C…
        const isSelected = value === opt.id;
        const isJust = justSelected === opt.id;

        return (
          <motion.button
            key={opt.id}
            onClick={() => select(opt.id)}
            whileHover={{ x: 2 }}
            animate={isJust ? { scale: [1, 0.98, 1.01, 1] } : { scale: 1 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "group flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all",
              isSelected
                ? "border-[var(--kinship-ink)] bg-[var(--kinship-ink)]"
                : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)] bg-white hover:border-[var(--kinship-mid)] hover:bg-[color-mix(in_oklch,var(--kinship-mid)_4%,white)]"
            )}
          >
            {/* Letter badge */}
            <div
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all",
                isSelected
                  ? "bg-[color-mix(in_oklch,white_20%,var(--kinship-ink))] text-[var(--kinship-cream)]"
                  : "bg-[color-mix(in_oklch,var(--kinship-dim)_15%,transparent)] text-[var(--kinship-dim)] group-hover:bg-[color-mix(in_oklch,var(--kinship-mid)_15%,transparent)] group-hover:text-[var(--kinship-mid)]"
              )}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: showKeys ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {letter}
              </motion.span>
            </div>
            <span
              className={cn(
                "text-base font-medium transition-colors",
                isSelected
                  ? "text-[var(--kinship-cream)]"
                  : "text-[var(--kinship-ink)]"
              )}
            >
              {opt.label}
            </span>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
              >
                <Check className="w-5 h-5 text-[var(--kinship-cream)]" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium mt-1"
        >
          {error}
        </motion.p>
      )}
      <p className="text-xs text-[var(--kinship-dim)] mt-1">
        Press A, B, C… to select · auto-advances on selection
      </p>
    </div>
  );
}

/* ─── Question: Multiple Choice ─────────────────────────────── */

function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: string[];
  onChange: (v: string[]) => void;
  onAdvance: () => void;
  error?: string;
}) {
  const [showKeys, setShowKeys] = useState(false);
  const options = question.options ?? [];

  useEffect(() => {
    setShowKeys(false);
    const t = setTimeout(() => setShowKeys(true), 600);
    return () => clearTimeout(t);
  }, [question.id]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onAdvance();
        return;
      }
      const idx = e.key.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
      if (idx >= 0 && idx < options.length) {
        const opt = options[idx];
        const next = value.includes(opt.id)
          ? value.filter((v) => v !== opt.id)
          : [...value, opt.id];
        onChange(next);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [options, value, onChange, onAdvance]);

  const toggle = (optId: string) => {
    const next = value.includes(optId)
      ? value.filter((v) => v !== optId)
      : [...value, optId];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const isSelected = value.includes(opt.id);

        return (
          <motion.button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            whileHover={{ x: 2 }}
            className={cn(
              "group flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all",
              isSelected
                ? "border-[var(--kinship-ink)] bg-[var(--kinship-ink)]"
                : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)] bg-white hover:border-[var(--kinship-mid)] hover:bg-[color-mix(in_oklch,var(--kinship-mid)_4%,white)]"
            )}
          >
            {/* Checkbox indicator */}
            <div
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all",
                isSelected
                  ? "bg-[color-mix(in_oklch,white_20%,var(--kinship-ink))] text-[var(--kinship-cream)]"
                  : "bg-[color-mix(in_oklch,var(--kinship-dim)_15%,transparent)] text-[var(--kinship-dim)] group-hover:bg-[color-mix(in_oklch,var(--kinship-mid)_15%,transparent)] group-hover:text-[var(--kinship-mid)]"
              )}
            >
              {isSelected ? (
                <Check className="w-4 h-4" />
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showKeys ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {letter}
                </motion.span>
              )}
            </div>
            <span
              className={cn(
                "text-base font-medium transition-colors",
                isSelected
                  ? "text-[var(--kinship-cream)]"
                  : "text-[var(--kinship-ink)]"
              )}
            >
              {opt.label}
            </span>
          </motion.button>
        );
      })}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium mt-1"
        >
          {error}
        </motion.p>
      )}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={onAdvance}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[var(--kinship-cream)] font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--kinship-ink)" }}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-[var(--kinship-dim)]">
          or press Enter · {value.length} selected
        </span>
      </div>
    </div>
  );
}

/* ─── Question: Rating ──────────────────────────────────────── */

function RatingQuestion({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: number | null;
  onChange: (v: number) => void;
  onAdvance: (val: number) => void;
  error?: string;
}) {
  const max = question.ratingMax ?? 5;
  const options = Array.from({ length: max }, (_, i) => i + 1);

  // Keyboard: 1-5 or 1-9,0
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const num = e.key === "0" ? 10 : parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= max) {
        onChange(num);
        setTimeout(() => onAdvance(num), 300); // pass value directly
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [max, onChange, onAdvance]);

  const select = (n: number) => {
    onChange(n);
    setTimeout(() => onAdvance(n), 300); // pass value directly
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 flex-wrap">
        {options.map((n) => (
          <motion.button
            key={n}
            onClick={() => select(n)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={
              value === n
                ? { scale: [1, 1.12, 1], transition: { duration: 0.2 } }
                : { scale: 1 }
            }
            className={cn(
              "w-14 h-14 rounded-xl border-2 font-bold text-lg transition-all",
              value === n
                ? "border-[var(--kinship-ink)] bg-[var(--kinship-ink)] text-[var(--kinship-cream)]"
                : value !== null && n <= value
                ? "border-[var(--kinship-mid)] bg-[color-mix(in_oklch,var(--kinship-mid)_10%,white)] text-[var(--kinship-mid)]"
                : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)] bg-white text-[var(--kinship-dim)] hover:border-[var(--kinship-mid)] hover:text-[var(--kinship-mid)]"
            )}
          >
            {n}
          </motion.button>
        ))}
      </div>
      {question.ratingLabels && (
        <div className="flex items-center justify-between max-w-sm">
          <span className="text-xs text-[var(--kinship-dim)]">
            {question.ratingLabels.low}
          </span>
          <span className="text-xs text-[var(--kinship-dim)]">
            {question.ratingLabels.high}
          </span>
        </div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
      <p className="text-xs text-[var(--kinship-dim)]">
        Press a number key (1–{max}) to select · auto-advances
      </p>
    </div>
  );
}

/* ─── Combined Email/Number question (uses TextQuestion) ───── */

function EmailQuestion({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onAdvance: () => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <input
        autoFocus
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder ?? "name@example.com"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdvance();
          }
        }}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-2 text-base bg-white text-[var(--kinship-ink)] placeholder-[var(--kinship-dim)] outline-none transition-colors focus:border-[var(--kinship-mid)]",
          error
            ? "border-red-400"
            : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)]"
        )}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
      <div className="flex items-center gap-4">
        <button
          onClick={onAdvance}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[var(--kinship-cream)] font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--kinship-ink)" }}
        >
          OK
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-[var(--kinship-dim)]">or press Enter</span>
      </div>
    </div>
  );
}

function NumberQuestion({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onAdvance: () => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <input
        autoFocus
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        min={question.min}
        max={question.max}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdvance();
          }
        }}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-2 text-base bg-white text-[var(--kinship-ink)] placeholder-[var(--kinship-dim)] outline-none transition-colors focus:border-[var(--kinship-mid)]",
          error
            ? "border-red-400"
            : "border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)]"
        )}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium"
        >
          {error}
        </motion.p>
      )}
      <div className="flex items-center gap-4">
        <button
          onClick={onAdvance}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[var(--kinship-cream)] font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--kinship-ink)" }}
        >
          OK
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-[var(--kinship-dim)]">or press Enter</span>
      </div>
    </div>
  );
}

/* ─── Question Field Router ──────────────────────────────────── */

function QuestionField({
  question,
  value,
  onChange,
  onAdvance,
  error,
}: {
  question: Question;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  onAdvance: (val?: AnswerValue) => void;
  error?: string;
}) {
  switch (question.type) {
    case "short-text":
    case "long-text":
      return (
        <TextQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          onAdvance={() => onAdvance()}
          error={error}
        />
      );
    case "email":
      return (
        <EmailQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          onAdvance={() => onAdvance()}
          error={error}
        />
      );
    case "number":
      return (
        <NumberQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          onAdvance={() => onAdvance()}
          error={error}
        />
      );
    case "single-choice":
      return (
        <SingleChoiceQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          onAdvance={(val) => onAdvance(val)}
          error={error}
        />
      );
    case "multiple-choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          value={(value as string[]) ?? []}
          onChange={(v) => onChange(v)}
          onAdvance={() => onAdvance()}
          error={error}
        />
      );
    case "rating":
      return (
        <RatingQuestion
          question={question}
          value={(value as number) ?? null}
          onChange={(v) => onChange(v)}
          onAdvance={(val) => onAdvance(val)}
          error={error}
        />
      );
    default:
      return null;
  }
}

/* ─── Main Survey Engine ────────────────────────────────────── */

type Stage = "welcome" | "questions" | "submitting" | "done" | "error";

export function SurveyEngine({ survey }: { survey: SurveyConfig }) {
  const { user } = useAuth(); // anon user from AnonAuthGate — uid used as sessionId
  const [stage, setStage] = useState<Stage>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1=forward, -1=back
  const [submitError, setSubmitError] = useState<string | undefined>();

  const questions = survey.questions;
  const currentQuestion = questions[questionIndex];
  const adminUrl = `/survey-admin/${survey.slug}`;

  const progress =
    stage === "welcome"
      ? 0
      : stage === "done"
      ? 100
      : ((questionIndex + 1) / questions.length) * 100;

  // react-hook-form manages all answer state — no stale closures possible
  // because setValue/getValues always operate on the live form store
  const {
    setValue,
    getValues,
    clearErrors,
  } = useForm<Record<string, AnswerValue>>({
    defaultValues: {},
    mode: "onChange",
  });

  // Local display state for current field (mirrors RHF under the hood)
  const [displayAnswers, setDisplayAnswers] = useState<Answers>({});
  const [fieldError, setFieldError] = useState<string | undefined>();

  const setAnswer = useCallback(
    (id: string, value: AnswerValue) => {
      setValue(id, value);
      setDisplayAnswers((prev) => ({ ...prev, [id]: value }));
      setFieldError(undefined);
      clearErrors(id);
    },
    [setValue, clearErrors]
  );

  // Validate a single question against a value (pure — no captured state)
  const validateAnswer = useCallback(
    (question: Question, value: AnswerValue): string | undefined => {
      try {
        buildAnswerSchema(question).parse(value);
        return undefined;
      } catch (err) {
        if (err instanceof z.ZodError) {
          return err.issues[0]?.message ?? "Invalid answer";
        }
        return "Invalid answer";
      }
    },
    []
  );

  // advance(overrideValue?) — overrideValue is passed by auto-advance components
  // (single-choice, rating) so we validate against the just-selected value
  // rather than whatever's in state (which may not have updated yet)
  const advance = useCallback(
    (overrideValue?: AnswerValue) => {
      if (!currentQuestion) return;

      const value =
        overrideValue !== undefined
          ? overrideValue
          : getValues(currentQuestion.id);

      const err = validateAnswer(currentQuestion, value);
      if (err) {
        setFieldError(err);
        return;
      }

      setFieldError(undefined);
      setDirection(1);

      if (questionIndex < questions.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        // Submit
        setStage("submitting");
        const allValues = getValues();
        const payload: Answers = {};

        questions.forEach((q) => {
          const v = allValues[q.id];
          if (v !== undefined) {
            payload[q.id] = q.type === "number" ? Number(v) : v;
          }
        });

        fetch(`/api/survey/${survey.slug}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: payload,
            sessionId: user?.uid ?? null, // anon Firebase uid for response linkage
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setStage("done");
            } else {
              setSubmitError(data.error ?? "Submission failed");
              setStage("error");
            }
          })
          .catch(() => {
            setSubmitError("Network error — please try again");
            setStage("error");
          });
      }
    },
    [currentQuestion, getValues, validateAnswer, questionIndex, questions, survey.slug, user]
  );

  const goBack = useCallback(() => {
    if (questionIndex === 0) {
      setStage("welcome");
    } else {
      setDirection(-1);
      setQuestionIndex((i) => i - 1);
      setFieldError(undefined);
    }
  }, [questionIndex]);

  return (
    <div className="min-h-screen bg-[var(--kinship-cream)] flex flex-col">
      <ProgressBar progress={progress} />

      {/* Top nav */}
      {stage === "questions" && (
        <div className="flex items-center justify-between px-8 pt-8 pb-0">
          <button
            onClick={goBack}
            className="text-sm text-[var(--kinship-dim)] hover:text-[var(--kinship-mid)] transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--kinship-dim)] font-medium tabular-nums">
              {questionIndex + 1} / {questions.length}
            </span>
            <a
              href={adminUrl}
              className="flex items-center gap-1 text-xs text-[var(--kinship-dim)] hover:text-[var(--kinship-mid)] transition-colors"
              title="Admin view"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </a>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" initial={false}>
            {stage === "welcome" && (
              <WelcomeScreen
                key="welcome"
                title={survey.title}
                description={survey.description}
                questionCount={questions.length}
                adminUrl={adminUrl}
                onStart={() => {
                  setDirection(1);
                  setStage("questions");
                }}
              />
            )}

            {stage === "questions" && currentQuestion && (
              <motion.div
                key={`q-${questionIndex}`}
                initial={{ opacity: 0, y: direction * 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -40 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                {/* Question number */}
                <p className="section-label mb-4 text-[var(--kinship-dim)]">
                  question {questionIndex + 1}
                  {!currentQuestion.required && (
                    <span className="ml-2 normal-case font-normal text-[var(--kinship-dim)] opacity-70">
                      · optional
                    </span>
                  )}
                </p>

                {/* Question text */}
                <h2
                  className="text-serif mb-3 leading-tight text-[var(--kinship-ink)]"
                  style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
                >
                  {currentQuestion.title}
                </h2>

                {/* Description */}
                {currentQuestion.description && (
                  <p className="text-[var(--kinship-mid)] mb-8 text-base leading-relaxed">
                    {currentQuestion.description}
                  </p>
                )}

                {/* Field */}
                <QuestionField
                  question={currentQuestion}
                  value={displayAnswers[currentQuestion.id]}
                  onChange={(v) => setAnswer(currentQuestion.id, v)}
                  onAdvance={advance}
                  error={fieldError}
                />
              </motion.div>
            )}

            {stage === "submitting" && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--kinship-mid)", borderTopColor: "transparent" }}
                />
                <p className="text-[var(--kinship-mid)]">Submitting…</p>
              </motion.div>
            )}

            {stage === "done" && (
              <ThankYouScreen
                key="done"
                title={survey.thankYouTitle}
                message={survey.thankYouMessage}
                adminUrl={adminUrl}
              />
            )}

            {stage === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 max-w-lg"
              >
                <h2 className="text-serif text-2xl text-[var(--kinship-ink)]">
                  Something went wrong
                </h2>
                <p className="text-[var(--kinship-mid)]">
                  {submitError ?? "An error occurred. Please try again."}
                </p>
                <button
                  onClick={() => {
                    setStage("questions");
                    setSubmitError(undefined);
                  }}
                  className="self-start flex items-center gap-2 px-6 py-3 rounded-full text-[var(--kinship-cream)] font-medium transition-all hover:opacity-90"
                  style={{ background: "var(--kinship-ink)" }}
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
