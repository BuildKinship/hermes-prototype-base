"use client";
// slide deck — keyboard nav, touch swipe, animated SVGs, mobile-first layout

import React, { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  Brain, Zap, Users, Calendar, MessageSquare, Database, GitBranch, Clock,
  ChevronLeft, ChevronRight, Sparkles, ArrowRight, BookOpen, Mic, Star,
  CheckCircle2, Layers, Network, FileText, TrendingUp, Package,
} from "lucide-react";

// ─── Motion constants ──────────────────────────────────────────────────────────
const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];
const EASE_IN  = [0.55, 0, 1, 0.45] as unknown as Transition["ease"];

// ─── Looping SVG Animations ────────────────────────────────────────────────────

function CoverBrainAnimation() {
  return (
    <svg width="180" height="180" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "clamp(120px,40vw,180px)", height: "auto" }}>
      <style>{`
        @keyframes orbit1 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbit2 { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes pulse-ring { 0%,100%{opacity:0.15;r:52} 50%{opacity:0.35;r:58} }
        .orbit1{transform-origin:110px 110px;animation:orbit1 8s linear infinite;}
        .orbit2{transform-origin:110px 110px;animation:orbit2 12s linear infinite;}
        .pulse-ring{transform-origin:110px 110px;animation:pulse-ring 3s ease-in-out infinite;}
      `}</style>
      <circle className="pulse-ring" cx="110" cy="110" r="52" stroke="oklch(60% 0.08 293)" strokeWidth="1.5" fill="none"/>
      <g className="orbit1">
        <circle cx="110" cy="42" r="5" fill="oklch(75% 0.12 293)" opacity="0.9"/>
        <circle cx="162" cy="141" r="4" fill="oklch(65% 0.10 293)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="58" cy="141" r="3.5" fill="oklch(55% 0.08 293)" opacity="0.5"/>
      </g>
      <g className="orbit2">
        <circle cx="110" cy="30" r="3" fill="oklch(70% 0.08 240)" opacity="0.6"/>
        <circle cx="190" cy="110" r="4" fill="oklch(60% 0.10 220)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>
      <rect x="82" y="82" width="56" height="56" rx="16" fill="oklch(25% 0.08 293)" stroke="oklch(40% 0.08 293)" strokeWidth="1.5"/>
    </svg>
  );
}

function ContextLossAnimation() {
  return (
    <svg width="340" height="160" viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,340px)", height: "auto" }}>
      <style>{`
        @keyframes scatter1{0%,100%{transform:translate(0,0) rotate(0deg);opacity:1}40%{transform:translate(-55px,-28px) rotate(-18deg);opacity:0.4}60%{transform:translate(-55px,-28px) rotate(-18deg);opacity:0.4}90%{transform:translate(0,0) rotate(0deg);opacity:1}}
        @keyframes scatter2{0%,100%{transform:translate(0,0) rotate(0deg);opacity:1}40%{transform:translate(55px,-24px) rotate(14deg);opacity:0.4}60%{transform:translate(55px,-24px) rotate(14deg);opacity:0.4}90%{transform:translate(0,0) rotate(0deg);opacity:1}}
        @keyframes scatter3{0%,100%{transform:translate(0,0) rotate(0deg);opacity:1}40%{transform:translate(-30px,40px) rotate(22deg);opacity:0.4}60%{transform:translate(-30px,40px) rotate(22deg);opacity:0.4}90%{transform:translate(0,0) rotate(0deg);opacity:1}}
        @keyframes scatter4{0%,100%{transform:translate(0,0) rotate(0deg);opacity:1}40%{transform:translate(50px,36px) rotate(-16deg);opacity:0.4}60%{transform:translate(50px,36px) rotate(-16deg);opacity:0.4}90%{transform:translate(0,0) rotate(0deg);opacity:1}}
        @keyframes arrow-pulse{0%,100%{opacity:0.3}50%{opacity:0.85}}
        @keyframes hub-glow{0%,100%{fill:oklch(22% 0.08 293)}50%{fill:oklch(30% 0.12 293)}}
        .doc1{transform-origin:110px 80px;animation:scatter1 4s ease-in-out infinite;}
        .doc2{transform-origin:230px 80px;animation:scatter2 4s ease-in-out infinite 0.3s;}
        .doc3{transform-origin:110px 80px;animation:scatter3 4s ease-in-out infinite 0.6s;}
        .doc4{transform-origin:230px 80px;animation:scatter4 4s ease-in-out infinite 0.9s;}
        .hub-rect{animation:hub-glow 3s ease-in-out infinite;}
        .arrow-l{animation:arrow-pulse 2s ease-in-out infinite;}
        .arrow-r{animation:arrow-pulse 2s ease-in-out infinite 0.5s;}
      `}</style>
      <text x="55" y="14" fontSize="9" fill="oklch(55% 0.06 293)" fontFamily="monospace" textAnchor="middle" letterSpacing="1">SCATTERED</text>
      <g className="doc1"><rect x="30" y="30" width="36" height="44" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><line x1="37" y1="42" x2="59" y2="42" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="37" y1="50" x2="55" y2="50" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="37" y1="58" x2="52" y2="58" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/></g>
      <g className="doc2"><rect x="90" y="24" width="32" height="40" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><line x1="97" y1="36" x2="115" y2="36" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="97" y1="44" x2="113" y2="44" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="97" y1="52" x2="110" y2="52" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/></g>
      <g className="doc3"><rect x="35" y="82" width="30" height="38" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><line x1="41" y1="93" x2="59" y2="93" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="41" y1="101" x2="57" y2="101" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="41" y1="109" x2="54" y2="109" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/></g>
      <g className="doc4"><rect x="88" y="78" width="34" height="42" rx="4" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><line x1="95" y1="90" x2="115" y2="90" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="95" y1="98" x2="113" y2="98" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/><line x1="95" y1="106" x2="109" y2="106" stroke="oklch(80% 0.04 293)" strokeWidth="1.5"/></g>
      <text x="48" y="148" fontSize="8" fill="oklch(65% 0.05 293)" fontFamily="monospace" textAnchor="middle">inbox</text>
      <text x="105" y="148" fontSize="8" fill="oklch(65% 0.05 293)" fontFamily="monospace" textAnchor="middle">someone&apos;s head</text>
      <g className="arrow-l"><path d="M 148 80 L 164 80" stroke="var(--kinship-mid)" strokeWidth="2" strokeDasharray="4 3"/><path d="M 161 76 L 165 80 L 161 84" stroke="var(--kinship-mid)" strokeWidth="1.5" fill="none"/></g>
      <g className="arrow-r"><path d="M 176 80 L 192 80" stroke="var(--kinship-mid)" strokeWidth="2" strokeDasharray="4 3"/><path d="M 189 76 L 193 80 L 189 84" stroke="var(--kinship-mid)" strokeWidth="1.5" fill="none"/></g>
      <text x="170" y="14" fontSize="9" fill="var(--kinship-mid)" fontFamily="monospace" textAnchor="middle" letterSpacing="1">ONE PLACE</text>
      <rect className="hub-rect" x="148" y="52" width="44" height="56" rx="10" fill="oklch(22% 0.08 293)" stroke="oklch(40% 0.10 293)" strokeWidth="1.5"/>
      <text x="170" y="85" fontSize="22" textAnchor="middle" fill="var(--kinship-cream)">⬡</text>
      <text x="265" y="14" fontSize="9" fill="oklch(55% 0.06 293)" fontFamily="monospace" textAnchor="middle" letterSpacing="1">CONNECTED</text>
      <circle cx="225" cy="55" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><text x="225" y="60" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">📄</text>
      <circle cx="280" cy="45" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><text x="280" y="50" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">📅</text>
      <circle cx="305" cy="90" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><text x="305" y="95" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">💬</text>
      <circle cx="240" cy="112" r="14" fill="white" stroke="oklch(75% 0.05 293)" strokeWidth="1.5"/><text x="240" y="117" fontSize="11" textAnchor="middle" fill="var(--kinship-mid)">🏫</text>
      <line x1="239" y1="55" x2="266" y2="49" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="280" y1="59" x2="298" y2="77" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="225" y1="69" x2="232" y2="98" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="254" y1="112" x2="291" y2="97" stroke="var(--kinship-dim)" strokeWidth="1" strokeDasharray="3 3"/>
      <circle r="3" fill="var(--kinship-mid)" opacity="0.8"><animateMotion dur="2.4s" repeatCount="indefinite" begin="0s"><mpath xlinkHref="#path-a"/></animateMotion></circle>
      <path id="path-a" d="M 239 55 L 266 49" fill="none"/>
      <circle r="2.5" fill="var(--kinship-mid)" opacity="0.7"><animateMotion dur="2.8s" repeatCount="indefinite" begin="0.6s"><mpath xlinkHref="#path-b"/></animateMotion></circle>
      <path id="path-b" d="M 280 59 L 298 77" fill="none"/>
      <circle r="2.5" fill="var(--kinship-mid)" opacity="0.7"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.2s"><mpath xlinkHref="#path-c"/></animateMotion></circle>
      <path id="path-c" d="M 225 69 L 232 98" fill="none"/>
      <circle r="3" fill="var(--kinship-mid)" opacity="0.8"><animateMotion dur="3.0s" repeatCount="indefinite" begin="0.9s"><mpath xlinkHref="#path-d"/></animateMotion></circle>
      <path id="path-d" d="M 254 112 L 291 97" fill="none"/>
    </svg>
  );
}

