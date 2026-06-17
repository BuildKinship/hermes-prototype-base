"use client";
// slide deck presentation — keyboard nav, animated SVGs, interactive ask-the-room prompts

import React, { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  Brain,
  Zap,
  Users,
  Calendar,
  MessageSquare,
  Database,
  GitBranch,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  Mic,
  Star,
  CheckCircle2,
  Layers,
  Network,
} from "lucide-react";

// ─── Motion constants ─────────────────────────────────────────────────────────
const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];
const EASE_IN = [0.55, 0, 1, 0.45] as unknown as Transition["ease"];

// ─── Looping SVG Animations ──────────────────────────────────────────────────

// Cover: slow orbital rings + pulse around the brain
function CoverBrainAnimation() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes orbit1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes pulse-ring { 0%,100% { opacity:0.15; r:52; } 50% { opacity:0.35; r:58; } }
        @keyframes dot-fade { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        .orbit1 { transform-origin:110px 110px; animation: orbit1 8s linear infinite; }
        .orbit2 { transform-origin:110px 110px; animation: orbit2 12s linear infinite; }
        .pulse-ring { transform-origin:110px 110px; animation: pulse-ring 3s ease-in-out infinite; }
      `}</style>
      {/* Pulse ring */}
      <circle className="pulse-ring" cx="110" cy="110" r="52" stroke="oklch(60% 0.08 293)" strokeWidth="1.5" fill="none" />
      {/* Orbit 1 — 3 dots */}
      <g className="orbit1">
        <circle cx="110" cy="42" r="5" fill="oklch(75% 0.12 293)" opacity="0.9"/>
        <circle cx="162" cy="141" r="4" fill="oklch(65% 0.10 293)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="58" cy="141" r="3.5" fill="oklch(55% 0.08 293)" opacity="0.5"/>
      </g>
      {/* Orbit 2 — 2 dots */}
      <g className="orbit2">
        <circle cx="110" cy="30" r="3" fill="oklch(70% 0.08 240)" opacity="0.6"/>
        <circle cx="190" cy="110" r="4" fill="oklch(60% 0.10 220)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>
      {/* Center icon container */}
      <rect x="82" y="82" width="56" height="56" rx="16" fill="oklch(25% 0.08 293)" stroke="oklch(40% 0.08 293)" strokeWidth="1.5"/>
    </svg>
  );
}

// Slide 1 (WhySlide): Documents scattering to silos → converging to one place
function ContextLossAnimation() {
  return (
    <svg width="340" height="160" viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes scatter1 { 0%,100%{transform:translate(0,0) rotate(0deg);opacity:1} 40%{transform:translate(-55px,-28px) rotate(-18deg);opacity:0.4} 60%{transform:translate(-55px,-28px) rotate(-18deg);opacity:0.4} 90%{transform:translate(0,0) rotate(0deg);opacity:1} }
        @keyframes scatter2 { 0%,100%{transform:translate(0,0) rotate(0deg);opacity:1} 40%{transform:translate(55px,-24px) rotate(14deg);opacity:0.4} 60%{transform:translate(55px,-24px) rotate(14deg);opacity:0.4} 90%{transform:translate(0,0) rotate(0deg);opacity:1} }
        @keyframes scatter3 { 0%,100%{transform:translate(0,0) rotate(0deg);opacity:1} 40%{transform:translate(-30px,40px) rotate(22deg);opacity:0.4} 60%{transform:translate(-30px,40px) rotate(22deg);opacity:0.4} 90%{transform:translate(0,0) rotate(0deg);opacity:1} }
        @keyframes scatter4 { 0%,100%{transform:translate(0,0) rotate(0deg);opacity:1} 40%{transform:translate(50px,36px) rotate(-16deg);opacity:0.4} 60%{transform:translate(50px,36px) rotate(-16deg);opacity:0.4} 90%{transform:translate(0,0) rotate(0deg);opacity:1} }
        @keyframes arrow-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.85} }
        @keyframes hub-glow { 0%,100%{fill:oklch(22% 0.08 293)} 50%{fill:oklch(30% 0.12 293)} }
        @keyframes particle-flow { 0%{offset-distance:0%;opacity:0} 10%{opacity:0.9} 90%{opacity:0.9} 100%{offset-distance:100%;opacity:0} }
        .doc1{transform-origin:110px 80px;animation:scatter1 4s ease-in-out infinite;}
        .doc2{transform-origin:230px 80px;animation:scatter2 4s ease-in-out infinite 0.3s;}
        .doc3{transform-origin:110px 80px;animation:scatter3 4s ease-in-out infinite 0.6s;}
        .doc4{transform-origin:230px 80px;animation:scatter4 4s ease-in-out infinite 0.9s;}
        .hub-rect{animation:hub-glow 3s ease-in-out infinite;}
        .arrow-l{animation:arrow-pulse 2s ease-in-out infinite;}
        .arrow-r{animation:arrow-pulse 2s ease-in-out infinite 0.5s;}
      `}</style>

      {/* LEFT SIDE: Chaos */}
      <text x="55" y="14" fontSize="9" fill="oklch(55% 0.06 293)" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCATTERED</text>

      {/* Scattered documents */}
      <g className="doc1">
        <rect x="30" y="30" width="36" height="44" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
        <line x1="37" y1="42" x2="59" y2="42" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="37" y1="50" x2="55" y2="50" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="37" y1="58" x2="52" y2="58" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
      </g>
      <g className="doc2">
        <rect x="90" y="24" width="32" height="40" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
        <line x1="97" y1="36" x2="115" y2="36" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="97" y1="44" x2="113" y2="44" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="97" y1="52" x2="110" y2="52" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
      </g>
      <g className="doc3">
        <rect x="35" y="82" width="30" height="38" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
        <line x1="41" y1="93" x2="59" y2="93" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="41" y1="101" x2="57" y2="101" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="41" y1="109" x2="54" y2="109" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
      </g>
      <g className="doc4">
        <rect x="88" y="78" width="34" height="42" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
        <line x1="95" y1="90" x2="115" y2="90" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="95" y1="98" x2="113" y2="98" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
        <line x1="95" y1="106" x2="109" y2="106" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/>
      </g>

      {/* Label: "inbox", "someone's head" */}
      <text x="48" y="148" fontSize="8" fill="oklch(65% 0.05 293)" fontFamily="monospace" textAnchor="middle">inbox</text>
      <text x="105" y="148" fontSize="8" fill="oklch(65% 0.05 293)" fontFamily="monospace" textAnchor="middle">someone&apos;s head</text>

      {/* ARROWS */}
      <g className="arrow-l">
        <path d="M 148 80 L 164 80" stroke="var(--kinship-mid)" strokeWidth="2" strokeDasharray="4 3"/>
        <path d="M 161 76 L 165 80 L 161 84" stroke="var(--kinship-mid)" strokeWidth="1.5" fill="none"/>
      </g>
      <g className="arrow-r">
        <path d="M 176 80 L 192 80" stroke="var(--kinship-mid)" strokeWidth="2" strokeDasharray="4 3"/>
        <path d="M 189 76 L 193 80 L 189 84" stroke="var(--kinship-mid)" strokeWidth="1.5" fill="none"/>
      </g>

      {/* CENTER: One place */}
      <text x="170" y="14" fontSize="9" fill="var(--kinship-mid)" fontFamily="monospace" textAnchor="middle" letterSpacing="1">ONE PLACE</text>
      <rect className="hub-rect" x="148" y="52" width="44" height="56" rx="10" fill="oklch(22% 0.08 293)" stroke="oklch(40% 0.10 293)" strokeWidth="1.5"/>
      {/* Brain icon paths simplified */}
      <text x="170" y="85" fontSize="22" textAnchor="middle" fill="var(--kinship-cream)">⬡</text>

      {/* RIGHT SIDE: Searchable + connected */}
      <text x="265" y="14" fontSize="9" fill="oklch(55% 0.06 293)" fontFamily="monospace" textAnchor="middle" letterSpacing="1">CONNECTED</text>

      {/* Three neat connected nodes */}
      <circle cx="225" cy="55" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
      <text x="225" y="60" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">📄</text>

      <circle cx="280" cy="45" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
      <text x="280" y="50" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">📅</text>

      <circle cx="305" cy="90" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
      <text x="305" y="95" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">💬</text>

      <circle cx="240" cy="112" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/>
      <text x="240" y="117" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">🏫</text>

      {/* Connection lines with animated particles */}
      <line x1="239" y1="55" x2="266" y2="49" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="280" y1="59" x2="298" y2="77" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="225" y1="69" x2="232" y2="98" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="254" y1="112" x2="291" y2="97" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>

      {/* Animated signal dots on connections */}
      <circle r="3" fill="var(--kinship-mid)" opacity="0.8">
        <animateMotion dur="2.4s" repeatCount="indefinite" begin="0s">
          <mpath xlinkHref="#path-a"/>
        </animateMotion>
      </circle>
      <path id="path-a" d="M 239 55 L 266 49" fill="none"/>

      <circle r="2.5" fill="var(--kinship-mid)" opacity="0.7">
        <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.6s">
          <mpath xlinkHref="#path-b"/>
        </animateMotion>
      </circle>
      <path id="path-b" d="M 280 59 L 298 77" fill="none"/>

      <circle r="2.5" fill="var(--kinship-mid)" opacity="0.7">
        <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.2s">
          <mpath xlinkHref="#path-c"/>
        </animateMotion>
      </circle>
      <path id="path-c" d="M 225 69 L 232 98" fill="none"/>

      <circle r="3" fill="var(--kinship-mid)" opacity="0.8">
        <animateMotion dur="3.0s" repeatCount="indefinite" begin="0.9s">
          <mpath xlinkHref="#path-d"/>
        </animateMotion>
      </circle>
      <path id="path-d" d="M 254 112 L 291 97" fill="none"/>
    </svg>
  );
}

