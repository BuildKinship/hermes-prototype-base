'use client';
// Client component: uses useState, useEffect, useRef for timer logic and interval management

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Timer modes with durations in seconds
const MODES = {
  pomodoro: { label: 'Pomodoro', duration: 25 * 60, tagline: 'Time to focus!' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, tagline: 'Take a breather!' },
  longBreak: { label: 'Long Break', duration: 15 * 60, tagline: 'Great work — relax!' },
} as const;

type ModeKey = keyof typeof MODES;

const BG_COLORS: Record<ModeKey, string> = {
  pomodoro: '#BA4949',
  shortBreak: '#4C8C5C',
  longBreak: '#457CA3',
};

const CARD_COLORS: Record<ModeKey, string> = {
  pomodoro: '#C55A5A',
  shortBreak: '#5BA06B',
  longBreak: '#5090B8',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PomodoroTimerPage() {
  const [mode, setMode] = useState<ModeKey>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(1);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Switch mode resets timer
  const switchMode = useCallback((newMode: ModeKey) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
    setCompleted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Play a simple bell-like tone using Web Audio API
  const playBell = useCallback(() => {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = audioCtxRef.current || new AudioContextClass();
    audioCtxRef.current = ctx;

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  }, []);

  // Tick logic
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

  const progress = 1 - timeLeft / MODES[mode].duration;
  const bg = BG_COLORS[mode];
  const cardBg = CARD_COLORS[mode];
  const displayMode = MODES[mode];

  // Circle progress ring
  const RADIUS = 180;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDash = CIRCUMFERENCE * (1 - progress);

  return (
    <motion.div
      animate={{ backgroundColor: bg }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)' }}
    >
      {/* Card */}
      <motion.div
        animate={{ backgroundColor: cardBg }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: 24,
          padding: '40px 56px 48px',
          width: 540,
          maxWidth: '95vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.12)', borderRadius: 12, padding: 4, width: '100%' }}>
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
                background: mode === key ? 'rgba(0,0,0,0.35)' : 'transparent',
                color: mode === key ? '#fff' : 'rgba(255,255,255,0.75)',
                transition: 'all 0.2s',
                letterSpacing: '0.01em',
              }}
            >
              {MODES[key].label}
            </button>
          ))}
        </div>

        {/* Timer ring + digits */}
        <div style={{ position: 'relative', width: 420, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* SVG ring */}
          <svg width={420} height={420} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle
              cx={210} cy={210} r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={14}
            />
            {/* Progress */}
            <motion.circle
              cx={210} cy={210} r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: strokeDash }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>

          {/* Timer digits */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              style={{
                fontSize: 100,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-4px',
                lineHeight: 1,
                textShadow: '0 2px 24px rgba(0,0,0,0.2)',
                fontVariantNumeric: 'tabular-nums',
                zIndex: 1,
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Start / Pause button */}
        <motion.button
          onClick={handleStartPause}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: '#fff',
            color: bg,
            border: 'none',
            borderRadius: 12,
            padding: '18px 72px',
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 6px 0 rgba(0,0,0,0.18)',
            width: '100%',
          }}
        >
          {isRunning ? 'PAUSE' : completed ? 'RESTART' : 'START'}
        </motion.button>

        {/* Reset link */}
        {(isRunning || timeLeft !== MODES[mode].duration) && (
          <button
            onClick={handleReset}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 14, cursor: 'pointer', marginTop: -16 }}
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
              style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8 }}
            >
              🎉 Time&apos;s up!
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, marginBottom: 4 }}>
          #{mode === 'pomodoro' ? sessions : `${sessions - 1} complete`}
        </div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>
          {displayMode.tagline}
        </div>
      </div>
    </motion.div>
  );
}
