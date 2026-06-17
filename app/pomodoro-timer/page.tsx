'use client';
// Client component: uses useState, useEffect, useRef for timer logic, interval management, and audio

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// --- Types ---
type ModeKey = 'pomodoro' | 'shortBreak' | 'longBreak';

// --- Config ---
const MODES: Record<ModeKey, { label: string; duration: number; tagline: string }> = {
  pomodoro:   { label: 'Pomodoro',    duration: 25 * 60, tagline: 'Time to focus!' },
  shortBreak: { label: 'Short Break', duration:  5 * 60, tagline: 'Take a breather!' },
  longBreak:  { label: 'Long Break',  duration: 15 * 60, tagline: 'Great work — relax!' },
};

// Kinship brand palette
// --kinship-ink  #3D1A4E  (deep purple)
// --kinship-mid  #7A5590  (medium purple)
// --kinship-dim  #B8A2C8  (muted lavender)
// --kinship-cream #F5F0E8 (warm off-white)

const MODE_BG: Record<ModeKey, string> = {
  pomodoro:   '#3D1A4E',   // kinship-ink — deep purple for focus
  shortBreak: '#4C7A5E',   // muted green
  longBreak:  '#3D5A8A',   // muted blue
};

const MODE_CARD: Record<ModeKey, string> = {
  pomodoro:   '#4E2462',
  shortBreak: '#5B9070',
  longBreak:  '#4A6E9F',
};

const MODE_RING: Record<ModeKey, string> = {
  pomodoro:   '#B8A2C8',   // kinship-dim lavender
  shortBreak: '#A2C8B2',
  longBreak:  '#A2B8C8',
};

// Framer Motion ease workaround for Next.js 16
import { type Transition } from 'framer-motion';
const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition['ease'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// --------------------------------------------------------
export default function PomodoroTimerPage() {
  const [mode, setMode]           = useState<ModeKey>('pomodoro');
  const [timeLeft, setTimeLeft]   = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions]   = useState(1);
  const [completed, setCompleted] = useState(false);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);

  const switchMode = useCallback((newMode: ModeKey) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
    setCompleted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const playBell = useCallback(() => {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = audioCtxRef.current || new AudioContextClass();
    audioCtxRef.current = ctx;
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setCompleted(true);
            if (mode === 'pomodoro') setSessions((s) => s + 1);
            playBell();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode, playBell]);

  const handleStartPause = () => {
    setCompleted(false);
    setIsRunning((r) => !r);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompleted(false);
    setTimeLeft(MODES[mode].duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const progress      = 1 - timeLeft / MODES[mode].duration;
  const RADIUS        = 180;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDash    = CIRCUMFERENCE * (1 - progress);
  const bg            = MODE_BG[mode];
  const cardBg        = MODE_CARD[mode];
  const ringColor     = MODE_RING[mode];

  return (
    <motion.div
      animate={{ backgroundColor: bg }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        padding: '24px 16px',
        position: 'relative',
      }}
    >
      {/* Kinship logo — top-left corner */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: 0.9,
        }}
      >
        <Image
          src="/kinship-mark-white.svg"
          alt="Kinship"
          width={32}
          height={32}
          style={{ width: 32, height: 32 }}
        />
        <span
          style={{
            color: 'rgba(245,240,232,0.85)',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          Kinship
        </span>
      </div>

      {/* Main card */}
      <motion.div
        animate={{ backgroundColor: cardBg }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        style={{
          borderRadius: 24,
          padding: '40px 56px 48px',
          width: 540,
          maxWidth: '95vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Mode tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(0,0,0,0.18)',
            borderRadius: 12,
            padding: 4,
            width: '100%',
          }}
        >
          {(Object.keys(MODES) as ModeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: mode === key ? 700 : 500,
                fontSize: 15,
                background: mode === key ? 'rgba(245,240,232,0.15)' : 'transparent',
                color: mode === key ? '#F5F0E8' : 'rgba(245,240,232,0.5)',
                transition: 'all 0.2s',
                letterSpacing: '0.01em',
              }}
            >
              {MODES[key].label}
            </button>
          ))}
        </div>

        {/* Timer ring + digits */}
        <div
          style={{
            position: 'relative',
            width: 420,
            height: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width={420}
            height={420}
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            <circle
              cx={210} cy={210} r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={14}
            />
            <motion.circle
              cx={210} cy={210} r={RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: strokeDash }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>

          {/* Digits */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              style={{
                fontSize: 100,
                fontWeight: 800,
                color: '#F5F0E8',
                letterSpacing: '-4px',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                zIndex: 1,
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* START / PAUSE */}
        <motion.button
          onClick={handleStartPause}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: '#F5F0E8',
            color: bg,
            border: 'none',
            borderRadius: 12,
            padding: '18px 72px',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 6px 0 rgba(0,0,0,0.22)',
            width: '100%',
          }}
        >
          {isRunning ? 'PAUSE' : completed ? 'RESTART' : 'START'}
        </motion.button>

        {/* Reset */}
        {(isRunning || timeLeft !== MODES[mode].duration) && (
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(245,240,232,0.45)',
              fontSize: 14,
              cursor: 'pointer',
              marginTop: -16,
            }}
          >
            ↺ Reset
          </button>
        )}
      </motion.div>

      {/* Session counter + tagline */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 700, marginBottom: 8 }}
            >
              🎉 Time&apos;s up!
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ color: 'rgba(245,240,232,0.45)', fontSize: 18, marginBottom: 4 }}>
          #{mode === 'pomodoro' ? sessions : `${sessions - 1} complete`}
        </div>
        <div style={{ color: '#F5F0E8', fontSize: 22, fontWeight: 700 }}>
          {MODES[mode].tagline}
        </div>
      </div>
    </motion.div>
  );
}