function ToolsNetworkAnimation() {
  const cx = 200, cy = 130;
  const spokes = [
    { x: 200, y: 20,  label: "Notion" },
    { x: 350, y: 70,  label: "Google" },
    { x: 370, y: 190, label: "Slack" },
    { x: 200, y: 240, label: "Zoom" },
    { x: 30,  y: 190, label: "Hermes" },
    { x: 50,  y: 70,  label: "GWorkspace" },
  ];
  return (
    <svg width="400" height="264" viewBox="0 0 400 264" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,400px)", height: "auto" }}>
      <style>{`
        @keyframes hub-pulse2{0%,100%{r:34;opacity:1}50%{r:37;opacity:0.85}}
        .hub-outer2{transform-origin:200px 130px;animation:hub-pulse2 3s ease-in-out infinite;}
      `}</style>
      {spokes.map((t, i) => (<line key={i} x1={cx} y1={cy} x2={t.x} y2={t.y} stroke="oklch(70% 0.08 293)" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.45"/>))}
      {spokes.map((t, i) => (
        <g key={`p${i}`}>
          <circle r="3.5" fill="var(--kinship-mid)" opacity="0.9">
            <animateMotion dur={`${1.8 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.45}s`}><mpath xlinkHref={`#spoke2-${i}`}/></animateMotion>
          </circle>
          <path id={`spoke2-${i}`} d={`M ${cx} ${cy} L ${t.x} ${t.y}`} fill="none"/>
        </g>
      ))}
      {/* Notion */}
      <g transform="translate(175,0)">
        <circle cx="25" cy="20" r="22" fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
        <image href="/logos/notion.png" x="8" y="3" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>
        <text x="25" y="46" fontSize="8" textAnchor="middle" fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Notion</text>
      </g>
      {/* Google */}
      <g transform="translate(326,50)">
        <circle cx="24" cy="20" r="22" fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
        <image href="/logos/google.webp" x="7" y="3" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>
        <text x="24" y="46" fontSize="8" textAnchor="middle" fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Google</text>
      </g>
      {/* Slack */}
      <g transform="translate(348,168)">
        <circle cx="22" cy="22" r="22" fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
        <image href="/logos/slack.png" x="5" y="5" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>
        <text x="22" y="48" fontSize="8" textAnchor="middle" fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Slack</text>
      </g>
      {/* Zoom */}
      <g transform="translate(175,218)">
        <circle cx="25" cy="22" r="22" fill="#2D8CFF" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
        <image href="/logos/zoom.webp" x="6" y="4" width="38" height="38" preserveAspectRatio="xMidYMid meet"/>
        <text x="25" y="48" fontSize="8" textAnchor="middle" fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Zoom</text>
      </g>
      {/* Hermes */}
      <g transform="translate(6,168)"><circle cx="24" cy="22" r="22" fill="oklch(22% 0.08 293)" stroke="oklch(40% 0.08 293)" strokeWidth="1.5"/><text x="24" y="29" fontSize="18" textAnchor="middle" fill="var(--kinship-cream)">⚡</text><text x="24" y="48" fontSize="8" textAnchor="middle" fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Hermes</text></g>
      {/* GWorkspace */}
      <g transform="translate(26,50)">
        <circle cx="24" cy="20" r="22" fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
        <image href="/logos/google-workspace.webp" x="7" y="3" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>
        <text x="24" y="46" fontSize="7" textAnchor="middle" fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">GWorkspace</text>
      </g>
      {/* Center hub: Claude */}
      <circle className="hub-outer2" cx={cx} cy={cy} r="34" fill="oklch(16% 0.07 293)" stroke="var(--kinship-mid)" strokeWidth="2"/>
      <path d={`M${cx-10} ${cy+12} L${cx} ${cy-14} L${cx+10} ${cy+12}`} stroke="oklch(88% 0.05 293)" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      <line x1={cx-5} y1={cy+4} x2={cx+5} y2={cy+4} stroke="oklch(88% 0.05 293)" strokeWidth="2.2"/>
      <text x={cx} y={cy+26} fontSize="8" textAnchor="middle" fill="oklch(60% 0.05 293)" fontFamily="system-ui">Claude</text>
    </svg>
  );
}

function ContextFlowAnimation() {
  return (
    <svg width="420" height="120" viewBox="0 0 420 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,420px)", height: "auto" }}>
      <style>{`@keyframes box-live{0%,100%{opacity:1}50%{opacity:0.75}}.box-live{animation:box-live 2.5s ease-in-out infinite;}`}</style>
      <rect x="10" y="30" width="110" height="60" rx="10" fill="white" stroke="oklch(60% 0.17 142)" strokeWidth="2"/>
      <text x="65" y="58" fontSize="10" textAnchor="middle" fill="oklch(40% 0.15 142)" fontFamily="monospace" fontWeight="600">CUSTOMER</text>
      <text x="65" y="72" fontSize="9" textAnchor="middle" fill="oklch(55% 0.12 142)" fontFamily="monospace">CONTEXT</text>
      <circle cx="65" cy="86" r="4" fill="oklch(70% 0.17 142)" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/></circle>
      <path d="M 122 60 L 148 60" stroke="oklch(60% 0.17 142)" strokeWidth="1.5" strokeDasharray="5 3"/>
      <path d="M 145 56 L 149 60 L 145 64" stroke="oklch(60% 0.17 142)" strokeWidth="1.5" fill="none"/>
      <circle r="3" fill="oklch(60% 0.17 142)" opacity="0.8"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath xlinkHref="#flow-1"/></animateMotion></circle>
      <path id="flow-1" d="M 122 60 L 148 60" fill="none"/>
      <rect className="box-live" x="152" y="20" width="116" height="80" rx="10" fill="oklch(25% 0.09 293)" stroke="var(--kinship-mid)" strokeWidth="2.5"/>
      <text x="210" y="52" fontSize="10" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="monospace" fontWeight="700">OPERATIONS</text>
      <text x="210" y="66" fontSize="9" textAnchor="middle" fill="oklch(70% 0.05 293)" fontFamily="monospace">CONTEXT</text>
      <text x="210" y="84" fontSize="8" textAnchor="middle" fill="var(--kinship-mid)" fontFamily="monospace">● LIVE TODAY</text>
      <path d="M 270 60 L 296 60" stroke="var(--kinship-mid)" strokeWidth="1.5" strokeDasharray="5 3"/>
      <path d="M 293 56 L 297 60 L 293 64" stroke="var(--kinship-mid)" strokeWidth="1.5" fill="none"/>
      <circle r="3" fill="var(--kinship-mid)" opacity="0.9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.4s"><mpath xlinkHref="#flow-2"/></animateMotion></circle>
      <path id="flow-2" d="M 270 60 L 296 60" fill="none"/>
      <rect x="300" y="30" width="110" height="60" rx="10" fill="white" stroke="oklch(62% 0.21 27)" strokeWidth="2"/>
      <text x="355" y="58" fontSize="10" textAnchor="middle" fill="oklch(48% 0.18 27)" fontFamily="monospace" fontWeight="600">PRODUCT</text>
      <text x="355" y="72" fontSize="9" textAnchor="middle" fill="oklch(58% 0.15 27)" fontFamily="monospace">CONTEXT</text>
      <text x="355" y="86" fontSize="8" textAnchor="middle" fill="oklch(65% 0.10 27)" fontFamily="monospace">near-term</text>
    </svg>
  );
}