// Slide 3 (ToolsSlide): hub-and-spoke with animated signal pulses
function ToolsNetworkAnimation() {
  const tools = [
    { label: "Notion", x: 90, y: 30, emoji: "📋" },
    { label: "Google", x: 260, y: 30, emoji: "🗂" },
    { label: "Slack", x: 320, y: 100, emoji: "💬" },
    { label: "Zoom", x: 260, y: 170, emoji: "🎥" },
    { label: "Claude", x: 90, y: 170, emoji: "✨" },
    { label: "Hermes", x: 30, y: 100, emoji: "⚡" },
  ];
  const cx = 175, cy = 100;
  return (
    <svg width="350" height="200" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes hub-pulse { 0%,100%{r:28;opacity:1} 50%{r:31;opacity:0.85} }
        .hub-outer{transform-origin:175px 100px;animation:hub-pulse 3s ease-in-out infinite;}
      `}</style>
      {/* Spoke lines */}
      {tools.map((t, i) => (
        <line key={i} x1={cx} y1={cy} x2={t.x} y2={t.y}
          stroke="oklch(70% 0.08 293)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
      ))}
      {/* Animated particles on each spoke */}
      {tools.map((t, i) => (
        <g key={`p${i}`}>
          <circle r="3.5" fill="var(--kinship-mid)" opacity="0.9">
            <animateMotion dur={`${1.8 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
              <mpath xlinkHref={`#spoke-${i}`}/>
            </animateMotion>
          </circle>
          <path id={`spoke-${i}`} d={`M ${cx} ${cy} L ${t.x} ${t.y}`} fill="none"/>
        </g>
      ))}
      {/* Tool nodes */}
      {tools.map((t, i) => (
        <g key={`n${i}`}>
          <circle cx={t.x} cy={t.y} r="20" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.5"/>
          <text x={t.x} y={t.y + 5} fontSize="14" textAnchor="middle">{t.emoji}</text>
        </g>
      ))}
      {/* Center hub */}
      <circle className="hub-outer" cx={cx} cy={cy} r="28" fill="oklch(25% 0.09 293)" stroke="oklch(45% 0.10 293)" strokeWidth="2"/>
      <text x={cx} y={cy + 6} fontSize="20" textAnchor="middle" fill="var(--kinship-cream)">⬡</text>
    </svg>
  );
}