function CaptureFlowAnimation() {
  return (
    <svg width="460" height="170" viewBox="0 0 460 170" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,460px)", height: "auto" }}>
      <style>{`
        @keyframes line-appear{0%,100%{scaleX:0;opacity:0}20%{scaleX:1;opacity:1}75%{scaleX:1;opacity:1}95%{opacity:0}}
        @keyframes brain-pulse{0%,100%{fill:oklch(25% 0.08 293)}50%{fill:oklch(32% 0.12 293)}}
        .tline1{transform-origin:30px 45px;animation:line-appear 3.5s ease-in-out infinite;}
        .tline2{transform-origin:30px 55px;animation:line-appear 3.5s ease-in-out infinite 0.4s;}
        .tline3{transform-origin:30px 65px;animation:line-appear 3.5s ease-in-out infinite 0.8s;}
        .tline4{transform-origin:30px 95px;animation:line-appear 3.5s ease-in-out infinite 1.2s;}
        .tline5{transform-origin:30px 105px;animation:line-appear 3.5s ease-in-out infinite 1.6s;}
        .tline6{transform-origin:30px 115px;animation:line-appear 3.5s ease-in-out infinite 2.0s;}
        .brain-bg{animation:brain-pulse 2.5s ease-in-out infinite;}
      `}</style>
      <rect x="10" y="20" width="100" height="125" rx="8" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.5"/>
      <text x="60" y="42" fontSize="9" textAnchor="middle" fill="oklch(55% 0.06 293)" fontFamily="monospace" letterSpacing="1">TRANSCRIPT</text>
      <g className="tline1"><rect x="18" y="50" width="76" height="7" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline2"><rect x="18" y="62" width="60" height="7" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline3"><rect x="18" y="74" width="70" height="7" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline4"><rect x="18" y="100" width="72" height="7" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline5"><rect x="18" y="112" width="54" height="7" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <g className="tline6"><rect x="18" y="124" width="64" height="7" rx="2" fill="oklch(85% 0.04 293)"/></g>
      <path d="M 114 82 Q 175 82 218 82" stroke="var(--kinship-mid)" strokeWidth="2" strokeDasharray="6 4" fill="none"/>
      <path d="M 215 78 L 219 82 L 215 86" stroke="var(--kinship-mid)" strokeWidth="2" fill="none"/>
      {[0, 0.8, 1.6].map((delay, i) => (
        <circle key={i} r="4" fill="var(--kinship-mid)" opacity="0.85">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin={`${delay}s`}><mpath xlinkHref="#capture-path2"/></animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.2s" repeatCount="indefinite" begin={`${delay}s`}/>
        </circle>
      ))}
      <path id="capture-path2" d="M 114 82 Q 175 82 218 82" fill="none"/>
      <circle className="brain-bg" cx="264" cy="82" r="46" fill="oklch(25% 0.08 293)" stroke="var(--kinship-mid)" strokeWidth="2"/>
      <text x="264" y="92" fontSize="32" textAnchor="middle" fill="var(--kinship-cream)">⬡</text>
      <path d="M 310 62 Q 348 44 376 44" stroke="oklch(60% 0.10 293)" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
      <path d="M 310 102 Q 348 120 376 120" stroke="oklch(60% 0.10 293)" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
      <circle r="3" fill="oklch(75% 0.08 293)" opacity="0.8"><animateMotion dur="2s" repeatCount="indefinite" begin="1s"><mpath xlinkHref="#out-path-1b"/></animateMotion></circle>
      <path id="out-path-1b" d="M 310 62 Q 348 44 376 44" fill="none"/>
      <circle r="3" fill="oklch(75% 0.08 293)" opacity="0.8"><animateMotion dur="2s" repeatCount="indefinite" begin="1.6s"><mpath xlinkHref="#out-path-2b"/></animateMotion></circle>
      <path id="out-path-2b" d="M 310 102 Q 348 120 376 120" fill="none"/>
      <rect x="375" y="28" width="50" height="32" rx="5" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.2"/>
      <text x="400" y="48" fontSize="9" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">Notion</text>
      <rect x="375" y="104" width="42" height="32" rx="5" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.2"/>
      <text x="396" y="124" fontSize="9" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">Wiki</text>
    </svg>
  );
}

function HermesChatAnimation() {
  return (
    <svg width="420" height="300" viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,420px)", height: "auto" }}>
      <style>{`
        @keyframes msg-in-a{0%,10%{transform:translateY(16px);opacity:0}25%,78%{transform:translateY(0);opacity:1}92%,100%{opacity:0.7}}
        @keyframes msg-in-b{0%,32%{transform:translateY(16px);opacity:0}47%,78%{transform:translateY(0);opacity:1}92%,100%{opacity:0.7}}
        @keyframes msg-in-c{0%,54%{transform:translateY(16px);opacity:0}69%,78%{transform:translateY(0);opacity:1}92%,100%{opacity:0.7}}
        @keyframes typing-dot{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}
        .hmsg1{animation:msg-in-a 6s ease-out infinite;}
        .hmsg2{animation:msg-in-b 6s ease-out infinite;}
        .hmsg3{animation:msg-in-c 6s ease-out infinite;}
        .htd1{animation:typing-dot 1.2s ease-in-out infinite 0s;}
        .htd2{animation:typing-dot 1.2s ease-in-out infinite 0.22s;}
        .htd3{animation:typing-dot 1.2s ease-in-out infinite 0.44s;}
      `}</style>
      <rect x="8" y="8" width="404" height="284" rx="16" fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      <rect x="8" y="8" width="404" height="46" rx="16" fill="oklch(96% 0.01 293)"/>
      <rect x="8" y="36" width="404" height="18" fill="oklch(96% 0.01 293)"/>
      <circle cx="34" cy="31" r="12" fill="oklch(22% 0.09 293)"/>
      <text x="34" y="36" fontSize="12" textAnchor="middle" fill="var(--kinship-cream)">⚡</text>
      <text x="54" y="36" fontSize="14" fontWeight="700" fill="oklch(25% 0.06 293)" fontFamily="system-ui">Hermes</text>
      <circle cx="332" cy="31" r="6" fill="oklch(60% 0.17 142)"/>
      <text x="344" y="36" fontSize="11" fill="oklch(50% 0.12 142)" fontFamily="monospace">online</text>
      <g className="hmsg1"><rect x="22" y="68" width="280" height="48" rx="12" fill="oklch(22% 0.09 293)"/><text x="40" y="88" fontSize="13" fill="var(--kinship-cream)" fontFamily="system-ui">✅ Zoom recap filed to Notion</text><text x="40" y="106" fontSize="11" fill="oklch(65% 0.05 293)" fontFamily="system-ui">Maple Ridge — follow-up logged</text></g>
      <g className="hmsg2"><rect x="22" y="130" width="240" height="48" rx="12" fill="oklch(22% 0.09 293)"/><text x="40" y="150" fontSize="13" fill="var(--kinship-cream)" fontFamily="system-ui">📅 Zoom call created</text><text x="40" y="168" fontSize="11" fill="oklch(65% 0.05 293)" fontFamily="system-ui">Thu 2pm · link in calendar</text></g>
      <g className="hmsg3"><rect x="22" y="192" width="300" height="48" rx="12" fill="oklch(22% 0.09 293)"/><text x="40" y="212" fontSize="13" fill="var(--kinship-cream)" fontFamily="system-ui">🔬 Research brief ready</text><text x="40" y="230" fontSize="11" fill="oklch(65% 0.05 293)" fontFamily="system-ui">3 competitors · sent to #team-sales</text></g>
      <rect x="22" y="252" width="68" height="30" rx="15" fill="oklch(92% 0.02 293)"/>
      <circle className="htd1" cx="38" cy="267" r="4" fill="oklch(58% 0.06 293)"/>
      <circle className="htd2" cx="52" cy="267" r="4" fill="oklch(58% 0.06 293)"/>
      <circle className="htd3" cx="66" cy="267" r="4" fill="oklch(58% 0.06 293)"/>
    </svg>
  );
}

function AutomationFlowAnimation({ index }: { index: number }) {
  const configs = [
    { color: "oklch(60% 0.17 142)", steps: ["📝 Notion Transcript", "→ Shared DB", "⬡ Hermes learns overnight"] },
    { color: "oklch(62% 0.21 27)",  steps: ["🧾 Pilot Expense", "→ Tracker", "📊 Real-time Dashboard"] },
    { color: "var(--kinship-mid)",  steps: ["💬 Field Feedback", "→ Product Signal", "📦 Client Artifact"] },
  ];
  const cfg = configs[index];
  return (
    <svg width="240" height="70" viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,240px)", height: "auto" }}>
      <style>{`
        @keyframes step-appear-${index}{0%,100%{opacity:0.3}33%{opacity:1}}
        .sA${index}{animation:step-appear-${index} 3s ease-in-out infinite 0s;}
        .sB${index}{animation:step-appear-${index} 3s ease-in-out infinite 1s;}
        .sC${index}{animation:step-appear-${index} 3s ease-in-out infinite 2s;}
      `}</style>
      <g className={`sA${index}`}><rect x="2" y="20" width="64" height="30" rx="8" fill="white" stroke={cfg.color} strokeWidth="1.5"/><text x="34" y="39" fontSize="9" textAnchor="middle" fill="oklch(40% 0.06 293)" fontFamily="system-ui">{cfg.steps[0]}</text></g>
      <path d="M 68 35 L 88 35" stroke={cfg.color} strokeWidth="1.5" strokeDasharray="5 3"/>
      <path d="M 85 31 L 89 35 L 85 39" stroke={cfg.color} strokeWidth="1.5" fill="none"/>
      <circle r="3" fill={cfg.color} opacity="0.9"><animateMotion dur="1.6s" repeatCount="indefinite" begin="0.2s"><mpath xlinkHref={`#auto-arr-${index}`}/></animateMotion></circle>
      <path id={`auto-arr-${index}`} d="M 68 35 L 88 35" fill="none"/>
      <g className={`sB${index}`}><rect x="90" y="20" width="60" height="30" rx="8" fill="white" stroke={cfg.color} strokeWidth="1.5"/><text x="120" y="39" fontSize="9" textAnchor="middle" fill="oklch(40% 0.06 293)" fontFamily="system-ui">{cfg.steps[1]}</text></g>
      <path d="M 152 35 L 172 35" stroke={cfg.color} strokeWidth="1.5" strokeDasharray="5 3"/>
      <path d="M 169 31 L 173 35 L 169 39" stroke={cfg.color} strokeWidth="1.5" fill="none"/>
      <circle r="3" fill={cfg.color} opacity="0.9"><animateMotion dur="1.6s" repeatCount="indefinite" begin="0.8s"><mpath xlinkHref={`#auto-arr2-${index}`}/></animateMotion></circle>
      <path id={`auto-arr2-${index}`} d="M 152 35 L 172 35" fill="none"/>
      <g className={`sC${index}`}><rect x="175" y="12" width="62" height="46" rx="8" fill={cfg.color} opacity="0.92"/><text x="206" y="36" fontSize="9" textAnchor="middle" fill="white" fontFamily="system-ui" fontWeight="600">{cfg.steps[2]}</text></g>
    </svg>
  );
}

function TwoLensAnimation() {
  return (
    <svg width="560" height="170" viewBox="0 0 560 170" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,560px)", height: "auto" }}>
      <style>{`
        @keyframes row-scan2{0%,100%{fill:white}50%{fill:oklch(93% 0.04 293)}}
        @keyframes node-pop2{0%,100%{r:9;opacity:0.7}50%{r:11;opacity:1}}
        .row2-1{animation:row-scan2 3.2s ease-in-out infinite 0s;}
        .row2-2{animation:row-scan2 3.2s ease-in-out infinite 0.5s;}
        .row2-3{animation:row-scan2 3.2s ease-in-out infinite 1s;}
        .row2-4{animation:row-scan2 3.2s ease-in-out infinite 1.5s;}
        .row2-5{animation:row-scan2 3.2s ease-in-out infinite 2s;}
        .gn1{animation:node-pop2 2.4s ease-in-out infinite 0s;}
        .gn2{animation:node-pop2 2.4s ease-in-out infinite 0.55s;}
        .gn3{animation:node-pop2 2.4s ease-in-out infinite 1.1s;}
        .gn4{animation:node-pop2 2.4s ease-in-out infinite 1.65s;}
        .gn5{animation:node-pop2 2.4s ease-in-out infinite 2.2s;}
      `}</style>
      <rect x="8" y="8" width="250" height="155" rx="10" fill="white" stroke="oklch(80% 0.05 293)" strokeWidth="1.5"/>
      <rect x="8" y="8" width="250" height="28" rx="10" fill="oklch(93% 0.03 293)"/><rect x="8" y="28" width="250" height="8" fill="oklch(93% 0.03 293)"/>
      <text x="36" y="27" fontSize="9" fontWeight="700" fill="oklch(40% 0.06 293)" fontFamily="monospace">NAME</text>
      <text x="120" y="27" fontSize="9" fontWeight="700" fill="oklch(40% 0.06 293)" fontFamily="monospace">TYPE</text>
      <text x="188" y="27" fontSize="9" fontWeight="700" fill="oklch(40% 0.06 293)" fontFamily="monospace">STATUS</text>
      {[
        { name: "Maple Ridge SD", type: "School",  color: "oklch(60% 0.17 142)" },
        { name: "Sarah Chen",     type: "Contact", color: "oklch(75% 0.12 293)" },
        { name: "Q4 Pilot — Brown", type: "Deal",  color: "oklch(62% 0.21 27)" },
        { name: "Mar 12 intro call", type: "Meeting", color: "oklch(60% 0.08 220)" },
        { name: "Classroom widget bug", type: "Ticket", color: "oklch(62% 0.21 27)" },
      ].map(({ name, type, color }, i) => {
        const cls = `row2-${i + 1}`;
        const y = 36 + i * 24;
        return (
          <g key={name}>
            <g className={cls}><rect x="9" y={y} width="248" height="22" fill="white"/></g>
            <text x="36" y={y+15} fontSize="8" fill="oklch(40% 0.06 293)" fontFamily="monospace">{name}</text>
            <text x="120" y={y+15} fontSize="8" fill="oklch(55% 0.06 293)" fontFamily="monospace">{type}</text>
            <circle cx="200" cy={y+11} r="5" fill={color}/>
            {i < 4 && <line x1="9" y1={y+22} x2="257" y2={y+22} stroke="oklch(90% 0.02 293)" strokeWidth="1"/>}
          </g>
        );
      })}
      <text x="133" y="162" fontSize="8" textAnchor="middle" fill="oklch(55% 0.06 293)" fontFamily="monospace" letterSpacing="1">FOR HUMANS — you browse, filter, edit</text>
      <line x1="272" y1="8" x2="272" y2="162" stroke="oklch(85% 0.03 293)" strokeWidth="1" strokeDasharray="4 3"/>
      <text x="272" y="90" fontSize="22" textAnchor="middle" fill="oklch(72% 0.04 293)">↔</text>
      <circle className="gn1" cx="340" cy="50"  r="9" fill="oklch(22% 0.09 293)" stroke="var(--kinship-mid)" strokeWidth="1.5"/><text x="340" y="54" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">S</text><text x="340" y="38" fontSize="7" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">school</text>
      <circle className="gn2" cx="430" cy="36"  r="9" fill="oklch(22% 0.09 293)" stroke="oklch(60% 0.17 142)" strokeWidth="1.5"/><text x="430" y="40" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">P</text><text x="430" y="24" fontSize="7" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">person</text>
      <circle className="gn3" cx="512" cy="80"  r="9" fill="oklch(22% 0.09 293)" stroke="oklch(62% 0.21 27)" strokeWidth="1.5"/><text x="512" y="84" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">D</text><text x="530" y="82" fontSize="7" fill="oklch(50% 0.06 293)" fontFamily="monospace">deal</text>
      <circle className="gn4" cx="390" cy="130" r="9" fill="oklch(22% 0.09 293)" stroke="oklch(60% 0.08 220)" strokeWidth="1.5"/><text x="390" y="134" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">M</text><text x="390" y="148" fontSize="7" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">meeting</text>
      <circle className="gn5" cx="500" cy="140" r="9" fill="oklch(22% 0.09 293)" stroke="oklch(70% 0.15 60)" strokeWidth="1.5"/><text x="500" y="144" fontSize="8" textAnchor="middle" fill="var(--kinship-cream)">T</text><text x="500" y="158" fontSize="7" textAnchor="middle" fill="oklch(50% 0.06 293)" fontFamily="monospace">ticket</text>
      <line x1="349" y1="50" x2="421" y2="39" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="430" y1="45" x2="509" y2="72" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="340" y1="59" x2="384" y2="121" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="399" y1="130" x2="491" y2="138" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="510" y1="89" x2="506" y2="131" stroke="oklch(70% 0.06 293)" strokeWidth="1" strokeDasharray="3 2"/>
      <text x="382" y="37" fontSize="7" fill="oklch(60% 0.08 293)" fontFamily="monospace">knows</text>
      <text x="476" y="60" fontSize="7" fill="oklch(60% 0.08 293)" fontFamily="monospace">has deal</text>
      <text x="344" y="93" fontSize="7" fill="oklch(60% 0.08 293)" fontFamily="monospace">hosted</text>
      <text x="438" y="130" fontSize="7" fill="oklch(60% 0.08 293)" fontFamily="monospace">led to</text>
      <circle r="4" fill="var(--kinship-mid)" opacity="0.9"><animateMotion dur="5s" repeatCount="indefinite" begin="0s"><mpath xlinkHref="#graph-path2"/></animateMotion><animate attributeName="opacity" values="0;1;1;1;1;0" dur="5s" repeatCount="indefinite"/></circle>
      <path id="graph-path2" d="M 340 50 L 430 36 L 512 80 L 500 140 L 390 130 L 340 50" fill="none"/>
      <text x="420" y="162" fontSize="8" textAnchor="middle" fill="oklch(55% 0.06 293)" fontFamily="monospace" letterSpacing="1">FOR AI — Hermes navigates relationships</text>
    </svg>
  );
}