// Slide 5 (Context Engineering): three boxes with signal pulses flowing between them
function ContextFlowAnimation() {
  return (
    <svg width="420" height="120" viewBox="0 0 420 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes box-live { 0%,100%{opacity:1} 50%{opacity:0.75} }
        .box-live{animation:box-live 2.5s ease-in-out infinite;}
      `}</style>

      {/* Box 1: Customer */}
      <rect x="10" y="30" width="110" height="60" rx="10" fill="white" stroke="oklch(60% 0.17 142)" strokeWidth="2"/>
      <text x="65" y="58" fontSize="10" textAnchor="middle" fill="oklch(40% 0.15 142)" fontFamily="monospace" fontWeight="600">CUSTOMER</text>
      <text x="65" y="72" fontSize="9" textAnchor="middle" fill="oklch(55% 0.12 142)" fontFamily="monospace">CONTEXT</text>
      <circle cx="65" cy="86" r="4" fill="oklch(70% 0.17 142)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
      </circle>

      {/* Arrow 1→2 */}
      <path d="M 122 60 L 148 60" stroke="oklch(60% 0.17 142)" strokeWidth="1.5" strokeDasharray="5 3"/>
      <path d="M 145 56 L 149 60 L 145 64" stroke="oklch(60% 0.17 142)" strokeWidth="1.5" fill="none"/>
      <circle r="3" fill="oklch(60% 0.17 142)" opacity="0.8">
        <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
          <mpath xlinkHref="#flow-1"/>
        </animateMotion>
      </circle>
      <path id="flow-1" d="M 122 60 L 148 60" fill="none"/>

      {/* Box 2: Operations — LIVE */}
      <rect className="box-live" x="152" y="20" width="116" height="80" rx="10" fill="oklch(25% 0.09 293)" stroke="var(--kinship-mid)" strokeWidth="2.5"/>
      <text x="210" y="52" fontSize="10" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="monospace" fontWeight="700">OPERATIONS</text>
      <text x="210" y="66" fontSize="9" textAnchor="middle" fill="oklch(70% 0.05 293)" fontFamily="monospace">CONTEXT</text>
      <text x="210" y="84" fontSize="8" textAnchor="middle" fill="var(--kinship-mid)" fontFamily="monospace">● LIVE TODAY</text>

      {/* Arrow 2→3 */}
      <path d="M 270 60 L 296 60" stroke="var(--kinship-mid)" strokeWidth="1.5" strokeDasharray="5 3"/>
      <path d="M 293 56 L 297 60 L 293 64" stroke="var(--kinship-mid)" strokeWidth="1.5" fill="none"/>
      <circle r="3" fill="var(--kinship-mid)" opacity="0.9">
        <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.4s">
          <mpath xlinkHref="#flow-2"/>
        </animateMotion>
      </circle>
      <path id="flow-2" d="M 270 60 L 296 60" fill="none"/>

      {/* Box 3: Product */}
      <rect x="300" y="30" width="110" height="60" rx="10" fill="white" stroke="oklch(62% 0.21 27)" strokeWidth="2"/>
      <text x="355" y="58" fontSize="10" textAnchor="middle" fill="oklch(48% 0.18 27)" fontFamily="monospace" fontWeight="600">PRODUCT</text>
      <text x="355" y="72" fontSize="9" textAnchor="middle" fill="oklch(58% 0.15 27)" fontFamily="monospace">CONTEXT</text>
      <text x="355" y="86" fontSize="8" textAnchor="middle" fill="oklch(65% 0.10 27)" fontFamily="monospace">near-term</text>
    </svg>
  );
}

// Slide 6 (Capture): transcript lines flowing into a brain hub
function CaptureFlowAnimation() {
  return (
    <svg width="380" height="140" viewBox="0 0 380 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes line-appear { 0%,100%{scaleX:0;opacity:0} 20%{scaleX:1;opacity:1} 75%{scaleX:1;opacity:1} 95%{opacity:0} }
        @keyframes brain-pulse { 0%,100%{fill:oklch(25% 0.08 293)} 50%{fill:oklch(32% 0.12 293)} }
        .tline1{transform-origin:30px 45px;animation:line-appear 3.5s ease-in-out infinite;}
        .tline2{transform-origin:30px 55px;animation:line-appear 3.5s ease-in-out infinite 0.4s;}
        .tline3{transform-origin:30px 65px;animation:line-appear 3.5s ease-in-out infinite 0.8s;}
        .tline4{transform-origin:30px 95px;animation:line-appear 3.5s ease-in-out infinite 1.2s;}
        .tline5{transform-origin:30px 105px;animation:line-appear 3.5s ease-in-out infinite 1.6s;}
        .tline6{transform-origin:30px 115px;animation:line-appear 3.5s ease-in-out infinite 2.0s;}
        .brain-bg{animation:brain-pulse 2.5s ease-in-out infinite;}
      `}</style>

      {/* SOURCE — Zoom call icon */}
      <rect x="10" y="20" width="90" height="100" rx="8" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.5"/>
      <text x="55" y="42" fontSize="9" textAnchor="middle" fill="oklch(55% 0.06 293)" fontFamily="monospace" letterSpacing="1">TRANSCRIPT</text>

      {/* Animated text lines appearing */}
      <g className="tline1"><rect x="18" y="48" width="70" height="6" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline2"><rect x="18" y="58" width="55" height="6" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline3"><rect x="18" y="68" width="63" height="6" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline4"><rect x="18" y="98" width="68" height="6" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline5"><rect x="18" y="108" width="50" height="6" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline6"><rect x="18" y="118" width="60" height="6" rx="2" fill="oklch(85% 0.04 293)"/></g>

      {/* FLOW ARROWS with particles */}
      <path d="M 104 70 Q 160 70 200 70" stroke="var(--kinship-mid)" strokeWidth="2" strokeDasharray="6 4" fill="none"/>
      <path d="M 197 66 L 201 70 L 197 74" stroke="var(--kinship-mid)" strokeWidth="2" fill="none"/>

      {/* Particles */}
      {[0, 0.8, 1.6].map((delay, i) => (
        <circle key={i} r="4" fill="var(--kinship-mid)" opacity="0.85">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${delay}s`}>
            <mpath xlinkHref="#capture-path"/>
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.2s" repeatCount="indefinite" begin={`${delay}s`}/>
        </circle>
      ))}
      <path id="capture-path" d="M 104 70 Q 160 70 200 70" fill="none"/>

      {/* BRAIN HUB */}
      <circle className="brain-bg" cx="240" cy="70" r="38" fill="oklch(25% 0.08 293)" stroke="var(--kinship-mid)" strokeWidth="2"/>
      <text x="240" y="78" fontSize="28" textAnchor="middle" fill="var(--kinship-cream)">⬡</text>

      {/* OUTPUT arrows to Notion + Wiki */}
      <path d="M 278 55 Q 310 40 336 40" stroke="oklch(60% 0.10 293)" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
      <path d="M 278 85 Q 310 100 336 100" stroke="oklch(60% 0.10 293)" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>

      {/* Animated output particles */}
      <circle r="3" fill="oklch(75% 0.08 293)" opacity="0.8">
        <animateMotion dur="2s" repeatCount="indefinite" begin="1s">
          <mpath xlinkHref="#out-path-1"/>
        </animateMotion>
      </circle>
      <path id="out-path-1" d="M 278 55 Q 310 40 336 40" fill="none"/>

      <circle r="3" fill="oklch(75% 0.08 293)" opacity="0.8">
        <animateMotion dur="2s" repeatCount="indefinite" begin="1.6s">
          <mpath xlinkHref="#out-path-2"/>
        </animateMotion>
      </circle>
      <path id="out-path-2" d="M 278 85 Q 310 100 336 100" fill="none"/>

      {/* Output labels */}
      <rect x="335" y="26" width="42" height="28" rx="5" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.2"/>
      <text x="356" y="44" fontSize="9" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">Notion</text>

      <rect x="335" y="86" width="36" height="28" rx="5" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.2"/>
      <text x="353" y="104" fontSize="9" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">Wiki</text>
    </svg>
  );
}

// Slide 4 (Hermes): animated Slack-style message appearing in chat
function HermesChatAnimation() {
  return (
    <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes msg-in { 0%,15%{transform:translateY(12px);opacity:0} 30%,80%{transform:translateY(0);opacity:1} 90%,100%{opacity:0.8} }
        @keyframes msg-in2 { 0%,35%{transform:translateY(12px);opacity:0} 50%,80%{transform:translateY(0);opacity:1} 90%,100%{opacity:0.8} }
        @keyframes msg-in3 { 0%,55%{transform:translateY(12px);opacity:0} 70%,80%{transform:translateY(0);opacity:1} 90%,100%{opacity:0.8} }
        @keyframes typing-dot { 0%,80%,100%{opacity:0.3;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }
        @keyframes cursor-blink { 0%,100%{opacity:0} 50%{opacity:1} }
        .msg1{animation:msg-in 5s ease-out infinite;}
        .msg2{animation:msg-in2 5s ease-out infinite;}
        .msg3{animation:msg-in3 5s ease-out infinite;}
        .td1{animation:typing-dot 1.2s ease-in-out infinite 0s;}
        .td2{animation:typing-dot 1.2s ease-in-out infinite 0.2s;}
        .td3{animation:typing-dot 1.2s ease-in-out infinite 0.4s;}
      `}</style>

      {/* Chat container */}
      <rect x="10" y="10" width="300" height="180" rx="12" fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      {/* Header */}
      <rect x="10" y="10" width="300" height="34" rx="12" fill="oklch(97% 0.01 293)"/>
      <rect x="10" y="34" width="300" height="10" fill="oklch(97% 0.01 293)"/>
      <circle cx="30" cy="27" r="8" fill="oklch(25% 0.09 293)"/>
      <text x="30" y="31" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">⚡</text>
      <text x="46" y="32" fontSize="10" fontWeight="700" fill="oklch(30% 0.06 293)" fontFamily="system-ui">Hermes</text>
      <circle cx="240" cy="27" r="4" fill="oklch(60% 0.17 142)"/>
      <text x="250" y="31" fontSize="8" fill="oklch(50% 0.12 142)" fontFamily="monospace">online</text>

      {/* Messages */}
      <g className="msg1">
        <rect x="20" y="56" width="200" height="32" rx="8" fill="oklch(25% 0.09 293)"/>
        <text x="33" y="73" fontSize="10" fill="var(--kinship-cream)" fontFamily="system-ui">✅ Zoom recap filed to Notion</text>
      </g>

      <g className="msg2">
        <rect x="20" y="96" width="170" height="32" rx="8" fill="oklch(25% 0.09 293)"/>
        <text x="33" y="113" fontSize="10" fill="var(--kinship-cream)" fontFamily="system-ui">📅 Zoom call created</text>
      </g>

      <g className="msg3">
        <rect x="20" y="136" width="220" height="32" rx="8" fill="oklch(25% 0.09 293)"/>
        <text x="33" y="153" fontSize="10" fill="var(--kinship-cream)" fontFamily="system-ui">🔬 Research brief ready</text>
      </g>

      {/* Typing indicator */}
      <rect x="20" y="168" width="52" height="22" rx="11" fill="oklch(93% 0.02 293)"/>
      <circle className="td1" cx="32" cy="179" r="3" fill="oklch(60% 0.06 293)"/>
      <circle className="td2" cx="42" cy="179" r="3" fill="oklch(60% 0.06 293)"/>
      <circle className="td3" cx="52" cy="179" r="3" fill="oklch(60% 0.06 293)"/>

      {/* Input box suggestion */}
      <rect x="20" y="192" width="0" height="0" rx="0"/>
    </svg>
  );
}

// Slide 7 (Two Representations): animated split-view database ↔ graph
function TwoLensAnimation() {
  return (
    <svg width="360" height="130" viewBox="0 0 360 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes row-scan { 0%,100%{fill:white} 50%{fill:oklch(94% 0.04 293)} }
        @keyframes node-pop { 0%,100%{r:8;opacity:0.7} 50%{r:10;opacity:1} }
        .row1{animation:row-scan 3s ease-in-out infinite 0s;}
        .row2{animation:row-scan 3s ease-in-out infinite 0.5s;}
        .row3{animation:row-scan 3s ease-in-out infinite 1s;}
        .row4{animation:row-scan 3s ease-in-out infinite 1.5s;}
        .gnode1{animation:node-pop 2.4s ease-in-out infinite 0s;}
        .gnode2{animation:node-pop 2.4s ease-in-out infinite 0.6s;}
        .gnode3{animation:node-pop 2.4s ease-in-out infinite 1.2s;}
        .gnode4{animation:node-pop 2.4s ease-in-out infinite 1.8s;}
      `}</style>

      {/* LEFT: Notion Database table */}
      <rect x="10" y="10" width="155" height="110" rx="8" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.5"/>
      {/* Header row */}
      <rect x="10" y="10" width="155" height="24" rx="8" fill="oklch(93% 0.03 293)"/>
      <rect x="10" y="26" width="155" height="8" fill="oklch(93% 0.03 293)"/>
      <text x="24" y="26" fontSize="9" fontWeight="700" fill="oklch(40% 0.06 293)" fontFamily="monospace">NAME</text>
      <text x="80" y="26" fontSize="9" fontWeight="700" fill="oklch(40% 0.06 293)" fontFamily="monospace">TYPE</text>
      <text x="120" y="26" fontSize="9" fontWeight="700" fill="oklch(40% 0.06 293)" fontFamily="monospace">STATUS</text>

      {/* Data rows */}
      <g className="row1"><rect x="11" y="34" width="153" height="16" rx="0" fill="white"/>
        <text x="24" y="46" fontSize="8" fill="oklch(45% 0.06 293)" fontFamily="monospace">Maple Ridge</text>
        <text x="80" y="46" fontSize="8" fill="oklch(55% 0.06 293)" fontFamily="monospace">School</text>
        <circle cx="130" cy="42" r="4" fill="oklch(60% 0.17 142)"/>
      </g>
      <line x1="11" y1="50" x2="163" y2="50" stroke="oklch(88% 0.02 293)" strokeWidth="1"/>

      <g className="row2"><rect x="11" y="50" width="153" height="16" rx="0" fill="white"/>
        <text x="24" y="62" fontSize="8" fill="oklch(45% 0.06 293)" fontFamily="monospace">Sarah Chen</text>
        <text x="80" y="62" fontSize="8" fill="oklch(55% 0.06 293)" fontFamily="monospace">Contact</text>
        <circle cx="130" cy="58" r="4" fill="oklch(75% 0.12 293)"/>
      </g>
      <line x1="11" y1="66" x2="163" y2="66" stroke="oklch(88% 0.02 293)" strokeWidth="1"/>

      <g className="row3"><rect x="11" y="66" width="153" height="16" rx="0" fill="white"/>
        <text x="24" y="78" fontSize="8" fill="oklch(45% 0.06 293)" fontFamily="monospace">Q4 Pilot</text>
        <text x="80" y="78" fontSize="8" fill="oklch(55% 0.06 293)" fontFamily="monospace">Deal</text>
        <circle cx="130" cy="74" r="4" fill="oklch(62% 0.21 27)"/>
      </g>
      <line x1="11" y1="82" x2="163" y2="82" stroke="oklch(88% 0.02 293)" strokeWidth="1"/>

      <g className="row4"><rect x="11" y="82" width="153" height="16" rx="0" fill="white"/>
        <text x="24" y="94" fontSize="8" fill="oklch(45% 0.06 293)" fontFamily="monospace">Mar 2026 call</text>
        <text x="80" y="94" fontSize="8" fill="oklch(55% 0.06 293)" fontFamily="monospace">Meeting</text>
        <circle cx="130" cy="90" r="4" fill="oklch(60% 0.08 220)"/>
      </g>

      {/* For humans label */}
      <text x="88" y="118" fontSize="8" textAnchor="middle" fill="oklch(55% 0.06 293)" fontFamily="monospace" letterSpacing="1">FOR HUMANS</text>

      {/* DIVIDER */}
      <line x1="180" y1="10" x2="180" y2="120" stroke="oklch(85% 0.03 293)" strokeWidth="1" strokeDasharray="4 3"/>
      <text x="180" y="68" fontSize="18" textAnchor="middle" fill="oklch(75% 0.04 293)">↔</text>

      {/* RIGHT: Knowledge graph */}
      <circle className="gnode1" cx="245" cy="45" r="8" fill="oklch(25% 0.09 293)" stroke="var(--kinship-mid)" strokeWidth="1.5"/>
      <text x="245" y="49" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">S</text>

      <circle className="gnode2" cx="310" cy="38" r="8" fill="oklch(25% 0.09 293)" stroke="oklch(60% 0.17 142)" strokeWidth="1.5"/>
      <text x="310" y="42" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">P</text>

      <circle className="gnode3" cx="340" cy="85" r="8" fill="oklch(25% 0.09 293)" stroke="oklch(62% 0.21 27)" strokeWidth="1.5"/>
      <text x="340" y="89" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">D</text>

      <circle className="gnode4" cx="250" cy="95" r="8" fill="oklch(25% 0.09 293)" stroke="oklch(60% 0.10 220)" strokeWidth="1.5"/>
      <text x="250" y="99" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">M</text>

      {/* Graph edges */}
      <line x1="253" y1="45" x2="302" y2="40" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="310" y1="46" x2="337" y2="77" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="245" y1="53" x2="249" y2="87" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="258" y1="95" x2="332" y2="88" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>

      {/* Animated traversal particle */}
      <circle r="3.5" fill="var(--kinship-mid)" opacity="0.9">
        <animateMotion dur="4s" repeatCount="indefinite" begin="0s">
          <mpath xlinkHref="#graph-path"/>
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;1;0" dur="4s" repeatCount="indefinite"/>
      </circle>
      <path id="graph-path" d="M 245 45 L 310 38 L 340 85 L 250 95 L 245 45" fill="none"/>

      {/* Edge labels */}
      <text x="278" y="37" fontSize="7" fill="oklch(62% 0.08 293)" fontFamily="monospace">knows</text>
      <text x="330" y="65" fontSize="7" fill="oklch(62% 0.08 293)" fontFamily="monospace">at</text>
      <text x="225" y="74" fontSize="7" fill="oklch(62% 0.08 293)" fontFamily="monospace">has</text>

      <text x="286" y="118" fontSize="8" textAnchor="middle" fill="oklch(55% 0.06 293)" fontFamily="monospace" letterSpacing="1">FOR AI</text>
    </svg>
  );
}

// Slide 8 (How You Help): animated signal bubble rising
function SignalAnimation() {
  return (
    <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes bubble-rise { 0%{transform:translateY(30px);opacity:0} 20%,75%{transform:translateY(0);opacity:1} 95%,100%{transform:translateY(-20px);opacity:0} }
        @keyframes bubble-rise2 { 0%,30%{transform:translateY(30px);opacity:0} 50%,75%{transform:translateY(0);opacity:1} 95%,100%{transform:translateY(-20px);opacity:0} }
        @keyframes bubble-rise3 { 0%,55%{transform:translateY(30px);opacity:0} 75%,85%{transform:translateY(0);opacity:1} 95%,100%{transform:translateY(-20px);opacity:0} }
        .b1{animation:bubble-rise 4s ease-in-out infinite;}
        .b2{animation:bubble-rise2 4s ease-in-out infinite;}
        .b3{animation:bubble-rise3 4s ease-in-out infinite;}
      `}</style>
      <text x="100" y="94" fontSize="9" textAnchor="middle" fill="oklch(60% 0.06 293)" fontFamily="monospace" letterSpacing="1">IDEAS SURFACE</text>
      <g className="b1">
        <rect x="12" y="40" width="68" height="30" rx="8" fill="oklch(25% 0.09 293)"/>
        <path d="M 20 70 L 14 80 L 28 70" fill="oklch(25% 0.09 293)"/>
        <text x="46" y="60" fontSize="9" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="system-ui">I wish this…</text>
      </g>
      <g className="b2">
        <rect x="65" y="28" width="72" height="30" rx="8" fill="var(--kinship-mid)"/>
        <path d="M 72 58 L 68 68 L 82 58" fill="var(--kinship-mid)"/>
        <text x="101" y="48" fontSize="9" textAnchor="middle" fill="white" fontFamily="system-ui">auto-captured!</text>
      </g>
      <g className="b3">
        <rect x="115" y="40" width="74" height="30" rx="8" fill="oklch(25% 0.09 293)"/>
        <path d="M 122 70 L 118 80 L 132 70" fill="oklch(25% 0.09 293)"/>
        <text x="152" y="60" fontSize="9" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="system-ui">#brain-context</text>
      </g>
    </svg>
  );
}