function SignalAnimation() {
  return (
    <svg width="480" height="130" viewBox="0 0 480 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,480px)", height: "auto" }}>
      <style>{`
        @keyframes bubble-rise-big{0%{transform:translateY(36px);opacity:0}18%,72%{transform:translateY(0);opacity:1}92%,100%{transform:translateY(-24px);opacity:0}}
        @keyframes bubble-rise-big2{0%,28%{transform:translateY(36px);opacity:0}46%,72%{transform:translateY(0);opacity:1}92%,100%{transform:translateY(-24px);opacity:0}}
        @keyframes bubble-rise-big3{0%,52%{transform:translateY(36px);opacity:0}70%,80%{transform:translateY(0);opacity:1}92%,100%{transform:translateY(-24px);opacity:0}}
        .bb1{animation:bubble-rise-big 5s ease-in-out infinite;}
        .bb2{animation:bubble-rise-big2 5s ease-in-out infinite;}
        .bb3{animation:bubble-rise-big3 5s ease-in-out infinite;}
      `}</style>
      <text x="240" y="120" fontSize="9" textAnchor="middle" fill="oklch(60% 0.06 293)" fontFamily="monospace" letterSpacing="2">IDEAS SURFACE → AUTOMATIONS GET BUILT</text>
      <g className="bb1"><rect x="10" y="44" width="136" height="52" rx="12" fill="oklch(22% 0.09 293)"/><path d="M 22 96 L 14 114 L 40 96" fill="oklch(22% 0.09 293)"/><text x="78" y="66" fontSize="11" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="system-ui">💡 I wish this just</text><text x="78" y="84" fontSize="11" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="system-ui">captured itself…</text></g>
      <g className="bb2"><rect x="170" y="28" width="140" height="52" rx="12" fill="var(--kinship-mid)"/><path d="M 182 80 L 174 98 L 200 80" fill="var(--kinship-mid)"/><text x="240" y="50" fontSize="11" textAnchor="middle" fill="white" fontFamily="system-ui">✅ Auto-captured!</text><text x="240" y="68" fontSize="11" textAnchor="middle" fill="white" fontFamily="system-ui">→ brain updated</text></g>
      <g className="bb3"><rect x="330" y="44" width="142" height="52" rx="12" fill="oklch(22% 0.09 293)"/><path d="M 342 96 L 334 114 L 360 96" fill="oklch(22% 0.09 293)"/><text x="401" y="66" fontSize="11" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="system-ui">📣 Post in</text><text x="401" y="84" fontSize="11" textAnchor="middle" fill="var(--kinship-cream)" fontFamily="system-ui">#brain-context</text></g>
    </svg>
  );
}

function PipeFlowAnimation() {
  return (
    <svg width="280" height="60" viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "min(100%,280px)", height: "auto" }}>
      <style>{`@keyframes pipe-glow2{0%,100%{opacity:0.4}70%{opacity:0.9}}.pipe-glow2{animation:pipe-glow2 4s ease-in-out infinite;}`}</style>
      <path d="M 10 30 C 60 30 80 10 140 10 C 200 10 220 50 280 50" stroke="oklch(40% 0.07 293)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path className="pipe-glow2" d="M 10 30 C 60 30 80 10 140 10 C 200 10 220 50 280 50" stroke="var(--kinship-mid)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="260" strokeDashoffset="260"><animate attributeName="stroke-dashoffset" values="260;0;0;260" dur="4s" repeatCount="indefinite"/></path>
      {[0, 1.2, 2.4].map((delay, i) => (
        <circle key={i} r="4" fill="var(--kinship-cream)" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite" begin={`${delay}s`}><mpath xlinkHref="#pipe-path2"/></animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" repeatCount="indefinite" begin={`${delay}s`}/>
        </circle>
      ))}
      <path id="pipe-path2" d="M 10 30 C 60 30 80 10 140 10 C 200 10 220 50 280 50" fill="none"/>
    </svg>
  );
}

// ─── Shared layout primitives ──────────────────────────────────────────────────

function SlideTitle({ title, subtitle, eyebrow, dark = false }: { title: string; subtitle?: string; eyebrow?: string; dark?: boolean }) {
  return (
    <div className="text-center w-full max-w-4xl px-2">
      {eyebrow && (
        <p className="mb-4 text-xs font-mono tracking-[0.2em] uppercase sm:mb-6 sm:text-sm" style={{ color: dark ? "oklch(70% 0.05 293)" : "var(--kinship-mid)" }}>{eyebrow}</p>
      )}
      <h1 style={{ fontSize: "clamp(2rem,5.5vw,5rem)", lineHeight: 1.05, fontFamily: "'Georgia','Times New Roman',serif", color: dark ? "var(--kinship-cream)" : "var(--kinship-ink)" }}>{title}</h1>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed mx-auto max-w-2xl sm:mt-8 sm:text-xl" style={{ color: dark ? "oklch(70% 0.05 293)" : "oklch(50% 0.06 293)", fontWeight: 400 }}>{subtitle}</p>
      )}
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className="text-xs font-mono tracking-[0.2em] uppercase mb-4 sm:mb-8" style={{ color: dark ? "oklch(60% 0.05 293)" : "var(--kinship-mid)" }}>{children}</p>
  );
}

function Pill({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium border" style={{ background: accent ? "var(--kinship-ink)" : "transparent", color: accent ? "var(--kinship-cream)" : "var(--kinship-mid)", borderColor: accent ? "var(--kinship-ink)" : "var(--kinship-dim)" }}>{children}</span>
  );
}

function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={"rounded-2xl border p-4 sm:p-6 " + className} style={{ background: "white", borderColor: "var(--kinship-dim)", ...style }}>{children}</div>
  );
}

function DarkCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={"rounded-2xl border p-4 sm:p-6 " + className} style={{ background: "oklch(25% 0.07 293)", borderColor: "oklch(35% 0.07 293)" }}>{children}</div>
  );
}

function AskBubble({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl p-6 sm:p-8 text-center w-full max-w-3xl" style={{ background: "oklch(25% 0.07 293)", color: "var(--kinship-cream)" }}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Mic className="w-5 h-5" style={{ color: "var(--kinship-dim)" }} />
        <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "var(--kinship-dim)" }}>Ask the room</span>
      </div>
      <p className="text-xl sm:text-2xl leading-snug" style={{ fontFamily: "'Georgia',serif", fontStyle: "italic" }}>{children}</p>
    </div>
  );
}

// ─── Slides ────────────────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5 px-4 py-8 sm:gap-6" style={{ background: "var(--kinship-ink)" }}>
      <div className="relative flex items-center justify-center">
        <CoverBrainAnimation />
        <div className="absolute flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-2xl" style={{ background: "oklch(25% 0.08 293)" }}>
          <Brain className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "var(--kinship-cream)" }} />
        </div>
      </div>
      <SlideTitle dark eyebrow="All-Hands · June 2026" title="The Kinship Brain" subtitle="Shared memory. Connected tools. A team that punches above its weight." />
      <p className="text-xs font-mono tracking-widest uppercase mt-1" style={{ color: "oklch(45% 0.06 293)" }}>← → to navigate · swipe on mobile</p>
    </div>
  );
}

function WhySlide() {
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto">
      <SectionLabel>1 · Why we&apos;re here</SectionLabel>
      <SlideTitle title="Every company loses context." subtitle="It lives in someone's inbox, someone's head, a doc nobody can find. At our size — survivable. As we grow — fatal." />
      <div className="w-full flex justify-center overflow-x-auto"><ContextLossAnimation /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {[
          { icon: Database, label: "One place", desc: "Schools, conversations, decisions — connected & searchable" },
          { icon: Users, label: "For humans & AI", desc: "Readable by your team and the agents that work alongside you" },
          { icon: Network, label: "Needs you", desc: "The pipes are built. The knowledge that flows through them — that's yours" },
        ].map(({ icon: Icon, label, desc }) => (
          <Card key={label} className="text-center">
            <div className="flex justify-center mb-2"><Icon className="w-5 h-5" style={{ color: "var(--kinship-mid)" }} /></div>
            <p className="font-semibold mb-1 text-sm" style={{ color: "var(--kinship-ink)" }}>{label}</p>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ToolsSlide() {
  const tools = [
    { name: "Notion", role: "Company filing system — schools, contacts, deals, meetings, tasks, devices." },
    { name: "Google Workspace", role: "Docs, sheets, slides. The working surface for human-made artifacts." },
    { name: "Claude Team", role: "Shared AI workspace. Skills one person builds become everyone's tools." },
    { name: "Claude Cowork", role: "Your personal AI operator — connectors, scheduled tasks, daily briefings." },
    { name: "Hermes", role: "Our Slack agent. The operational brain that lives where we already talk." },
  ];
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>2 · Tools already in your hands</SectionLabel>
      <SlideTitle title="No new app to learn." subtitle="The brain connects the tools you already use." />
      <div className="w-full flex justify-center overflow-x-auto"><ToolsNetworkAnimation /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
        {tools.map(({ name, role }) => (
          <Card key={name} className="flex flex-col gap-1">
            <p className="font-semibold text-sm" style={{ color: "var(--kinship-ink)" }}>{name}</p>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{role}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SkillsSlide() {
  const skills = ["kinship-design","kinship-product","morning-briefing","kinship-brain-sync","kinship-brain-query","competitive-intelligence","call-prep","create-an-asset","call-follow-up"];
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>3a · Skills</SectionLabel>
      <SlideTitle title="Stop rewriting the same prompt." subtitle="A skill is a reusable bundle of context. Load it once, get expert output every time." />
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-3xl">
        {skills.map(s => <Pill key={s} accent={["kinship-design","kinship-product","morning-briefing"].includes(s)}>{s}</Pill>)}
      </div>
      <Card className="max-w-3xl w-full">
        <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "var(--kinship-dim)" }}>Live demo prompt</p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--kinship-ink)", fontFamily: "'Georgia',serif", fontStyle: "italic" }}>
          &ldquo;Using the <span className="font-mono not-italic text-sm sm:text-base" style={{ color: "var(--kinship-mid)" }}>kinship-design</span> and <span className="font-mono not-italic text-sm sm:text-base" style={{ color: "var(--kinship-mid)" }}>kinship-product</span> skills, draft a one-page overview of Hearth for a prospective school principal.&rdquo;
        </p>
        <p className="text-sm mt-3" style={{ color: "oklch(55% 0.06 293)" }}>Two-line prompt. On-brand. Accurate. No manual context pasted in.</p>
      </Card>
    </div>
  );
}

function AskRoom2() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-4 py-10" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Skill backlog</SectionLabel>
      <AskBubble>&ldquo;What&apos;s a repetitive prompt you keep retyping? That&apos;s probably a skill we should build.&rdquo;</AskBubble>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>Capture every answer — this is your skill backlog.</p>
    </div>
  );
}

function ConnectorsSlide() {
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-4">
          <SectionLabel>3b · Connectors</SectionLabel>
          <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(1.6rem,3.5vw,2rem)", color: "var(--kinship-ink)", lineHeight: 1.1 }}>Give Claude eyes on your real work.</h2>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6, fontSize: "0.95rem" }}>We use: <strong>Gmail · Google Calendar · Google Drive · Notion · Slack · Zoom.</strong></p>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6, fontSize: "0.95rem" }}>&ldquo;What&apos;s on my plate today?&rdquo; pulls from your real calendar, inbox, and the brain — not a guess.</p>
        </div>
        <div className="flex flex-col gap-4">
          <SectionLabel>3c · Scheduled tasks</SectionLabel>
          <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(1.6rem,3.5vw,2rem)", color: "var(--kinship-ink)", lineHeight: 1.1 }}>Set it once, get value every day.</h2>
          <Card className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--kinship-cream)", border: "1px solid var(--kinship-dim)" }}><Calendar className="w-4 h-4" style={{ color: "var(--kinship-mid)" }} /></div>
              <div><p className="font-semibold text-sm mb-1" style={{ color: "var(--kinship-ink)" }}>Morning debrief</p><p className="text-sm" style={{ color: "oklch(50% 0.06 293)" }}>Runs <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#f0ece4" }}>morning-briefing</code> against calendar, inbox, Slack, and brain. Start here.</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--kinship-cream)", border: "1px solid var(--kinship-dim)" }}><Clock className="w-4 h-4" style={{ color: "var(--kinship-mid)" }} /></div>
              <div><p className="font-semibold text-sm mb-1" style={{ color: "var(--kinship-ink)" }}>Evening data dump</p><p className="text-sm" style={{ color: "oklch(50% 0.06 293)" }}>Runs <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#f0ece4" }}>kinship-brain-sync</code> to sweep the day&apos;s signal into the brain.</p></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HermesSlide() {
  const capabilities = ["Book appointments","Create Zoom calls","Financial updates","Rapid prototyping","Coding tasks","Research synthesis"];
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>4 · Hermes</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full items-start">
        <div className="flex flex-col gap-4">
          <h2 style={{ fontFamily: "'Georgia',serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", color: "var(--kinship-ink)", lineHeight: 1.1 }}>The shared operator in Slack.</h2>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6, fontSize: "0.95rem" }}>Claude is <em>your</em> personal operator. Hermes is the <em>shared</em> operator — it lives where we already talk.</p>
          <div className="flex flex-col gap-2">
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
        <div className="flex justify-center w-full overflow-x-auto"><HermesChatAnimation /></div>
      </div>
    </div>
  );
}

function AskRoom3() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-4 py-10" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>The most important question today</SectionLabel>
      <AskBubble>&ldquo;If Hermes could do one thing for your role, what would it be?&rdquo;</AskBubble>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-3xl">
        {["A support agent that drafts replies?","A sales agent that preps every call?","An agent that flags when a school goes quiet?"].map(ex => (
          <span key={ex} className="text-sm px-4 py-2 rounded-full" style={{ background: "oklch(28% 0.07 293)", color: "oklch(70% 0.05 293)" }}>{ex}</span>
        ))}
      </div>
      <p className="text-sm text-center max-w-lg" style={{ color: "oklch(45% 0.06 293)" }}>Dream big — start complex, we can always scale it down. This list is your agent roadmap.</p>
    </div>
  );
}