// Cover: pulsing pipe/flow animation for the final slide
function PipeFlowAnimation() {
  return (
    <svg width="280" height="60" viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes pipe-fill { 0%{stroke-dashoffset:260} 60%{stroke-dashoffset:0} 100%{stroke-dashoffset:0} }
        @keyframes pipe-glow { 0%,100%{opacity:0.4} 70%{opacity:0.9} }
        .pipe-line{stroke-dasharray:260;animation:pipe-fill 4s ease-out infinite;animation:pipe-fill 4s ease-out infinite;}
        .pipe-glow{animation:pipe-glow 4s ease-in-out infinite;}
      `}</style>
      {/* Pipe */}
      <path d="M 10 30 C 60 30 80 10 140 10 C 200 10 220 50 280 50"
        stroke="oklch(40% 0.07 293)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      {/* Flowing fill */}
      <path className="pipe-line pipe-glow" d="M 10 30 C 60 30 80 10 140 10 C 200 10 220 50 280 50"
        stroke="var(--kinship-mid)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="260" strokeDashoffset="260">
        <animate attributeName="stroke-dashoffset" values="260;0;0;260" dur="4s" repeatCount="indefinite"/>
      </path>
      {/* Particles along the pipe */}
      {[0, 1.2, 2.4].map((delay, i) => (
        <circle key={i} r="4" fill="var(--kinship-cream)" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite" begin={`${delay}s`}>
            <mpath xlinkHref="#pipe-path"/>
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" repeatCount="indefinite" begin={`${delay}s`}/>
        </circle>
      ))}
      <path id="pipe-path" d="M 10 30 C 60 30 80 10 140 10 C 200 10 220 50 280 50" fill="none"/>
    </svg>
  );
}

// ─── Shared layout components ─────────────────────────────────────────────────

function SlideTitle({ title, subtitle, eyebrow, dark = false }: { title: string; subtitle?: string; eyebrow?: string; dark?: boolean }) {
  return (
    <div className="text-center max-w-5xl px-8">
      {eyebrow && (
        <p className="mb-6 text-sm font-mono tracking-[0.2em] uppercase" style={{ color: dark ? "oklch(70% 0.05 293)" : "var(--kinship-mid)" }}>
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
          lineHeight: 1.05,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-8 text-xl leading-relaxed mx-auto max-w-3xl" style={{ color: dark ? "oklch(70% 0.05 293)" : "oklch(50% 0.06 293)", fontWeight: 400 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className="text-xs font-mono tracking-[0.2em] uppercase mb-10" style={{ color: dark ? "oklch(60% 0.05 293)" : "var(--kinship-mid)" }}>
      {children}
    </p>
  );
}

function Pill({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-sm font-medium border"
      style={{
        background: accent ? "var(--kinship-ink)" : "transparent",
        color: accent ? "var(--kinship-cream)" : "var(--kinship-mid)",
        borderColor: accent ? "var(--kinship-ink)" : "var(--kinship-dim)",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={"rounded-2xl border p-8 " + className}
      style={{ background: "white", borderColor: "var(--kinship-dim)", ...style }}
    >
      {children}
    </div>
  );
}

function DarkCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={"rounded-2xl border p-8 " + className}
      style={{ background: "oklch(25% 0.07 293)", borderColor: "oklch(35% 0.07 293)" }}
    >
      {children}
    </div>
  );
}

function AskBubble({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl p-8 text-center max-w-3xl"
      style={{ background: "oklch(25% 0.07 293)", color: "var(--kinship-cream)" }}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Mic className="w-5 h-5" style={{ color: "var(--kinship-dim)" }} />
        <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "var(--kinship-dim)" }}>
          Ask the room
        </span>
      </div>
      <p className="text-2xl leading-snug" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
        {children}
      </p>
    </div>
  );
}

// ─── Individual Slides ────────────────────────────────────────────────────────

// Slide 0 — Cover (animated orbital brain)
function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6" style={{ background: "var(--kinship-ink)" }}>
      <div className="relative flex items-center justify-center">
        <CoverBrainAnimation />
        {/* Brain icon overlaid on center of SVG */}
        <div className="absolute flex items-center justify-center w-14 h-14 rounded-2xl"
          style={{ background: "oklch(25% 0.08 293)" }}>
          <Brain className="w-8 h-8" style={{ color: "var(--kinship-cream)" }} />
        </div>
      </div>
      <SlideTitle
        dark
        eyebrow="All-Hands · June 2026"
        title="The Kinship Brain"
        subtitle="Shared memory. Connected tools. A team that punches above its weight."
      />
      <p className="text-sm font-mono tracking-widest uppercase mt-2" style={{ color: "oklch(45% 0.06 293)" }}>
        ← → to navigate · space to advance
      </p>
    </div>
  );
}

// Slide 1 — Opening framing (animated context loss → one place)
function WhySlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>1 · Why we&apos;re here</SectionLabel>
      <SlideTitle
        title="Every company loses context."
        subtitle="It lives in someone's inbox, someone's head, a doc nobody can find. At our size — survivable. As we grow — fatal."
      />
      {/* Animated SVG — the core message visualized */}
      <ContextLossAnimation />
      <div className="grid grid-cols-3 gap-5 w-full max-w-4xl">
        {[
          { icon: Database, label: "One place", desc: "Schools, conversations, decisions — connected & searchable" },
          { icon: Users, label: "For humans & AI", desc: "Readable by your team and the agents that work alongside you" },
          { icon: Network, label: "Needs you", desc: "The pipes are built. The knowledge that flows through them — that's yours" },
        ].map(({ icon: Icon, label, desc }) => (
          <Card key={label} className="text-center" style={{ padding: "1.25rem" }}>
            <div className="flex justify-center mb-3">
              <Icon className="w-6 h-6" style={{ color: "var(--kinship-mid)" }} />
            </div>
            <p className="font-semibold mb-1 text-sm" style={{ color: "var(--kinship-ink)" }}>{label}</p>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Slide 2 — Ask the room #1
function AskRoom1() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Quick show of hands</SectionLabel>
      <AskBubble>
        &ldquo;Who has lost time this month because information was somewhere you couldn&apos;t get to it?&rdquo;
      </AskBubble>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>This is the pain the brain solves.</p>
    </div>
  );
}

// Slide 3 — Tools (animated hub-and-spoke network)
function ToolsSlide() {
  const tools = [
    { name: "Notion", role: "Company filing system — schools, contacts, deals, meetings, tasks, devices. Smart and connected." },
    { name: "Google Workspace", role: "Docs, sheets, slides. The working surface for human-made artifacts." },
    { name: "Claude Team", role: "Shared AI workspace. Skills and assets one person builds become everyone's tools." },
    { name: "Claude Cowork", role: "Your personal AI operator — connectors, scheduled tasks, daily briefings." },
    { name: "Hermes", role: "Our Slack agent. The operational brain that lives where we already talk." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>2 · Tools already in your hands</SectionLabel>
      <SlideTitle title="No new app to learn." subtitle="The brain connects the tools you already use." />
      <ToolsNetworkAnimation />
      <div className="grid grid-cols-5 gap-3 w-full max-w-5xl">
        {tools.map(({ name, role }) => (
          <Card key={name} className="flex flex-col gap-2" style={{ padding: "1rem" }}>
            <p className="font-semibold text-sm" style={{ color: "var(--kinship-ink)" }}>{name}</p>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{role}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Slide 4 — Skills
function SkillsSlide() {
  const skills = [
    "kinship-design",
    "kinship-product",
    "morning-briefing",
    "kinship-brain-sync",
    "kinship-brain-query",
    "competitive-intelligence",
    "call-prep",
    "create-an-asset",
    "call-follow-up",
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>3a · Skills</SectionLabel>
      <SlideTitle title="Stop rewriting the same prompt." subtitle="A skill is a reusable bundle of context. Load it once, get expert output every time." />
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
        {skills.map(s => <Pill key={s} accent={["kinship-design", "kinship-product", "morning-briefing"].includes(s)}>{s}</Pill>)}
      </div>
      <Card className="max-w-3xl w-full mt-2">
        <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--kinship-dim)" }}>Live demo prompt</p>
        <p className="text-lg leading-relaxed" style={{ color: "var(--kinship-ink)", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          &ldquo;Using the <span className="font-mono not-italic text-base" style={{ color: "var(--kinship-mid)" }}>kinship-design</span> and <span className="font-mono not-italic text-base" style={{ color: "var(--kinship-mid)" }}>kinship-product</span> skills, draft a one-page overview of Hearth for a prospective school principal.&rdquo;
        </p>
        <p className="text-sm mt-4" style={{ color: "oklch(55% 0.06 293)" }}>Two-line prompt. On-brand. Accurate. No manual context pasted in.</p>
      </Card>
    </div>
  );
}

// Slide 5 — Ask room #2
function AskRoom2() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Skill backlog</SectionLabel>
      <AskBubble>
        &ldquo;What&apos;s a repetitive prompt you keep retyping? That&apos;s probably a skill we should build.&rdquo;
      </AskBubble>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>Capture every answer — this is your skill backlog.</p>
    </div>
  );
}

// Slide 6 — Connectors + Scheduled tasks
function ConnectorsSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-2 gap-10 w-full max-w-5xl">
        <div className="flex flex-col gap-6">
          <SectionLabel>3b · Connectors</SectionLabel>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "2rem", color: "var(--kinship-ink)", lineHeight: 1.1 }}>
            Give Claude eyes on your real work.
          </h2>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            We use: <strong>Gmail · Google Calendar · Google Drive · Notion · Slack · Zoom.</strong>
          </p>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            &ldquo;What&apos;s on my plate today?&rdquo; pulls from your real calendar, inbox, and the brain — not a guess.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <SectionLabel>3c · Scheduled tasks</SectionLabel>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "2rem", color: "var(--kinship-ink)", lineHeight: 1.1 }}>
            Set it once, get value every day.
          </h2>
          <Card className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--kinship-cream)", border: "1px solid var(--kinship-dim)" }}>
                <Calendar className="w-4 h-4" style={{ color: "var(--kinship-mid)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--kinship-ink)" }}>Morning debrief</p>
                <p className="text-sm" style={{ color: "oklch(50% 0.06 293)" }}>Runs <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#f0ece4" }}>morning-briefing</code> against calendar, inbox, Slack, and brain. Start here — it&apos;s the fastest &ldquo;wow.&rdquo;</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--kinship-cream)", border: "1px solid var(--kinship-dim)" }}>
                <Clock className="w-4 h-4" style={{ color: "var(--kinship-mid)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--kinship-ink)" }}>Evening data dump</p>
                <p className="text-sm" style={{ color: "oklch(50% 0.06 293)" }}>Runs <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#f0ece4" }}>kinship-brain-sync</code> to sweep the day&apos;s signal into the brain so tomorrow&apos;s briefing is richer.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Slide 7 — Hermes agent (animated chat)
function HermesSlide() {
  const capabilities = ["Book appointments", "Create Zoom calls", "Financial updates", "Rapid prototyping", "Coding tasks", "Research synthesis"];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>4 · Hermes</SectionLabel>
      <div className="grid grid-cols-2 gap-12 w-full max-w-5xl items-center">
        <div className="flex flex-col gap-6">
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "2.5rem", color: "var(--kinship-ink)", lineHeight: 1.1 }}>
            The shared operator in Slack.
          </h2>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            Claude is <em>your</em> personal operator. Hermes is the <em>shared</em> operator — it lives where we already talk.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: "var(--kinship-dim)" }}>Already can do</p>
            <div className="grid grid-cols-2 gap-2">
              {capabilities.map(c => (
                <div key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--kinship-mid)" }} />
                  <span className="text-sm" style={{ color: "var(--kinship-ink)" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <HermesChatAnimation />
        </div>
      </div>
    </div>
  );
}

// Slide 8 — Ask room #3 (the big one)
function AskRoom3() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>The most important question today</SectionLabel>
      <AskBubble>
        &ldquo;If Hermes could do one thing for your role, what would it be?&rdquo;
      </AskBubble>
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl mt-2">
        {["A support agent that drafts replies?", "A sales agent that preps every call?", "An agent that flags when a school goes quiet?"].map(ex => (
          <span key={ex} className="text-sm px-4 py-2 rounded-full" style={{ background: "oklch(28% 0.07 293)", color: "oklch(70% 0.05 293)" }}>
            {ex}
          </span>
        ))}
      </div>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>Dream big — start complex, we can always scale it down. This list is your agent roadmap.</p>
    </div>
  );
}

// Slide 9 — Context engineering (animated signal flow between 3 contexts)
function ContextSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>5 · Context engineering</SectionLabel>
      <SlideTitle title="Three connected contexts." subtitle="Signals pass between them — selectively, on purpose." />
      <ContextFlowAnimation />
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { label: "Customer context", color: "oklch(60% 0.17 142)", desc: "What our customer-facing AI knows about each school and student.", status: "future" },
          { label: "Operations context", color: "var(--kinship-mid)", desc: "What helps us work better together. This is where the brain lives today — Hermes is its engine.", status: "live" },
          { label: "Product context", color: "oklch(62% 0.21 27)", desc: "What engineers use to build the right things. Near-term goal: wire ops → product.", status: "coming" },
        ].map(({ label, color, desc, status }) => (
          <Card key={label} className="relative overflow-hidden" style={{ padding: "1.25rem" }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm" style={{ color: "var(--kinship-ink)" }}>{label}</p>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{
                  background: status === "live" ? "oklch(93% 0.05 142)" : "oklch(94% 0.02 293)",
                  color: status === "live" ? "oklch(42% 0.15 142)" : "oklch(55% 0.06 293)",
                }}>
                  {status === "live" ? "● live" : status === "future" ? "coming" : "near-term"}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <ArrowRight className="w-5 h-5" style={{ color: "var(--kinship-dim)" }} />
        <p className="text-sm" style={{ color: "oklch(55% 0.06 293)" }}>
          Near-term goal: wire <strong>operations → product</strong> so we build based on real feedback from the field.
        </p>
      </div>
    </div>
  );
}

// Slide 10 — Ask room #4
function AskRoom4() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Cross-team signals</SectionLabel>
      <AskBubble>
        &ldquo;What&apos;s a signal your team generates that another team would kill to know about automatically?&rdquo;
      </AskBubble>
    </div>
  );
}

// Slide 11 — How context is captured (animated flow)
function CaptureSilde() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>6 · How context gets captured</SectionLabel>
      <SlideTitle title="You shouldn't be doing manual data entry." subtitle="The brain is assembled from tools you already use — and we're selective about what we capture." />
      <CaptureFlowAnimation />
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        <Card className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(60% 0.17 142)" }} />
            <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Live automations</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            <strong>Zoom</strong> and <strong>Google Meet</strong> — turn on the transcript. It flows through automation into the brain, updating both Notion databases and Hermes&apos;s wiki automatically.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Focus: <strong>external conversations</strong>. Any external partner meeting → straight into the brain. Nobody typed this.
          </p>
        </Card>
        <Card className="flex flex-col gap-4" style={{ background: "oklch(98% 0.01 80)" }}>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5" style={{ color: "var(--kinship-mid)" }} />
            <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>What we don&apos;t capture</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Everything. Capturing all transcripts floods the brain with noise. We&apos;re picky.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Internal chatter mostly doesn&apos;t need to be in the brain.
          </p>
        </Card>
      </div>
    </div>
  );
}

// Slide 12 — Two representations (animated split)
function TwoRepresentationsSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>7 · How the brain is presented</SectionLabel>
      <SlideTitle title="Same knowledge. Two lenses." />
      <TwoLensAnimation />
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-1">
            <Database className="w-6 h-6" style={{ color: "var(--kinship-mid)" }} />
            <p className="font-semibold text-lg" style={{ color: "var(--kinship-ink)" }}>Notion databases</p>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--kinship-dim)" }}>For humans</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            A friendlier, navigable spreadsheet. Human-driven, agent-assisted. This is where you go to <em>see</em> and <em>work with</em> information.
          </p>
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-1">
            <GitBranch className="w-6 h-6" style={{ color: "var(--kinship-mid)" }} />
            <p className="font-semibold text-lg" style={{ color: "var(--kinship-ink)" }}>The wiki / knowledge graph</p>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--kinship-dim)" }}>For AI</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Freeform. Hermes manages it automatically — &ldquo;this is a person,&rdquo; &ldquo;this is a company.&rdquo; Less human opinion required on how to organize.
          </p>
        </Card>
      </div>
      <div className="flex items-center gap-3 rounded-2xl px-8 py-5" style={{ background: "oklch(25% 0.07 293)" }}>
        <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: "var(--kinship-dim)" }} />
        <p className="text-base" style={{ color: "var(--kinship-cream)", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          &ldquo;Databases are how <em>we</em> read the brain. The knowledge graph is how <em>AI</em> reads it.&rdquo;
        </p>
      </div>
    </div>
  );
}

// Slide 13 — How you help (animated rising idea bubbles)
function HowYouHelpSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>8 · This is a team sport</SectionLabel>
      <SlideTitle title="Your job isn't data entry." subtitle="It's spotting where automation would help and raising it." />
      <SignalAnimation />
      <div className="grid grid-cols-2 gap-8 w-full max-w-5xl mt-2">
        <Card className="flex flex-col gap-4">
          <Zap className="w-6 h-6 mb-1" style={{ color: "var(--kinship-mid)" }} />
          <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Where to bring ideas</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Channel: <code className="px-2 py-0.5 rounded text-xs" style={{ background: "#f0ece4" }}>#topic-brain-context</code>
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Anything about the brain — automations, &ldquo;how do I capture this,&rdquo; ideas — goes there.
          </p>
        </Card>
        <Card className="flex flex-col gap-4">
          <MessageSquare className="w-6 h-6 mb-1" style={{ color: "var(--kinship-mid)" }} />
          <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Worked example: in-person meeting</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            No Zoom. No Meet. Open Notion mobile → start a private page → record/transcribe the meeting → hand the transcript to Hermes.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Hermes organizes it: updates the wiki and the Notion databases. No manual entry.
          </p>
        </Card>
      </div>
    </div>
  );
}

// Slide 14 — Ask room #5
function AskRoom5() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Automation ideas</SectionLabel>
      <AskBubble>
        &ldquo;Name one moment this week where you wished something just recorded itself into the brain.&rdquo;
      </AskBubble>
    </div>
  );
}

// Slide 15 — Slack conventions
function SlackSlide() {
  const conventions = [
    { prefix: "proj-…", reads: true, desc: "A specific project or school (e.g. proj-brown). The brain reads these." },
    { prefix: "team-…", reads: true, desc: "How a team works (team-sales, team-eng). The brain reads these." },
    { prefix: "space-…", reads: false, desc: "Social, community. Free zone — the brain doesn't read." },
    { prefix: "open-…", reads: false, desc: "Open discussions. Free zone." },
    { prefix: "topic-…", reads: false, desc: "Side topics. Free zone. (Including #topic-brain-context!)" },
    { prefix: "alerts-…", reads: false, desc: "Notifications and alerts. Free zone." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>9 · Slack conventions</SectionLabel>
      <SlideTitle title="Talk in public." subtitle="The brain learns from public channels — and so does our culture." />
      <div className="w-full max-w-4xl flex flex-col gap-3 mt-2">
        {conventions.map(({ prefix, reads, desc }) => (
          <div key={prefix} className="flex items-start gap-4 rounded-xl border px-5 py-4" style={{ borderColor: "var(--kinship-dim)", background: "white" }}>
            <code className="text-sm font-mono px-3 py-1 rounded-lg flex-shrink-0 w-28 text-center" style={{
              background: reads ? "oklch(93% 0.05 293)" : "oklch(95% 0.01 80)",
              color: reads ? "var(--kinship-mid)" : "oklch(55% 0.06 293)",
            }}>
              {prefix}
            </code>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0" style={{
              background: reads ? "oklch(93% 0.05 142)" : "oklch(94% 0.02 293)",
              color: reads ? "oklch(42% 0.15 142)" : "oklch(65% 0.04 293)",
            }}>
              {reads ? "● brain reads" : "free zone"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Slide 16 — Close + CTAs
function CloseSlide() {
  const actions = [
    { num: "01", action: "Turn on your daily debrief", detail: "In Claude Cowork. We'll help anyone after the meeting." },
    { num: "02", action: "Move work talk into public channels", detail: "proj- and team- channels. That's where the brain listens." },
    { num: "03", action: "Bring one automation idea", detail: "To #topic-brain-context. That's the roadmap." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 px-16 max-w-6xl mx-auto w-full" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>10 · Three things to do this week</SectionLabel>
      <div className="flex flex-col gap-5 w-full max-w-3xl">
        {actions.map(({ num, action, detail }) => (
          <DarkCard key={num} className="flex items-start gap-5">
            <span className="text-4xl font-mono flex-shrink-0" style={{ color: "oklch(35% 0.07 293)" }}>{num}</span>
            <div>
              <p className="text-lg font-semibold mb-1" style={{ color: "var(--kinship-cream)" }}>{action}</p>
              <p className="text-sm" style={{ color: "oklch(60% 0.05 293)" }}>{detail}</p>
            </div>
          </DarkCard>
        ))}
      </div>
    </div>
  );
}

// Slide 17 — Final framing (animated pipe filling with data)
function FinalSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl border" style={{ borderColor: "oklch(35% 0.08 293)", background: "oklch(25% 0.08 293)" }}>
        <Sparkles className="w-10 h-10" style={{ color: "var(--kinship-cream)" }} />
      </div>
      <SlideTitle
        dark
        title="I built the pipes."
        subtitle="You're the ones who know what should flow through them. Let's build it together."
      />
      <PipeFlowAnimation />
      <div className="mt-2 flex items-center gap-3 text-sm font-mono tracking-widest uppercase" style={{ color: "oklch(40% 0.06 293)" }}>
        <Star className="w-4 h-4" />
        <span>#topic-brain-context</span>
        <Star className="w-4 h-4" />
      </div>
    </div>
  );
}

// Slide 18 — FAQ
function FAQSlide() {
  const faqs = [
    { q: "Is the brain reading my DMs or private channels?", a: "No. Private channels and DMs are never read. Only public proj- and team- channels feed the brain." },
    { q: "Do I have to learn a new app?", a: "No. The brain connects tools you already use. The main new habit is talking in public channels." },
    { q: "What if the AI gets something wrong?", a: "Humans review and approve. Agents propose, they don't silently overwrite. The source transcript/email always wins on raw facts." },
    { q: "Will every meeting get recorded?", a: "No — we're selective. Right now it's external conversations transcribed via Zoom/Meet. We deliberately avoid capturing everything." },
    { q: "I'm not technical — is this for me?", a: "Especially for you. The point is to remove admin work, not add it. Start with the daily debrief." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>Appendix · Likely questions</SectionLabel>
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-xl border px-6 py-5" style={{ borderColor: "var(--kinship-dim)", background: "white" }}>
            <p className="font-semibold text-sm mb-2" style={{ color: "var(--kinship-ink)" }}>{q}</p>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  { id: "cover", component: <CoverSlide />, label: "Cover", dark: true },
  { id: "why", component: <WhySlide />, label: "Why we're here", dark: false },
  { id: "ask-1", component: <AskRoom1 />, label: "Ask the room", dark: true },
  { id: "tools", component: <ToolsSlide />, label: "Your tools", dark: false },
  { id: "skills", component: <SkillsSlide />, label: "Skills", dark: false },
  { id: "ask-2", component: <AskRoom2 />, label: "Ask the room", dark: true },
  { id: "connectors", component: <ConnectorsSlide />, label: "Connectors + tasks", dark: false },
  { id: "hermes", component: <HermesSlide />, label: "Hermes", dark: false },
  { id: "ask-3", component: <AskRoom3 />, label: "Ask the room", dark: true },
  { id: "context", component: <ContextSlide />, label: "Context engineering", dark: false },
  { id: "ask-4", component: <AskRoom4 />, label: "Ask the room", dark: true },
  { id: "capture", component: <CaptureSilde />, label: "How context is captured", dark: false },
  { id: "representations", component: <TwoRepresentationsSlide />, label: "Two lenses", dark: false },
  { id: "help", component: <HowYouHelpSlide />, label: "How you help", dark: false },
  { id: "ask-5", component: <AskRoom5 />, label: "Ask the room", dark: true },
  { id: "slack", component: <SlackSlide />, label: "Slack conventions", dark: false },
  { id: "close", component: <CloseSlide />, label: "Three actions", dark: true },
  { id: "final", component: <FinalSlide />, label: "Close", dark: true },
  { id: "faq", component: <FAQSlide />, label: "FAQ", dark: false },
];

// ─── Main Slideshow ───────────────────────────────────────────────────────────

export default function AllHandsPresentation() {
  const [[page, dir], setPage] = useState([0, 0]);
  const [showNav, setShowNav] = useState(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount; also restore saved slide position
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      setShowNav(true);
    }
    const saved = localStorage.getItem("kinship-allhands-slide");
    if (saved) setPage([parseInt(saved, 10), 0]);
  }, []);

  const go = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= SLIDES.length) return;
      const d = newPage > page ? 1 : -1;
      setPage([newPage, d]);
      localStorage.setItem("kinship-allhands-slide", String(newPage));
    },
    [page]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") go(page + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(page - 1);
      if (e.key === "Home") go(0);
      if (e.key === "End") go(SLIDES.length - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, page]);

  const handleMouseMove = useCallback(() => {
    setShowNav(true);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => setShowNav(false), 2000);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setShowNav(true);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => setShowNav(false), 2500);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) go(page + 1);
      else go(page - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [go, page]);

  const current = SLIDES[page];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, transition: { duration: 0.35, ease: EASE_IN } }),
  };

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background: current.dark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
    >
      {/* Slides */}
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={current.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: current.dark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
        >
          {current.component}
        </motion.div>
      </AnimatePresence>

      {/* Slide counter */}
      <div
        className="absolute top-6 right-8 text-xs font-mono tracking-widest"
        style={{ color: current.dark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
      >
        {page + 1} / {SLIDES.length}
      </div>

      {/* Slide title */}
      <div
        className="absolute top-6 left-8 text-xs font-mono tracking-widest"
        style={{ color: current.dark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
      >
        {current.label}
      </div>

      {/* Nav arrows — always visible on mobile, fade in/out on desktop hover */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 transition-opacity duration-200"
        style={{ opacity: isTouchDevice || showNav ? 1 : 0 }}
      >
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: current.dark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background: current.dark ? "oklch(25% 0.07 293)" : "white",
            color: current.dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === 0 ? 0.2 : 0.8,
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dot indicator */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all rounded-full"
              style={{
                width: i === page ? 20 : 6,
                height: 6,
                background: i === page
                  ? (current.dark ? "var(--kinship-cream)" : "var(--kinship-mid)")
                  : (current.dark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)"),
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === SLIDES.length - 1}
          className="p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: current.dark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background: current.dark ? "oklch(25% 0.07 293)" : "white",
            color: current.dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === SLIDES.length - 1 ? 0.2 : 0.8,
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