function AutomationIdeasSlide() {
  const ideas = [
    { index: 0, icon: FileText, title: "Notion transcripts → overnight learning", desc: "Record any call in Notion — even in-person. Move the transcript to the shared meeting database. Hermes reads it overnight, enriches the brain's understanding, but never quietly rewrites your Notion records.", tag: "Low friction capture", tagColor: "oklch(60% 0.17 142)" },
    { index: 1, icon: TrendingUp, title: "Pilot expense tracking", desc: "Log pilot-related costs as they happen — no end-of-month scramble. Hermes keeps a running tally per school, flags anomalies, and surfaces a clean summary on demand.", tag: "Real-time visibility", tagColor: "oklch(62% 0.21 27)" },
    { index: 2, icon: Package, title: "Field feedback → client artifacts", desc: "When your team spots something in the field — a feature gap, a win, a pain point — log it once. Hermes routes it as a product signal and drafts a polished artifact you can share with that school.", tag: "Feedback to output", tagColor: "var(--kinship-mid)" },
  ];
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>4b · Automation ideas — from the team</SectionLabel>
      <SlideTitle title="Three ideas already on the table." subtitle="These came from you. Here's how they'd work." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {ideas.map(({ index, icon: Icon, title, desc, tag, tagColor }) => (
          <Card key={title} className="flex flex-col gap-3">
            <div className="w-full overflow-x-auto"><AutomationFlowAnimation index={index} /></div>
            <div className="flex items-center gap-2 mt-1">
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: tagColor }} />
              <p className="font-semibold text-sm leading-snug" style={{ color: "var(--kinship-ink)" }}>{title}</p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            <span className="self-start text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "oklch(95% 0.02 293)", color: tagColor, border: `1px solid ${tagColor}` }}>{tag}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContextSlide() {
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>5 · Context engineering</SectionLabel>
      <SlideTitle title="Three connected contexts." subtitle="Signals pass between them — selectively, on purpose." />
      <div className="w-full flex justify-center overflow-x-auto"><ContextFlowAnimation /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {[
          { label: "Customer context", color: "oklch(60% 0.17 142)", desc: "What our customer-facing AI knows about each school and student.", status: "future" },
          { label: "Operations context", color: "var(--kinship-mid)", desc: "What helps us work better together. This is where the brain lives today — Hermes is its engine.", status: "live" },
          { label: "Product context", color: "oklch(62% 0.21 27)", desc: "What engineers use to build the right things. Near-term goal: wire ops → product.", status: "coming" },
        ].map(({ label, color, desc, status }) => (
          <Card key={label} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                <p className="font-semibold text-sm" style={{ color: "var(--kinship-ink)" }}>{label}</p>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: status === "live" ? "oklch(93% 0.05 142)" : "oklch(94% 0.02 293)", color: status === "live" ? "oklch(42% 0.15 142)" : "oklch(55% 0.06 293)" }}>
                  {status === "live" ? "● live" : status === "future" ? "coming" : "near-term"}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--kinship-dim)" }} />
        <p className="text-sm" style={{ color: "oklch(55% 0.06 293)" }}>Near-term goal: wire <strong>operations → product</strong> so we build based on real feedback from the field.</p>
      </div>
    </div>
  );
}

function AskRoom4() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-4 py-10" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Cross-team signals</SectionLabel>
      <AskBubble>&ldquo;What&apos;s a signal your team generates that another team would kill to know about automatically?&rdquo;</AskBubble>
    </div>
  );
}

function CaptureSlide() {
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>6 · How context gets captured</SectionLabel>
      <SlideTitle title="You shouldn't be doing manual data entry." subtitle="The brain is assembled from tools you already use — and we're selective about what we capture." />
      <div className="w-full flex justify-center overflow-x-auto"><CaptureFlowAnimation /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Card className="sm:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5" style={{ color: "oklch(60% 0.17 142)" }} /><p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Live automations</p></div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}><strong>Zoom</strong> and <strong>Google Meet</strong> — turn on the transcript. It flows through automation into the brain, updating both Notion databases and Hermes&apos;s wiki automatically.</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Focus: <strong>external conversations</strong>. Any external partner meeting → straight into the brain. Nobody typed this.</p>
        </Card>
        <Card className="flex flex-col gap-3" style={{ background: "oklch(98% 0.01 80)" }}>
          <div className="flex items-center gap-3"><Layers className="w-5 h-5" style={{ color: "var(--kinship-mid)" }} /><p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>What we don&apos;t capture</p></div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Everything. Capturing all transcripts floods the brain with noise. We&apos;re picky.</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Internal chatter mostly doesn&apos;t need to be in the brain.</p>
        </Card>
      </div>
    </div>
  );
}

function TwoRepresentationsSlide() {
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>7 · How the brain is presented</SectionLabel>
      <SlideTitle title="Same knowledge. Two lenses." />
      <div className="w-full flex justify-center overflow-x-auto"><TwoLensAnimation /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-3"><Database className="w-5 h-5" style={{ color: "var(--kinship-mid)" }} /><p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Notion databases — For humans</p></div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>A friendlier, navigable spreadsheet. You filter, you edit, you decide what to act on. Agents help keep it organised — you stay in the driver&apos;s seat.</p>
          <p className="text-xs italic" style={{ color: "oklch(60% 0.06 293)" }}>e.g. View all active pilots, filter by school district, update status in one click.</p>
        </Card>
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-3"><GitBranch className="w-5 h-5" style={{ color: "var(--kinship-mid)" }} /><p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>The wiki / knowledge graph — For AI</p></div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Freeform. Hermes builds it automatically — &ldquo;this is a person,&rdquo; &ldquo;this is a school,&rdquo; &ldquo;they had this meeting.&rdquo; No human opinion on taxonomy required.</p>
          <p className="text-xs italic" style={{ color: "oklch(60% 0.06 293)" }}>e.g. Hermes can answer: &ldquo;Which schools have been quiet for 2+ weeks?&rdquo; without a manual query.</p>
        </Card>
      </div>
      <div className="flex items-center gap-3 rounded-2xl px-6 py-4 w-full" style={{ background: "oklch(25% 0.07 293)" }}>
        <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: "var(--kinship-dim)" }} />
        <p className="text-base" style={{ color: "var(--kinship-cream)", fontFamily: "'Georgia',serif", fontStyle: "italic" }}>&ldquo;You do what only humans can do. Let AI take the busy work.&rdquo;</p>
      </div>
    </div>
  );
}

function HowYouHelpSlide() {
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-5xl mx-auto">
      <SectionLabel>8 · This is a team sport</SectionLabel>
      <SlideTitle title="Your job isn't data entry." subtitle="It's spotting where automation would help and raising it." />
      <div className="w-full flex justify-center overflow-x-auto"><SignalAnimation /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        <Card className="flex flex-col gap-3">
          <Zap className="w-5 h-5 mb-1" style={{ color: "var(--kinship-mid)" }} />
          <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Where to bring ideas</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Channel: <code className="px-2 py-0.5 rounded text-xs" style={{ background: "#f0ece4" }}>#topic-brain-context</code></p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Anything about the brain — automations, &ldquo;how do I capture this,&rdquo; ideas — goes there.</p>
        </Card>
        <Card className="flex flex-col gap-3">
          <MessageSquare className="w-5 h-5 mb-1" style={{ color: "var(--kinship-mid)" }} />
          <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Worked example: in-person meeting</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>No Zoom. No Meet. Open Notion mobile → start a private page → record/transcribe → hand transcript to Hermes.</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>Hermes organizes it: updates the wiki and the Notion databases. No manual entry.</p>
        </Card>
      </div>
    </div>
  );
}

function AskRoom5() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-4 py-10" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Automation ideas</SectionLabel>
      <AskBubble>&ldquo;Name one moment this week where you wished something just recorded itself into the brain.&rdquo;</AskBubble>
    </div>
  );
}

function SlackSlide() {
  const conventions = [
    { prefix: "proj-…", reads: true,  desc: "A specific project or school (e.g. proj-brown). The brain reads these." },
    { prefix: "team-…", reads: true,  desc: "How a team works (team-sales, team-eng). The brain reads these." },
    { prefix: "space-…", reads: false, desc: "Social, community. Free zone — the brain doesn't read." },
    { prefix: "open-…",  reads: false, desc: "Open discussions. Free zone." },
    { prefix: "topic-…", reads: true,  desc: "Side topics. The brain reads these — we're starting to monitor these channels." },
    { prefix: "alerts-…", reads: false, desc: "Notifications and alerts. Free zone." },
  ];
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-4xl mx-auto">
      <SectionLabel>9 · Slack conventions</SectionLabel>
      <SlideTitle title="Talk in public." subtitle="The brain learns from public channels — and so does our culture." />
      <div className="w-full flex flex-col gap-2 mt-1">
        {conventions.map(({ prefix, reads, desc }) => (
          <div key={prefix} className="flex items-start gap-3 rounded-xl border px-4 py-3" style={{ borderColor: "var(--kinship-dim)", background: "white" }}>
            <code className="text-xs sm:text-sm font-mono px-2 py-1 rounded-lg flex-shrink-0 w-24 text-center" style={{ background: reads ? "oklch(93% 0.05 293)" : "oklch(95% 0.01 80)", color: reads ? "var(--kinship-mid)" : "oklch(55% 0.06 293)" }}>{prefix}</code>
            <p className="flex-1 text-xs sm:text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: reads ? "oklch(93% 0.05 142)" : "oklch(94% 0.02 293)", color: reads ? "oklch(42% 0.15 142)" : "oklch(65% 0.04 293)" }}>{reads ? "● reads" : "free"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CloseSlide() {
  const actions = [
    { num: "01", action: "Set up your tools", detail: "Connect Claude, Slack, Zoom, and Google Workspace so we can start collecting business intelligence from day one.", icon: Zap },
    { num: "02", action: "Set up your daily debrief on Claude", detail: "Turn on the morning-briefing scheduled task. See what intel you get, notice what's missing, and tell us.", icon: Calendar },
    { num: "03", action: "Book a meeting with Azim", detail: "30 minutes. Walk through your tooling, your role, and what the brain can do for you specifically.", icon: MessageSquare },
  ];
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-4 py-8 sm:px-8 max-w-3xl mx-auto" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>10 · Three things to do this week</SectionLabel>
      <div className="flex flex-col gap-4 w-full">
        {actions.map(({ num, action, detail, icon: Icon }) => (
          <DarkCard key={num} className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl font-mono flex-shrink-0" style={{ color: "oklch(35% 0.07 293)" }}>{num}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--kinship-mid)" }} />
                <p className="text-base sm:text-lg font-semibold" style={{ color: "var(--kinship-cream)" }}>{action}</p>
              </div>
              <p className="text-sm" style={{ color: "oklch(60% 0.05 293)" }}>{detail}</p>
            </div>
          </DarkCard>
        ))}
      </div>
    </div>
  );
}

function FinalSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 px-4 py-10" style={{ background: "var(--kinship-ink)" }}>
      <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border" style={{ borderColor: "oklch(35% 0.08 293)", background: "oklch(25% 0.08 293)" }}>
        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: "var(--kinship-cream)" }} />
      </div>
      <SlideTitle dark title="We build the pipes." subtitle="You're the ones who know what should flow through them. Let's build it together." />
      <PipeFlowAnimation />
      <div className="mt-2 flex items-center gap-3 text-sm font-mono tracking-widest uppercase" style={{ color: "oklch(40% 0.06 293)" }}>
        <Star className="w-4 h-4" /><span>#topic-brain-context</span><Star className="w-4 h-4" />
      </div>
    </div>
  );
}

function FAQSlide() {
  const faqs = [
    { q: "Is the brain reading my DMs or private channels?", a: "No. Private channels and DMs are never read. Only public proj-, team-, and topic- channels feed the brain." },
    { q: "Do I have to learn a new app?", a: "No. The brain connects tools you already use. The main new habit is talking in public channels." },
    { q: "What if the AI gets something wrong?", a: "Humans review and approve. Agents propose, they don't silently overwrite. The source transcript/email always wins on raw facts." },
    { q: "Will every meeting get recorded?", a: "No — we're selective. Right now it's external conversations transcribed via Zoom/Meet. We deliberately avoid capturing everything." },
    { q: "I'm not technical — is this for me?", a: "Especially for you. The point is to remove admin work, not add it. Start with the daily debrief." },
  ];
  return (
    <div className="flex flex-col items-center w-full gap-5 px-4 py-6 sm:px-8 max-w-4xl mx-auto">
      <SectionLabel>Appendix · Likely questions</SectionLabel>
      <div className="w-full flex flex-col gap-3">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-xl border px-5 py-4" style={{ borderColor: "var(--kinship-dim)", background: "white" }}>
            <p className="font-semibold text-sm mb-2" style={{ color: "var(--kinship-ink)" }}>{q}</p>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide registry ────────────────────────────────────────────────────────────

const SLIDES = [
  { id: "cover",           component: <CoverSlide />,              label: "Cover",                    dark: true },
  { id: "why",             component: <WhySlide />,                label: "Why we're here",           dark: false },
  { id: "tools",           component: <ToolsSlide />,              label: "Your tools",               dark: false },
  { id: "skills",          component: <SkillsSlide />,             label: "Skills",                   dark: false },
  { id: "ask-2",           component: <AskRoom2 />,                label: "Ask the room",             dark: true },
  { id: "connectors",      component: <ConnectorsSlide />,         label: "Connectors + tasks",       dark: false },
  { id: "hermes",          component: <HermesSlide />,             label: "Hermes",                   dark: false },
  { id: "ask-3",           component: <AskRoom3 />,                label: "Ask the room",             dark: true },
  { id: "automation-ideas",component: <AutomationIdeasSlide />,   label: "Automation ideas",         dark: false },
  { id: "context",         component: <ContextSlide />,            label: "Context engineering",      dark: false },
  { id: "ask-4",           component: <AskRoom4 />,                label: "Ask the room",             dark: true },
  { id: "capture",         component: <CaptureSlide />,            label: "How context is captured",  dark: false },
  { id: "representations", component: <TwoRepresentationsSlide />, label: "Two lenses",               dark: false },
  { id: "help",            component: <HowYouHelpSlide />,         label: "How you help",             dark: false },
  { id: "ask-5",           component: <AskRoom5 />,                label: "Ask the room",             dark: true },
  { id: "slack",           component: <SlackSlide />,              label: "Slack conventions",        dark: false },
  { id: "close",           component: <CloseSlide />,              label: "Three actions",            dark: true },
  { id: "final",           component: <FinalSlide />,              label: "Close",                    dark: true },
  { id: "faq",             component: <FAQSlide />,                label: "FAQ",                      dark: false },
];

// ─── Main Presentation ─────────────────────────────────────────────────────────

export default function AllHandsPresentation() {
  const [[page, dir], setPage] = useState([0, 0]);
  const [showNav, setShowNav] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Detect touch device + restore saved position
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      setShowNav(true);
    }
    const saved = localStorage.getItem("kinship-allhands-slide");
    if (saved) {
      const n = parseInt(saved, 10);
      if (!isNaN(n) && n >= 0 && n < SLIDES.length) setPage([n, 0]);
    }
  }, []);

  const go = useCallback((newPage: number) => {
    if (newPage < 0 || newPage >= SLIDES.length) return;
    const d = newPage > page ? 1 : -1;
    setPage([newPage, d]);
    localStorage.setItem("kinship-allhands-slide", String(newPage));
  }, [page]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); go(page + 1); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")                    { e.preventDefault(); go(page - 1); }
      if (e.key === "Home") go(0);
      if (e.key === "End")  go(SLIDES.length - 1);
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
      dx < 0 ? go(page + 1) : go(page - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [go, page]);

  const current = SLIDES[page];
  const isDark = current.dark;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
    exit:  (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, transition: { duration: 0.35, ease: EASE_IN } }),
  };

  return (
    /*
     * Mobile-safe shell:
     *   - height: 100dvh — iOS Safari: shrinks/grows with address bar (no clipping)
     *   - flex-col: top chrome (flex-none) + scrollable body (flex-1) + nav bar (flex-none)
     *   - nav bar is always the last row — never overlaps slide content
     */
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{ height: "100dvh", background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top chrome: label + counter */}
      <div className="flex-none flex items-center justify-between px-4 pt-3 pb-1 sm:px-8 sm:pt-5">
        <div className="text-xs font-mono tracking-widest truncate max-w-[60vw]" style={{ color: isDark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)", minHeight: "1em" }}>
          {current.label}
        </div>
        <div className="text-xs font-mono tracking-widest flex-none" style={{ color: isDark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}>
          {page + 1} / {SLIDES.length}
        </div>
      </div>

      {/* Slide body: animated, scrollable */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-y-auto"
            style={{ background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
          >
            {/* min-h-full + flex-col + justify-center: centres short content, scrolls long content */}
            <div className="min-h-full flex flex-col items-center justify-center">
              {current.component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav bar: always at bottom, never overlaps */}
      <div
        className="flex-none flex items-center justify-center gap-4 px-4 py-3 sm:gap-6 sm:py-5 transition-opacity duration-200"
        style={{ opacity: isTouchDevice || showNav ? 1 : 0 }}
      >
        <button
          onClick={() => go(page - 1)} disabled={page === 0}
          className="p-2 sm:p-2.5 rounded-xl border transition-all"
          style={{ borderColor: isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)", background: isDark ? "oklch(25% 0.07 293)" : "white", color: isDark ? "var(--kinship-cream)" : "var(--kinship-ink)", opacity: page === 0 ? 0.2 : 0.8 }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 19 slides → compact "N of 19" text instead of dot row */}
        <span className="text-sm font-mono w-16 text-center" style={{ color: isDark ? "oklch(55% 0.05 293)" : "oklch(55% 0.05 293)" }}>
          {page + 1} of {SLIDES.length}
        </span>

        <button
          onClick={() => go(page + 1)} disabled={page === SLIDES.length - 1}
          className="p-2 sm:p-2.5 rounded-xl border transition-all"
          style={{ borderColor: isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)", background: isDark ? "oklch(25% 0.07 293)" : "white", color: isDark ? "var(--kinship-cream)" : "var(--kinship-ink)", opacity: page === SLIDES.length - 1 ? 0.2 : 0.8 }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
