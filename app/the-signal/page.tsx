'use client';
// Client component: full adaptive alien-language learning interactive demo
// Ported from TheSignal-v2_1.jsx — self-contained React engine with 38-node knowledge graph,
// adaptive routing, placement, inference, retrieval, shelving, and personal graph reveal.

import React, { useState, useEffect, useRef, useMemo } from 'react';

/* =========================================================================
   THE SIGNAL — v2
   Velan: 38-node knowledge graph, adaptive engine, personal graph reveal.
   ========================================================================= */

const C = { ink: "#3D1A4E", mid: "#7A5590", dim: "#B8A2C8", cream: "#F5F0E8",
  paper: "#FBF8F3", ok: "#22C55E", warn: "#F59E0B", bad: "#EF4444" };

const SERIF = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif";
const SANS = "'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let RNG = mulberry32(12345);
const rand = () => RNG();
const randInt = (lo, hi) => lo + Math.floor(RNG() * (hi - lo + 1));
const pickOne = (a) => a[Math.floor(rand() * a.length)];

/* --------------------------------- glyphs ----------------------------------
   Lexical families share construction so structure can be inferred:
   agents = ring on stem · places = diamond · things = hexagon
   GIVE/TAKE are mirrored · LARGE/SMALL open outward vs inward
   --------------------------------------------------------------------------- */

const GLYPHS = {
  PERSON:   { shape: "a ring above a single stem",
    d: () => <><circle cx="32" cy="24" r="9" /><path d="M32 33 L32 50" /></> },
  CREATURE: { shape: "a ring above a doubled stem",
    d: () => <><circle cx="32" cy="22" r="9" /><path d="M27 31 L27 50" /><path d="M37 31 L37 50" /></> },
  HOME:     { shape: "a diamond crossed by a straight bar",
    d: () => <><path d="M32 13 L49 31 L32 49 L15 31 Z" /><path d="M24 31 L40 31" /></> },
  WATER:    { shape: "a diamond holding a wave",
    d: () => <><path d="M32 13 L49 31 L32 49 L15 31 Z" /><path d="M23 33 Q27 26 31 31 Q35 36 39 29" /></> },
  OBJECT:   { shape: "a six-sided form with an upright bar",
    d: () => <><path d="M32 13 L49 22 L49 40 L32 49 L15 40 L15 22 Z" /><path d="M32 24 L32 38" /></> },
  FOOD:     { shape: "a six-sided form with a filled centre",
    d: (s) => <><path d="M32 13 L49 22 L49 40 L32 49 L15 40 L15 22 Z" /><circle cx="32" cy="31" r="4" fill={s} stroke="none" /></> },
  MOVE:     { shape: "an upright bar with two arms of different length",
    d: () => <><path d="M17 16 L17 48" /><path d="M17 25 L48 25" /><path d="M17 39 L35 39" /></> },
  SEE:      { shape: "two nested arcs beneath a dot",
    d: (s) => <><path d="M13 44 Q32 16 51 44" /><path d="M23 45 Q32 31 41 45" /><circle cx="32" cy="18" r="3.5" fill={s} stroke="none" /></> },
  GIVE:     { shape: "a bar on the left, a wedge, and a dot to the right",
    d: (s) => <><path d="M18 14 L18 48" /><path d="M28 24 L40 31 L28 38" /><circle cx="48" cy="31" r="3.5" fill={s} stroke="none" /></> },
  TAKE:     { shape: "a bar on the right, a wedge, and a dot to the left",
    d: (s) => <><path d="M46 14 L46 48" /><path d="M36 24 L24 31 L36 38" /><circle cx="16" cy="31" r="3.5" fill={s} stroke="none" /></> },
  LARGE:    { shape: "two wedges opening away from each other",
    d: () => <><path d="M26 16 L14 31 L26 46" /><path d="M38 16 L50 31 L38 46" /></> },
  SMALL:    { shape: "the same two wedges, drawn small",
    d: () => <><path d="M29 23 L22 31 L29 39" /><path d="M35 23 L42 31 L35 39" /></> },
  TO:       { shape: "a raised wedge above a dot",
    d: (s) => <><path d="M25 37 L32 25 L39 37" /><circle cx="32" cy="46" r="3.2" fill={s} stroke="none" /></> },
  QUERY:    { shape: "an upright stroke beside two stacked dots",
    d: (s) => <><path d="M26 18 L26 46" /><circle cx="40" cy="24" r="3.2" fill={s} stroke="none" /><circle cx="40" cy="38" r="3.2" fill={s} stroke="none" /></> },
};

/* "PERSON+p" "MOVE+r" "SEE+past" "GIVE+fut+neg" */
function parseGlyph(code) {
  const [base, ...m] = String(code).split("+");
  return { g: base, plural: m.includes("p"), rot: m.includes("r"),
    past: m.includes("past"), fut: m.includes("fut"), neg: m.includes("neg") };
}

function glyphDescription(code) {
  const s = parseGlyph(code);
  const b = GLYPHS[s.g];
  if (!b) return "an unknown symbol";
  let d = b.shape;
  if (s.rot) d += ", reversed";
  if (s.plural) d += ", with two dots above";
  if (s.past) d += ", with a mark on its left";
  if (s.fut) d += ", with a mark on its right";
  if (s.neg) d += ", with a bar beneath";
  return d;
}

function AlienGlyph({ code, size = 64, tone = C.ink }) {
  const s = parseGlyph(code);
  const b = GLYPHS[s.g];
  if (!b) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img"
      aria-label={`Symbol: ${glyphDescription(code)}`} style={{ display: "block", flex: "0 0 auto" }}>
      <g stroke={tone} strokeWidth={size >= 88 ? 3 : 3.3} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        transform={s.rot ? "rotate(180 32 31)" : undefined}>{b.d(tone)}</g>
      <g stroke={tone} strokeWidth={3.3} fill={tone} strokeLinecap="round">
        {s.plural && <><circle cx="25" cy="5" r="2.7" stroke="none" /><circle cx="39" cy="5" r="2.7" stroke="none" /></>}
        {s.past && <path d="M5 24 L5 38" fill="none" />}
        {s.fut && <path d="M59 24 L59 38" fill="none" />}
        {s.neg && <path d="M22 58 L42 58" fill="none" />}
      </g>
    </svg>
  );
}

function GlyphSequence({ codes, size = 60, gap = 9, tone = C.ink }) {
  const list = typeof codes === "string" ? codes.split(/\s+/) : codes;
  return (
    <div style={{ display: "flex", gap, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      {list.map((c, i) => <AlienGlyph key={i} code={c} size={size} tone={tone} />)}
    </div>
  );
}

/* ============================ knowledge graph (38) =========================== */
/* cat: foundation | vocab | morphology | syntax | integration | transfer
   region: movement | perception | exchange | morphology | integration | core   */

const N = (id, name, short, cat, region, desc, pre, x, y) =>
  ({ id, name, short, cat, region, desc, pre, x, y });

const NODES = [
  /* foundation */
  N("N01", "Symbols carry meaning", "Symbols", "foundation", "core",
    "Marks in the signal stand for meanings in a system.", {}, 420, 690),
  N("N02", "Marks modify symbols", "Marks", "foundation", "core",
    "Extra marks attached to a symbol change what it means without replacing it.",
    { anyOf: ["N03", "N09", "N10"], minimumAnyOf: 1 }, 640, 690),

  /* vocabulary */
  N("N03", "PERSON", "PERSON", "vocab", "perception", "The ring on a single stem means person.", { required: ["N01"] }, 60, 590),
  N("N04", "CREATURE", "CREATURE", "vocab", "exchange", "The ring on a doubled stem means creature.", { required: ["N01"] }, 150, 545),
  N("N05", "HOME", "HOME", "vocab", "movement", "The barred diamond means home.", { required: ["N01"] }, 300, 600),
  N("N06", "WATER", "WATER", "vocab", "movement", "The diamond holding a wave means water.", { required: ["N01"] }, 390, 555),
  N("N07", "OBJECT", "OBJECT", "vocab", "perception", "The six-sided form with a bar means object.", { required: ["N01"] }, 540, 600),
  N("N08", "FOOD", "FOOD", "vocab", "exchange", "The six-sided form with a filled centre means food.", { required: ["N01"] }, 630, 555),
  N("N09", "MOVE", "MOVE", "vocab", "movement", "The bar with two arms means move or go.", { required: ["N01"] }, 220, 655),
  N("N10", "SEE", "SEE", "vocab", "perception", "The arcs beneath a dot mean see.", { required: ["N01"] }, 480, 655),
  N("N11", "GIVE", "GIVE", "vocab", "exchange", "Bar, wedge and dot to the right means give.", { required: ["N01"] }, 760, 620),
  N("N12", "TAKE", "TAKE", "vocab", "exchange", "The mirrored form means take.", { required: ["N01"], anyOf: ["N11"], minimumAnyOf: 0 }, 850, 560),
  N("N13", "LARGE", "LARGE", "vocab", "perception", "Two wedges opening outward mean large.", { required: ["N01"] }, 20, 500),
  N("N14", "SMALL", "SMALL", "vocab", "perception", "The same wedges, drawn small, mean small.", { required: ["N01"], anyOf: ["N13"], minimumAnyOf: 0 }, 105, 455),

  /* morphology */
  N("N15", "Plural", "Plural", "morphology", "morphology",
    "Two dots above a noun make it more than one, on any noun.",
    { required: ["N02"], anyOf: ["N03", "N04", "N07", "N08"], minimumAnyOf: 2 }, 250, 470),
  N("N16", "Direction", "Direction", "morphology", "movement",
    "Reversing the movement symbol turns going away into coming toward.",
    { required: ["N09"] }, 330, 520),
  N("N17", "Past", "Past", "morphology", "morphology",
    "A mark to the left of an action means it already happened.",
    { required: ["N02"], anyOf: ["N09", "N10", "N11", "N12"], minimumAnyOf: 1 }, 560, 490),
  N("N18", "Future", "Future", "morphology", "morphology",
    "A mark to the right of an action means it has not happened yet.",
    { required: ["N02"], anyOf: ["N09", "N10", "N11", "N12"], minimumAnyOf: 1 }, 690, 470),
  N("N19", "Past vs future", "Past / future", "morphology", "morphology",
    "Reliably telling the two time marks apart by which side they sit on.",
    { required: ["N17", "N18"] }, 625, 400),
  N("N20", "Negation", "Negation", "morphology", "morphology",
    "A bar beneath an action means it does not happen.",
    { anyOf: ["N09", "N10", "N11"], minimumAnyOf: 1, required: ["N02"] }, 800, 480),
  N("N21", "Combined morphology", "Combined marks", "morphology", "morphology",
    "Two or more marks on one action at the same time.",
    { required: ["N20"], anyOf: ["N17", "N18"], minimumAnyOf: 1 }, 760, 380),

  /* syntax */
  N("N22", "Actor before action", "Actor-action", "syntax", "core",
    "The one doing something is written first.",
    { anyOf: ["N03", "N04"], minimumAnyOf: 1, required: ["N09"] }, 150, 400),
  N("N23", "Action before target", "Action-target", "syntax", "core",
    "What the action lands on follows the action.",
    { anyOf: ["N05", "N06", "N07", "N08"], minimumAnyOf: 1, required: ["N10"] }, 400, 400),
  N("N24", "Three-part message", "Full message", "syntax", "core",
    "Actor, action and target read in order as one message.",
    { required: ["N22", "N23"] }, 275, 330),
  N("N25", "Property before noun", "Property order", "syntax", "perception",
    "A size mark is written before the noun it describes.",
    { anyOf: ["N13", "N14"], minimumAnyOf: 1, required: ["N07"] }, 55, 330),
  N("N26", "Destination", "Destination", "syntax", "movement",
    "Movement takes a place as its destination.",
    { required: ["N09"], anyOf: ["N05", "N06"], minimumAnyOf: 1 }, 330, 250),
  N("N27", "Recipient structure", "Recipient", "syntax", "exchange",
    "Giving needs both a thing given and someone it goes to.",
    { required: ["N11", "N24"], anyOf: ["N08", "N04"], minimumAnyOf: 1 }, 800, 300),
  N("N28", "Role marker", "Role marker", "syntax", "exchange",
    "A small marker names the recipient, so position matters less than it did.",
    { required: ["N27"] }, 880, 220),

  /* integration */
  N("N29", "Plural in a message", "Plural in use", "integration", "integration",
    "Number marking survives inside a full sentence.", { required: ["N15", "N24"] }, 155, 250),
  N("N30", "Direction in a message", "Direction in use", "integration", "movement",
    "Orientation still changes meaning when the action is embedded.", { required: ["N16", "N22"] }, 425, 175),
  N("N31", "Tense in a message", "Tense in use", "integration", "integration",
    "Time marks apply to the action inside a longer message.",
    { required: ["N24"], anyOf: ["N17", "N18"], minimumAnyOf: 1 }, 580, 250),
  N("N32", "Negation in a message", "Negation in use", "integration", "integration",
    "A negated action inside a full sentence.", { required: ["N20", "N24"] }, 690, 175),
  N("N33", "Multi-rule decoding", "Multi-rule", "integration", "integration",
    "Several rules held at once in a single message.",
    { required: ["N24"], anyOf: ["N29", "N30", "N31", "N32", "N25", "N21"], minimumAnyOf: 2 }, 400, 110),

  /* transfer / generation */
  N("N34", "Near transfer", "Near transfer", "transfer", "integration",
    "A rule learned on one word used on another word of the same kind.",
    { anyOf: ["N15", "N17", "N20"], minimumAnyOf: 1, required: ["N02"] }, 200, 165),
  N("N35", "Structural transfer", "Structural transfer", "transfer", "integration",
    "A rule learned on one verb used on a verb with a different structure.",
    { required: ["N34"], anyOf: ["N27", "N26", "N23"], minimumAnyOf: 1 }, 620, 105),
  N("N36", "Combinatorial transfer", "Combinatorial", "transfer", "integration",
    "Rules combined in an arrangement never practised.", { required: ["N33"] }, 300, 50),
  N("N37", "Building a message", "Generate", "transfer", "integration",
    "Producing the signal for a meaning given in English.",
    { required: ["N24"], anyOf: ["N15", "N17", "N25"], minimumAnyOf: 1 }, 520, 45),
  N("N38", "Question marker", "Question", "transfer", "integration",
    "A marker at the end turns a statement into a question.",
    { required: ["N33"] }, 760, 60),
];

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES = [];
NODES.forEach((n) => {
  [...(n.pre.required || [])].forEach((f) => EDGES.push({ from: f, to: n.id, soft: false }));
  [...(n.pre.anyOf || [])].forEach((f) => EDGES.push({ from: f, to: n.id, soft: true }));
});

const MIS = {
  MIS01: "reads a reversed symbol as if it faced the other way",
  MIS02: "treats the dotted form as a separate word to memorise",
  MIS03: "confuses which side of the action the time mark sits on",
  MIS04: "reverses who is doing the action and who receives it",
  MIS05: "recognises the symbols but ignores the marks attached to them",
  MIS06: "applies an action rule to a noun, or the reverse",
  MIS07: "treats a whole message as one memorised unit rather than parts",
  MIS08: "confuses the thing given with the one receiving it",
  MIS09: "puts the size mark on the wrong side of the noun",
  MIS10: "drops the negation when other marks are present",
  MIS11: "still relies on position after a role marker has changed the rules",
  MIS12: "knows each piece but cannot hold them together at once",
};
const MIS_NODE = { MIS01: "N16", MIS02: "N15", MIS03: "N19", MIS04: "N22", MIS05: "N29",
  MIS06: "N15", MIS07: "N24", MIS08: "N27", MIS09: "N25", MIS10: "N32", MIS11: "N28", MIS12: "N33" };

/* =========================== sentences and glosses ==========================
   Items are generated from a structured meaning, and every distractor is one
   deliberate perturbation of that meaning — so wrong answers map to real
   misconceptions instead of being arbitrary.
   --------------------------------------------------------------------------- */

const LEX = {
  PERSON:   { sg: "person", pl: "people", art: true },
  CREATURE: { sg: "creature", pl: "creatures", art: true },
  HOME:     { sg: "home", pl: "homes", art: false },
  WATER:    { sg: "water", pl: "water", art: true },
  OBJECT:   { sg: "object", pl: "objects", art: true },
  FOOD:     { sg: "food", pl: "food", art: true },
};
const VERB = {
  MOVE: { s: "goes", p: "go", past: "went", fut: "go", stem: "go" },
  COME: { s: "comes", p: "come", past: "came", fut: "come", stem: "come" },
  SEE:  { s: "sees", p: "see", past: "saw", fut: "see", stem: "see" },
  GIVE: { s: "gives", p: "give", past: "gave", fut: "give", stem: "give" },
  TAKE: { s: "takes", p: "take", past: "took", fut: "take", stem: "take" },
};
const PROP = { LARGE: "large", SMALL: "small" };

function nounPhrase(n) {
  if (!n) return "";
  const L = LEX[n.n];
  const word = n.p ? L.pl : L.sg;
  const prop = n.prop ? PROP[n.prop] + " " : "";
  return (L.art ? "the " : "") + prop + word;
}

function verbWord(v, pluralSubj) {
  const key = v.g === "MOVE" && v.rot ? "COME" : v.g;
  const V = VERB[key];
  if (v.neg) {
    if (v.past) return "did not " + V.stem;
    if (v.fut) return "will not " + V.stem;
    return (pluralSubj ? "do not " : "does not ") + V.stem;
  }
  if (v.past) return V.past;
  if (v.fut) return "will " + V.fut;
  return pluralSubj ? V.p : V.s;
}

const PLACES = ["HOME", "WATER"];

function gloss(spec) {
  const subjPl = !!(spec.subj && spec.subj.p);
  const parts = [nounPhrase(spec.subj), verbWord(spec.v, subjPl)];
  if (spec.obj) {
    const dest = spec.v.g === "MOVE" && PLACES.includes(spec.obj.n) && LEX[spec.obj.n].art;
    parts.push((dest ? "to " : "") + nounPhrase(spec.obj));
  }
  if (spec.recip) parts.push("to " + nounPhrase(spec.recip));
  const text = parts.filter(Boolean).join(" ");
  if (spec.q) {
    const aux = spec.v.past ? "did" : spec.v.fut ? "will" : subjPl ? "do" : "does";
    const V = VERB[spec.v.g === "MOVE" && spec.v.rot ? "COME" : spec.v.g];
    const dest = spec.v.g === "MOVE" && spec.obj && PLACES.includes(spec.obj.n) && LEX[spec.obj.n].art;
    const rest = [nounPhrase(spec.subj), V.stem,
      spec.obj ? (dest ? "to " : "") + nounPhrase(spec.obj) : "",
      spec.recip ? "to " + nounPhrase(spec.recip) : ""];
    return aux + " " + rest.filter(Boolean).join(" ") + "?";
  }
  return text;
}

function nounGlyphs(n) {
  if (!n) return [];
  const out = [];
  if (n.prop) out.push(n.prop);
  out.push(n.n + (n.p ? "+p" : ""));
  return out;
}

function glyphs(spec) {
  const v = spec.v;
  let vc = v.g;
  if (v.rot) vc += "+r";
  if (v.past) vc += "+past";
  if (v.fut) vc += "+fut";
  if (v.neg) vc += "+neg";
  const out = [...nounGlyphs(spec.subj), vc, ...nounGlyphs(spec.obj)];
  if (spec.recip) { if (spec.marker) out.push("TO"); out.push(...nounGlyphs(spec.recip)); }
  if (spec.q) out.push("QUERY");
  return out;
}

const clone = (o) => JSON.parse(JSON.stringify(o));

/* each perturbation is a named misconception made concrete */
const PERTURB = {
  dropPlural: (s) => { const c = clone(s);
    if (c.subj && c.subj.p) c.subj.p = false;
    else if (c.obj && c.obj.p) c.obj.p = false;
    else if (c.recip && c.recip.p) c.recip.p = false; else return null; return c; },
  addPlural: (s) => { const c = clone(s);
    if (c.obj && !c.obj.p && LEX[c.obj.n].pl !== LEX[c.obj.n].sg) c.obj.p = true;
    else if (c.subj && !c.subj.p) c.subj.p = true; else return null; return c; },
  movePlural: (s) => { const c = clone(s);
    if (c.subj && c.obj && c.subj.p !== c.obj.p) { const t = c.subj.p; c.subj.p = c.obj.p; c.obj.p = t; return c; }
    return null; },
  flipTense: (s) => { const c = clone(s);
    if (c.v.past) { c.v.past = false; c.v.fut = true; }
    else if (c.v.fut) { c.v.fut = false; c.v.past = true; } else return null; return c; },
  dropTense: (s) => { const c = clone(s);
    if (!c.v.past && !c.v.fut) return null; c.v.past = false; c.v.fut = false; return c; },
  flipDirection: (s) => { const c = clone(s);
    if (c.v.g !== "MOVE") return null; c.v.rot = !c.v.rot; return c; },
  dropNeg: (s) => { const c = clone(s); if (!c.v.neg) return null; c.v.neg = false; return c; },
  swapRoles: (s) => { const c = clone(s);
    if (!c.obj || !c.subj) return null; const t = c.subj; c.subj = c.obj; c.obj = t; return c; },
  swapRecipient: (s) => { const c = clone(s);
    if (!c.recip || !c.obj) return null; const t = c.obj; c.obj = c.recip; c.recip = t; return c; },
  moveProperty: (s) => { const c = clone(s);
    if (c.subj && c.subj.prop && c.obj) { c.obj.prop = c.subj.prop; c.subj.prop = null; return c; }
    if (c.obj && c.obj.prop && c.subj) { c.subj.prop = c.obj.prop; c.obj.prop = null; return c; }
    return null; },
  flipProperty: (s) => { const c = clone(s);
    const t = c.subj && c.subj.prop ? c.subj : c.obj && c.obj.prop ? c.obj : null;
    if (!t) return null; t.prop = t.prop === "LARGE" ? "SMALL" : "LARGE"; return c; },
};
const PERTURB_MIS = { dropPlural: "MIS05", addPlural: "MIS05", movePlural: "MIS05",
  flipTense: "MIS03", dropTense: "MIS05", flipDirection: "MIS01", dropNeg: "MIS10",
  swapRoles: "MIS04", swapRecipient: "MIS08", moveProperty: "MIS09", flipProperty: "MIS09" };

let AUTO_ID = 0;
function makeDecode(spec, cfg) {
  const correct = gloss(spec);
  const opts = [{ id: "c0", label: correct }];
  const misMap = {};
  const order = cfg.perturbs || ["dropPlural", "flipTense", "swapRoles", "flipDirection", "dropNeg", "moveProperty", "addPlural", "dropTense"];
  for (const p of order) {
    if (opts.length >= (cfg.choices || 3)) break;
    const alt = PERTURB[p] && PERTURB[p](spec);
    if (!alt) continue;
    const g = gloss(alt);
    if (opts.some((o) => o.label === g)) continue;
    const id = "d" + opts.length;
    opts.push({ id, label: g });
    misMap[id] = PERTURB_MIS[p];
  }
  if (opts.length < 2) return null;
  return {
    id: cfg.id || `auto_dec_${AUTO_ID++}`, type: cfg.type || "decode",
    primaryNode: cfg.node, supportingNodes: cfg.support || [], prerequisites: cfg.pre || [],
    evidenceType: cfg.evidence || "application",
    prompt: cfg.prompt || "Decode this fragment.",
    stimulus: { kind: "sequence", value: glyphs(spec) },
    choices: opts, correctAnswer: "c0", misconceptionMap: misMap,
    feedbackCorrect: cfg.ok, feedbackIncorrect: cfg.no, spec,
  };
}

function makeSelection(spec, cfg) {
  const opts = [{ id: "c0", glyphs: glyphs(spec) }];
  const misMap = {};
  for (const p of (cfg.perturbs || ["flipTense", "swapRoles", "dropPlural", "flipDirection", "dropNeg", "moveProperty"])) {
    if (opts.length >= (cfg.choices || 3)) break;
    const alt = PERTURB[p] && PERTURB[p](spec);
    if (!alt) continue;
    const g = glyphs(alt);
    if (opts.some((o) => o.glyphs.join() === g.join())) continue;
    const id = "d" + opts.length;
    opts.push({ id, glyphs: g });
    misMap[id] = PERTURB_MIS[p];
  }
  if (opts.length < 2) return null;
  return {
    id: cfg.id || `auto_sel_${AUTO_ID++}`, type: "selection",
    primaryNode: cfg.node, supportingNodes: cfg.support || [], prerequisites: cfg.pre || [],
    evidenceType: cfg.evidence || "application",
    prompt: `Which signal means: ${gloss(spec)}?`,
    choices: opts, correctAnswer: "c0", misconceptionMap: misMap,
    feedbackCorrect: cfg.ok, feedbackIncorrect: cfg.no, spec,
  };
}

function makeGeneration(spec, cfg) {
  const answer = glyphs(spec);
  const pool = [...new Set([...answer, ...(cfg.decoys || [])])];
  return {
    id: cfg.id || `auto_gen_${AUTO_ID++}`, type: "generation",
    primaryNode: cfg.node || "N37", supportingNodes: cfg.support || [], prerequisites: cfg.pre || [],
    evidenceType: "generation",
    prompt: `Build the signal that means: ${gloss(spec)}.`,
    pool, correctSequence: answer,
    feedbackCorrect: cfg.ok || "Producing it is harder than reading it. That held.",
    feedbackIncorrect: cfg.no || "Useful signal. Check each mark against the English.", spec,
  };
}

/* ================================ item bank ================================= */

const nn = (n, p, prop) => ({ n, p: !!p, prop: prop || null });
const vv = (g, m = {}) => ({ g, past: !!m.past, fut: !!m.fut, neg: !!m.neg, rot: !!m.rot });
const T = (glyphs, label) => ({ glyphs, label });

const HAND = [
  /* ------------------------------ placement (3) --------------------------- */
  { id: "pl_lexical", type: "selection", placement: true, primaryNode: "N05",
    supportingNodes: ["N01", "N03", "N09"], prerequisites: [], evidenceType: "recognition",
    examples: [T("PERSON", "person"), T("MOVE", "move"), T("HOME", "place")],
    prompt: "Which signal means PLACE?",
    choices: [{ id: "a", glyphs: ["PERSON"] }, { id: "b", glyphs: ["MOVE"] },
      { id: "c", glyphs: ["HOME"] }, { id: "d", glyphs: ["TAKE"] }],
    correctAnswer: "c",
    feedbackCorrect: "Held after one exposure.",
    feedbackIncorrect: "Useful signal. We will come back to that one." },

  { id: "pl_morph", type: "transfer", placement: true, primaryNode: "N15",
    supportingNodes: ["N02", "N03", "N07"], prerequisites: [], evidenceType: "inference",
    examples: [T("PERSON", "person"), T("PERSON+p", "people"), T("OBJECT", "object")],
    prompt: "What do you think this means?",
    stimulus: { kind: "glyph", value: "OBJECT+p" },
    choices: [{ id: "a", label: "object" }, { id: "b", label: "objects" },
      { id: "c", label: "people" }, { id: "d", label: "two people" }],
    correctAnswer: "b", misconceptionMap: { a: "MIS05", c: "MIS02", d: "MIS02" },
    feedbackCorrect: "You moved the marks onto a symbol nobody showed you that way.",
    feedbackIncorrect: "Useful signal. The two dots did the same work on both symbols." },

  { id: "pl_syntax", type: "decode", placement: true, primaryNode: "N24",
    supportingNodes: ["N22", "N23", "N03", "N04", "N10"], prerequisites: [], evidenceType: "inference",
    examples: [T("PERSON SEE OBJECT", "the person sees the object")],
    prompt: "What do you think this signal means?",
    stimulus: { kind: "sequence", value: ["CREATURE", "SEE", "PERSON"] },
    choices: [{ id: "a", label: "the person sees the creature" },
      { id: "b", label: "the creature sees the person" },
      { id: "c", label: "the creature is a person" },
      { id: "d", label: "the person and creature see" }],
    correctAnswer: "b", misconceptionMap: { a: "MIS04", c: "MIS07", d: "MIS07" },
    feedbackCorrect: "You read the order, not the words.",
    feedbackIncorrect: "Useful signal. Position is carrying meaning here." },

  /* ------------------------------- teach (14) ----------------------------- */
  { id: "tc_person", type: "teach", primaryNode: "N03", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means PERSON.", stimulus: { kind: "glyph", value: "PERSON" } },
  { id: "tc_creature", type: "teach", primaryNode: "N04", prerequisites: [], evidenceType: "recognition",
    prompt: "This one means CREATURE. Notice what it shares with PERSON.", stimulus: { kind: "glyph", value: "CREATURE" } },
  { id: "tc_home", type: "teach", primaryNode: "N05", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means HOME.", stimulus: { kind: "glyph", value: "HOME" } },
  { id: "tc_water", type: "teach", primaryNode: "N06", prerequisites: [], evidenceType: "recognition",
    prompt: "This one means WATER.", stimulus: { kind: "glyph", value: "WATER" } },
  { id: "tc_object", type: "teach", primaryNode: "N07", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means OBJECT.", stimulus: { kind: "glyph", value: "OBJECT" } },
  { id: "tc_food", type: "teach", primaryNode: "N08", prerequisites: [], evidenceType: "recognition",
    prompt: "This one means FOOD.", stimulus: { kind: "glyph", value: "FOOD" } },
  { id: "tc_move", type: "teach", primaryNode: "N09", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means MOVE, in the sense of going away.", stimulus: { kind: "glyph", value: "MOVE" } },
  { id: "tc_see", type: "teach", primaryNode: "N10", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means SEE.", stimulus: { kind: "glyph", value: "SEE" } },
  { id: "tc_give", type: "teach", primaryNode: "N11", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means GIVE. The dot sits away from the bar.", stimulus: { kind: "glyph", value: "GIVE" } },
  { id: "tc_take", type: "teach", primaryNode: "N12", prerequisites: [], evidenceType: "recognition",
    prompt: "This one means TAKE. Compare it with GIVE.", stimulus: { kind: "glyph", value: "TAKE" } },
  { id: "tc_large", type: "teach", primaryNode: "N13", prerequisites: [], evidenceType: "recognition",
    prompt: "This signal means LARGE.", stimulus: { kind: "glyph", value: "LARGE" } },
  { id: "tc_plural", type: "teach", primaryNode: "N15", prerequisites: ["N03"], evidenceType: "recognition",
    prompt: "Two dots above a noun make it more than one. This is people.",
    stimulus: { kind: "glyph", value: "PERSON+p" } },
  { id: "tc_past", type: "teach", primaryNode: "N17", prerequisites: ["N10"], evidenceType: "recognition",
    prompt: "A mark on the left of an action means it already happened. This is saw.",
    stimulus: { kind: "glyph", value: "SEE+past" } },
  { id: "tc_neg", type: "teach", primaryNode: "N20", prerequisites: ["N10"], evidenceType: "recognition",
    prompt: "A bar beneath an action cancels it. This is does not see.",
    stimulus: { kind: "glyph", value: "SEE+neg" } },

  /* --------------------------- vocabulary items (16) ---------------------- */
  ...[["N03", "PERSON", "person", ["creature", "object", "home"]],
      ["N04", "CREATURE", "creature", ["person", "water", "food"]],
      ["N05", "HOME", "home", ["water", "object", "person"]],
      ["N06", "WATER", "water", ["home", "food", "object"]],
      ["N07", "OBJECT", "object", ["food", "home", "creature"]],
      ["N08", "FOOD", "food", ["object", "water", "give"]],
      ["N09", "MOVE", "go", ["see", "give", "take"]],
      ["N10", "SEE", "see", ["go", "take", "large"]],
      ["N11", "GIVE", "give", ["take", "see", "go"]],
      ["N12", "TAKE", "take", ["give", "go", "small"]],
      ["N13", "LARGE", "large", ["small", "object", "see"]],
      ["N14", "SMALL", "small", ["large", "food", "take"]]].map(([node, g, right, wrong]) => ({
    id: `rc_${node}`, type: "recognition", primaryNode: node, prerequisites: [], evidenceType: "recognition",
    prompt: "What does this signal mean?", stimulus: { kind: "glyph", value: g },
    choices: [{ id: "a", label: wrong[0] }, { id: "b", label: right }, { id: "c", label: wrong[1] }, { id: "d", label: wrong[2] }],
    correctAnswer: "b",
    feedbackCorrect: "That one is holding.",
    feedbackIncorrect: `Useful signal. That form is ${right}.`,
  })),
  ...[["N03", "PERSON", ["CREATURE", "OBJECT"]], ["N05", "HOME", ["WATER", "OBJECT"]],
      ["N09", "MOVE", ["SEE", "GIVE"]], ["N11", "GIVE", ["TAKE", "MOVE"]]].map(([node, g, wrong]) => ({
    id: `sl_${node}`, type: "selection", primaryNode: node, prerequisites: [], evidenceType: "recognition",
    prompt: `Which signal means ${LEX[g] ? LEX[g].sg.toUpperCase() : (g === "MOVE" ? "GO" : g)}?`,
    choices: [{ id: "a", glyphs: [wrong[0]] }, { id: "b", glyphs: [g] }, { id: "c", glyphs: [wrong[1]] }],
    correctAnswer: "b",
    feedbackCorrect: "Found from the meaning as well as the shape.",
    feedbackIncorrect: "Useful signal. Going from meaning back to symbol is the harder direction.",
  })),

  /* -------------------------- discrimination (12) ------------------------- */
  { id: "ct_dir_a", type: "contrast", primaryNode: "N16", supportingNodes: ["N09"],
    prerequisites: ["N09"], evidenceType: "discrimination",
    prompt: "Which of these means COMES TOWARD?",
    choices: [{ id: "a", glyphs: ["MOVE"] }, { id: "b", glyphs: ["MOVE+r"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS01" },
    feedbackCorrect: "Same symbol, opposite orientation, opposite meaning.",
    feedbackIncorrect: "Useful signal. You have the action. The direction is the part that flipped." },
  { id: "ct_dir_b", type: "contrast", primaryNode: "N16", supportingNodes: ["N09"],
    prerequisites: ["N09"], evidenceType: "discrimination",
    prompt: "Which of these means GOES AWAY?",
    choices: [{ id: "a", glyphs: ["MOVE+r"] }, { id: "b", glyphs: ["MOVE"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS01" },
    feedbackCorrect: "The distinction is sharpening.",
    feedbackIncorrect: "Useful signal. The long arm leads the way the movement runs." },
  { id: "ct_tense_a", type: "contrast", primaryNode: "N19", supportingNodes: ["N17", "N18", "N10"],
    prerequisites: ["N17", "N18"], evidenceType: "discrimination",
    prompt: "Which one means SAW?",
    choices: [{ id: "a", glyphs: ["SEE+past"] }, { id: "b", glyphs: ["SEE+fut"] }],
    correctAnswer: "a", misconceptionMap: { b: "MIS03" },
    feedbackCorrect: "Left is behind you.",
    feedbackIncorrect: "Useful signal. The symbol is right. The side of the mark is what changed." },
  { id: "ct_tense_b", type: "contrast", primaryNode: "N19", supportingNodes: ["N17", "N18", "N09"],
    prerequisites: ["N17", "N18"], evidenceType: "discrimination",
    prompt: "Which one means WILL GO?",
    choices: [{ id: "a", glyphs: ["MOVE+past"] }, { id: "b", glyphs: ["MOVE+fut"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS03" },
    feedbackCorrect: "That distinction is getting stronger.",
    feedbackIncorrect: "Useful signal. Right side is the one that has not happened yet." },
  { id: "ct_tense_c", type: "contrast", primaryNode: "N19", supportingNodes: ["N17", "N18"],
    prerequisites: ["N17", "N18"], evidenceType: "discrimination",
    prompt: "Which of these already happened?",
    choices: [{ id: "a", glyphs: ["GIVE+fut"] }, { id: "b", glyphs: ["GIVE+past"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS03" },
    feedbackCorrect: "Held, on a verb you had not used it with.",
    feedbackIncorrect: "Useful signal. Left of the action means it is behind." },
  { id: "ct_plural_a", type: "contrast", primaryNode: "N15", supportingNodes: ["N04"],
    prerequisites: ["N04"], evidenceType: "discrimination",
    prompt: "Which one means CREATURES?",
    choices: [{ id: "a", glyphs: ["CREATURE"] }, { id: "b", glyphs: ["CREATURE+p"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS05" },
    feedbackCorrect: "The dots are doing the work.",
    feedbackIncorrect: "Useful signal. The marks above the symbol change the number." },
  { id: "ct_neg_a", type: "contrast", primaryNode: "N20", supportingNodes: ["N09"],
    prerequisites: ["N20"], evidenceType: "discrimination",
    prompt: "Which one means DOES NOT GO?",
    choices: [{ id: "a", glyphs: ["MOVE"] }, { id: "b", glyphs: ["MOVE+neg"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS10" },
    feedbackCorrect: "The bar underneath cancels the action.",
    feedbackIncorrect: "Useful signal. Look underneath the symbol, not above it." },
  { id: "ct_neg_b", type: "contrast", primaryNode: "N21", supportingNodes: ["N20", "N17"],
    prerequisites: ["N20", "N17"], evidenceType: "discrimination",
    prompt: "Which one means DID NOT SEE?",
    choices: [{ id: "a", glyphs: ["SEE+past+neg"] }, { id: "b", glyphs: ["SEE+neg"] }, { id: "c", glyphs: ["SEE+past"] }],
    correctAnswer: "a", misconceptionMap: { b: "MIS05", c: "MIS10" },
    feedbackCorrect: "Two marks at once, both read.",
    feedbackIncorrect: "Useful signal. That meaning needs two separate marks, not one." },
  { id: "ct_size_a", type: "contrast", primaryNode: "N14", supportingNodes: ["N13"],
    prerequisites: ["N13"], evidenceType: "discrimination",
    prompt: "One of these means LARGE. Which one means SMALL?",
    choices: [{ id: "a", glyphs: ["LARGE"] }, { id: "b", glyphs: ["SMALL"] }],
    correctAnswer: "b", misconceptionMap: {},
    feedbackCorrect: "You read the family, not the word — same shape, different size.",
    feedbackIncorrect: "Useful signal. Same construction, drawn large or drawn small." },
  { id: "ct_giveTake", type: "contrast", primaryNode: "N12", supportingNodes: ["N11"],
    prerequisites: ["N11"], evidenceType: "discrimination",
    prompt: "One of these means GIVE. Which one means TAKE?",
    choices: [{ id: "a", glyphs: ["GIVE"] }, { id: "b", glyphs: ["TAKE"] }],
    correctAnswer: "b", misconceptionMap: {},
    feedbackCorrect: "You used the mirror rather than memorising a new word.",
    feedbackIncorrect: "Useful signal. The two forms are mirrored. The dot marks where the thing ends up." },
  { id: "ct_order_a", type: "contrast", primaryNode: "N22", supportingNodes: ["N03", "N10"],
    prerequisites: ["N03", "N10"], evidenceType: "discrimination",
    prompt: "Which one means THE PERSON SEES?",
    choices: [{ id: "a", glyphs: ["SEE", "PERSON"] }, { id: "b", glyphs: ["PERSON", "SEE"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS04" },
    feedbackCorrect: "Doer first.",
    feedbackIncorrect: "You recognised both symbols. Their order is the part to reconsider." },
  { id: "ct_prop_a", type: "contrast", primaryNode: "N25", supportingNodes: ["N13", "N07"],
    prerequisites: ["N13", "N07"], evidenceType: "discrimination",
    prompt: "Which one means THE LARGE OBJECT?",
    choices: [{ id: "a", glyphs: ["OBJECT", "LARGE"] }, { id: "b", glyphs: ["LARGE", "OBJECT"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS09" },
    feedbackCorrect: "The size mark leads.",
    feedbackIncorrect: "Useful signal. The description comes before the thing described." },

  /* ---------------------------- rule inference (8) ------------------------ */
  { id: "in_plural", type: "inference", primaryNode: "N15", supportingNodes: ["N03", "N04"],
    prerequisites: ["N03"], evidenceType: "inference",
    examples: [T("PERSON+p", "people"), T("CREATURE+p", "creatures")],
    prompt: "What are the two dots doing?",
    choices: [{ id: "a", label: "naming a different thing entirely" },
      { id: "b", label: "making the symbol more than one" },
      { id: "c", label: "putting the symbol in the past" }],
    correctAnswer: "b", misconceptionMap: { a: "MIS02", c: "MIS03" },
    feedbackCorrect: "A rule you can carry, not a word to memorise.",
    feedbackIncorrect: "Useful signal. The same dots appear on both, and both meanings changed the same way." },
  { id: "in_past", type: "inference", primaryNode: "N17", supportingNodes: ["N09", "N10"],
    prerequisites: ["N09"], evidenceType: "inference",
    examples: [T("MOVE+past", "went"), T("SEE+past", "saw")],
    prompt: "What is the mark on the left doing?",
    choices: [{ id: "a", label: "making the action a past one" },
      { id: "b", label: "making the action stronger" },
      { id: "c", label: "making it more than one" }],
    correctAnswer: "a", misconceptionMap: { c: "MIS06" },
    feedbackCorrect: "One mark, one job, across different actions.",
    feedbackIncorrect: "Useful signal. Compare the two English meanings again." },
  { id: "in_neg", type: "inference", primaryNode: "N20", supportingNodes: ["N09", "N10"],
    prerequisites: ["N09"], evidenceType: "inference",
    examples: [T("MOVE+neg", "does not go"), T("SEE+neg", "does not see")],
    prompt: "What is the bar underneath doing?",
    choices: [{ id: "a", label: "making the action happen twice" },
      { id: "b", label: "cancelling the action" },
      { id: "c", label: "moving the action into the past" }],
    correctAnswer: "b", misconceptionMap: { c: "MIS03" },
    feedbackCorrect: "You worked that one out from two examples.",
    feedbackIncorrect: "Useful signal. Both English meanings gained the same word." },
  { id: "in_size", type: "inference", primaryNode: "N14", supportingNodes: ["N13"],
    prerequisites: ["N13"], evidenceType: "inference",
    examples: [T("LARGE", "large")],
    prompt: "You have seen only one of these. What is the other most likely to mean?",
    stimulus: { kind: "glyph", value: "SMALL" },
    choices: [{ id: "a", label: "small" }, { id: "b", label: "very large" },
      { id: "c", label: "many" }, { id: "d", label: "not large" }],
    correctAnswer: "a", misconceptionMap: { c: "MIS02", d: "MIS10" },
    feedbackCorrect: "You inferred that from the shape family, untaught.",
    feedbackIncorrect: "Useful signal. The two forms are built the same way, opened opposite directions." },
  { id: "in_take", type: "inference", primaryNode: "N12", supportingNodes: ["N11"],
    prerequisites: ["N11"], evidenceType: "inference",
    examples: [T("GIVE", "give")],
    prompt: "This is the mirror of GIVE. What is it most likely to mean?",
    stimulus: { kind: "glyph", value: "TAKE" },
    choices: [{ id: "a", label: "give again" }, { id: "b", label: "take" },
      { id: "c", label: "do not give" }, { id: "d", label: "gave" }],
    correctAnswer: "b", misconceptionMap: { c: "MIS10", d: "MIS03" },
    feedbackCorrect: "You read the relationship rather than learning a new word.",
    feedbackIncorrect: "Useful signal. The dot moved to the other side. So did the meaning." },
  { id: "in_creature", type: "inference", primaryNode: "N04", supportingNodes: ["N03"],
    prerequisites: ["N03"], evidenceType: "inference",
    examples: [T("PERSON", "person")],
    prompt: "This form shares its construction with PERSON. What is it most likely to be?",
    stimulus: { kind: "glyph", value: "CREATURE" },
    choices: [{ id: "a", label: "another kind of living thing" }, { id: "b", label: "a place" },
      { id: "c", label: "an action" }, { id: "d", label: "two people" }],
    correctAnswer: "a", misconceptionMap: { d: "MIS02" },
    feedbackCorrect: "Same family, so the same kind of meaning.",
    feedbackIncorrect: "Useful signal. Shapes built alike tend to mean things of the same kind." },
  { id: "in_marker", type: "inference", primaryNode: "N28", supportingNodes: ["N27", "N11"],
    prerequisites: ["N27"], evidenceType: "inference",
    examples: [T("PERSON GIVE FOOD CREATURE", "the person gives the food to the creature"),
      T("PERSON GIVE FOOD TO CREATURE", "the person gives the food to the creature")],
    prompt: "Both signals mean the same thing. What is the extra mark doing?",
    choices: [{ id: "a", label: "naming who receives, so position matters less" },
      { id: "b", label: "making the food plural" },
      { id: "c", label: "putting the giving in the past" }],
    correctAnswer: "a", misconceptionMap: { b: "MIS02", c: "MIS03" },
    feedbackCorrect: "A rule you had been relying on just became optional.",
    feedbackIncorrect: "Useful signal. Nothing about the meaning changed, so the mark is doing structural work." },
  { id: "in_query", type: "inference", primaryNode: "N38", supportingNodes: ["N24"],
    prerequisites: ["N33"], evidenceType: "inference",
    examples: [T("PERSON SEE OBJECT", "the person sees the object"),
      T("PERSON SEE OBJECT QUERY", "does the person see the object?")],
    prompt: "What does the mark at the end do?",
    choices: [{ id: "a", label: "turns the statement into a question" },
      { id: "b", label: "makes the action happen later" },
      { id: "c", label: "cancels the action" }],
    correctAnswer: "a", misconceptionMap: { b: "MIS03", c: "MIS10" },
    feedbackCorrect: "You read a whole construction from one pair of examples.",
    feedbackIncorrect: "Useful signal. Compare the two English sentences word for word." },

  /* ---------------------------- remediation (12) -------------------------- */
  { id: "rm_tense_1", type: "remediation", primaryNode: "N19", supportingNodes: ["N17", "N18"],
    prerequisites: ["N17"], evidenceType: "discrimination", remediationFor: ["N17", "N18", "N19", "N31"],
    explain: "Look at where the time mark sits. Left of the action means it already happened. Right means it has not happened yet.",
    prompt: "So which one means WENT?",
    choices: [{ id: "a", glyphs: ["MOVE+past"] }, { id: "b", glyphs: ["MOVE+fut"] }],
    correctAnswer: "a", misconceptionMap: { b: "MIS03" },
    feedbackCorrect: "Good. Back to it.", feedbackIncorrect: "Still slippery. We will come back to this." },
  { id: "rm_tense_2", type: "remediation", primaryNode: "N19", supportingNodes: ["N17", "N18"],
    prerequisites: ["N18"], evidenceType: "discrimination", remediationFor: ["N17", "N18", "N19", "N31"],
    explain: "One more time. Left is behind you. Right is ahead of you.",
    prompt: "Which one means WILL TAKE?",
    choices: [{ id: "a", glyphs: ["TAKE+fut"] }, { id: "b", glyphs: ["TAKE+past"] }],
    correctAnswer: "a", misconceptionMap: { b: "MIS03" },
    feedbackCorrect: "That distinction is getting stronger.", feedbackIncorrect: "Noted. We will set this aside for a while." },
  { id: "rm_dir_1", type: "remediation", primaryNode: "N16", supportingNodes: ["N09"],
    prerequisites: ["N09"], evidenceType: "discrimination", remediationFor: ["N16", "N30"],
    explain: "The long arm shows which way the movement runs. Turn the symbol around and it runs the other way.",
    prompt: "Which one means COMES TOWARD?",
    choices: [{ id: "a", glyphs: ["MOVE+r"] }, { id: "b", glyphs: ["MOVE"] }],
    correctAnswer: "a", misconceptionMap: { b: "MIS01" },
    feedbackCorrect: "Good. Back to it.", feedbackIncorrect: "Still slippery. We will come back to this." },
  { id: "rm_plural_1", type: "remediation", primaryNode: "N15", supportingNodes: ["N07"],
    prerequisites: ["N07"], evidenceType: "discrimination", remediationFor: ["N15", "N29"],
    explain: "The two dots are not a new symbol. They are a change of number, and they sit on any noun.",
    prompt: "Which one means OBJECTS?",
    choices: [{ id: "a", glyphs: ["OBJECT"] }, { id: "b", glyphs: ["OBJECT+p"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS05" },
    feedbackCorrect: "Good. Back to it.", feedbackIncorrect: "Still slippery. We will come back to this." },
  { id: "rm_order_1", type: "remediation", primaryNode: "N22", supportingNodes: ["N03", "N09"],
    prerequisites: ["N03", "N09"], evidenceType: "discrimination", remediationFor: ["N22", "N23", "N24"],
    explain: "Messages read left to right. The one doing something comes first.",
    prompt: "Which one means THE PERSON GOES?",
    choices: [{ id: "a", glyphs: ["MOVE", "PERSON"] }, { id: "b", glyphs: ["PERSON", "MOVE"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS04" },
    feedbackCorrect: "Good. Back to it.", feedbackIncorrect: "Still slippery. We will come back to this." },
  { id: "rm_neg_1", type: "remediation", primaryNode: "N20", supportingNodes: ["N10"],
    prerequisites: ["N10"], evidenceType: "discrimination", remediationFor: ["N20", "N32", "N21"],
    explain: "Marks above change the noun. A mark below the action cancels it. Different places, different jobs.",
    prompt: "Which one means DOES NOT SEE?",
    choices: [{ id: "a", glyphs: ["SEE+neg"] }, { id: "b", glyphs: ["SEE"] }],
    correctAnswer: "a", misconceptionMap: { b: "MIS10" },
    feedbackCorrect: "Good. Back to it.", feedbackIncorrect: "Still slippery. We will come back to this." },
  { id: "rm_prop_1", type: "remediation", primaryNode: "N25", supportingNodes: ["N13"],
    prerequisites: ["N13", "N04"], evidenceType: "discrimination", remediationFor: ["N25"],
    explain: "The size mark is written before the noun it describes, the way it is said in English.",
    prompt: "Which one means THE SMALL CREATURE?",
    choices: [{ id: "a", glyphs: ["CREATURE", "SMALL"] }, { id: "b", glyphs: ["SMALL", "CREATURE"] }],
    correctAnswer: "b", misconceptionMap: { a: "MIS09" },
    feedbackCorrect: "Good. Back to it.", feedbackIncorrect: "Still slippery. We will come back to this." },
  { id: "rm_recip_1", type: "remediation", primaryNode: "N27", supportingNodes: ["N11", "N08"],
    prerequisites: ["N11", "N08"], evidenceType: "application", remediationFor: ["N27", "N28"],
    explain: "In a giving message the order is: who gives, gives, what is given, who receives.",
    prompt: "What does this mean?",
    stimulus: { kind: "sequence", value: ["PERSON", "GIVE", "FOOD", "CREATURE"] },
    choices: [{ id: "a", label: "the person gives the food to the creature" },
      { id: "b", label: "the person gives the creature to the food" }],
    correctAnswer: "a", misconceptionMap: { b: "MIS08" },
    feedbackCorrect: "Both roles in the right slots.", feedbackIncorrect: "Noted. We will set this aside for a while." },
];

/* ------------------- generated message items (~50) ---------------------- */

const single = (id, code, right, wrongs, node, support, pre, mis, ok, no) => ({
  id, type: "transfer", primaryNode: node, supportingNodes: support, prerequisites: pre,
  evidenceType: "transfer", prompt: "You have not seen this exact form before. What does it mean?",
  stimulus: { kind: "glyph", value: code },
  choices: [{ id: "c0", label: right }, ...wrongs.map((w, i) => ({ id: "d" + i, label: w }))],
  correctAnswer: "c0",
  misconceptionMap: Object.fromEntries(wrongs.map((w, i) => ["d" + i, mis[i]]).filter(([, m]) => m)),
  feedbackCorrect: ok, feedbackIncorrect: no,
});

const GEN = [
  /* --- core syntax --- */
  makeDecode({ subj: nn("PERSON"), v: vv("MOVE") },
    { id: "d_actor_1", node: "N22", support: ["N03", "N09"], pre: ["N03", "N09"],
      ok: "Two symbols read as one message.", no: "Useful signal. Read it left to right, doer first." }),
  makeDecode({ subj: nn("CREATURE"), v: vv("SEE") },
    { id: "d_actor_2", node: "N22", support: ["N04", "N10"], pre: ["N04", "N10"],
      ok: "Doer first, again.", no: "Useful signal. The first symbol is the one acting." }),
  makeDecode({ subj: nn("PERSON"), v: vv("MOVE"), obj: nn("HOME") },
    { id: "d_dest_1", node: "N26", support: ["N05", "N09", "N22"], pre: ["N05", "N09", "N03"],
      ok: "Movement took a destination.", no: "Useful signal. The last symbol is where the movement ends." }),
  makeDecode({ subj: nn("CREATURE"), v: vv("MOVE"), obj: nn("WATER") },
    { id: "d_dest_2", node: "N26", support: ["N06", "N09"], pre: ["N06", "N09", "N04"],
      ok: "Same structure, different destination.", no: "Useful signal. Check which symbol is the place." }),
  makeDecode({ subj: nn("PERSON"), v: vv("SEE"), obj: nn("OBJECT") },
    { id: "d_full_1", node: "N24", support: ["N03", "N10", "N07", "N23"], pre: ["N03", "N10", "N07"],
      ok: "Three symbols, one meaning. The order carried it.", no: "Useful signal. Doer, action, then what it lands on." }),
  makeDecode({ subj: nn("CREATURE"), v: vv("SEE"), obj: nn("FOOD") },
    { id: "d_full_2", node: "N24", support: ["N04", "N08"], pre: ["N04", "N10", "N08"],
      ok: "New words, same structure.", no: "Useful signal. The structure has not changed, only the words." }),
  makeDecode({ subj: nn("PERSON"), v: vv("TAKE"), obj: nn("OBJECT") },
    { id: "d_full_3", node: "N23", support: ["N12", "N07"], pre: ["N12", "N07", "N03"],
      ok: "The target followed the action.", no: "Useful signal. What the action lands on comes after it." }),

  /* --- recipient --- */
  makeDecode({ subj: nn("PERSON"), v: vv("GIVE"), obj: nn("FOOD"), recip: nn("CREATURE") },
    { id: "d_recip_1", node: "N27", support: ["N11", "N08", "N04"], pre: ["N11", "N08", "N04"],
      perturbs: ["swapRecipient", "swapRoles", "dropPlural"],
      ok: "Four slots, all in the right place.", no: "Useful signal. One of those is the thing given, the other is who receives it." }),
  makeDecode({ subj: nn("CREATURE"), v: vv("GIVE"), obj: nn("OBJECT"), recip: nn("PERSON") },
    { id: "d_recip_2", node: "N27", support: ["N11", "N07", "N03"], pre: ["N11", "N07", "N03"],
      perturbs: ["swapRecipient", "swapRoles", "addPlural"],
      ok: "You kept the two roles apart.", no: "Useful signal. Third position is the thing, fourth is the receiver." }),
  makeDecode({ subj: nn("PERSON"), v: vv("GIVE"), obj: nn("FOOD"), recip: nn("CREATURE"), marker: true },
    { id: "d_marker_1", node: "N28", support: ["N27", "N11"], pre: ["N27"],
      perturbs: ["swapRecipient", "addPlural", "flipTense"],
      ok: "The marker told you the role, so you did not have to count positions.",
      no: "Useful signal. The small mark names the receiver wherever it sits." }),

  /* --- plural in context --- */
  makeDecode({ subj: nn("PERSON", true), v: vv("SEE"), obj: nn("OBJECT") },
    { id: "d_plu_1", node: "N29", support: ["N15", "N03", "N07"], pre: ["N15", "N03", "N10"],
      perturbs: ["dropPlural", "movePlural", "swapRoles"],
      ok: "Number survived into the sentence.", no: "Useful signal. Only one symbol in there carries dots." }),
  makeDecode({ subj: nn("PERSON"), v: vv("SEE"), obj: nn("OBJECT", true) },
    { id: "d_plu_2", node: "N29", support: ["N15", "N07"], pre: ["N15", "N07", "N10"],
      perturbs: ["movePlural", "dropPlural", "swapRoles"],
      ok: "The dots were on the second noun that time, and you caught it.",
      no: "Useful signal. Check every symbol for marks, not just the first." }),
  makeDecode({ subj: nn("CREATURE", true), v: vv("MOVE"), obj: nn("WATER") },
    { id: "d_plu_3", node: "N29", support: ["N15", "N04", "N06"], pre: ["N15", "N04", "N09"],
      perturbs: ["dropPlural", "flipDirection", "addPlural"],
      ok: "Number rule, new noun, inside a message.", no: "Useful signal. Look above the first symbol." }),

  /* --- direction in context --- */
  makeDecode({ subj: nn("PERSON"), v: vv("MOVE", { rot: true }), obj: nn("HOME") },
    { id: "d_dir_1", node: "N30", support: ["N16", "N05"], pre: ["N16", "N05", "N03"],
      perturbs: ["flipDirection", "addPlural", "flipTense"],
      ok: "Direction survived being buried in a sentence.",
      no: "Useful signal. You remembered the action, but its direction changed." }),
  makeDecode({ subj: nn("CREATURE", true), v: vv("MOVE", { rot: true }), obj: nn("WATER") },
    { id: "d_dir_2", node: "N30", support: ["N16", "N15", "N06"], pre: ["N16", "N15", "N06"],
      perturbs: ["flipDirection", "dropPlural", "flipTense"],
      ok: "Number and direction at once.", no: "Useful signal. Two separate marks are changing the meaning here." }),

  /* --- tense in context --- */
  makeDecode({ subj: nn("PERSON"), v: vv("SEE", { past: true }), obj: nn("OBJECT") },
    { id: "d_ten_1", node: "N31", support: ["N17", "N10", "N07"], pre: ["N17", "N10", "N07"],
      perturbs: ["flipTense", "dropTense", "swapRoles"],
      ok: "The mark on the left moved the whole message into the past.",
      no: "Useful signal. There is a small mark beside the action. It changes when this happened." }),
  makeDecode({ subj: nn("PERSON"), v: vv("MOVE", { fut: true }), obj: nn("HOME") },
    { id: "d_ten_2", node: "N31", support: ["N18", "N09", "N05"], pre: ["N18", "N09", "N05"],
      perturbs: ["flipTense", "dropTense", "flipDirection"],
      ok: "Tense held up inside a three-part message.",
      no: "Useful signal. Look at which side of the action the mark sits on." }),
  makeDecode({ subj: nn("CREATURE", true), v: vv("GIVE", { past: true }), obj: nn("FOOD"), recip: nn("PERSON") },
    { id: "d_ten_3", node: "N35", support: ["N17", "N27", "N15"], pre: ["N17", "N27"],
      perturbs: ["flipTense", "swapRecipient", "dropPlural"],
      ok: "You moved the time rule onto a verb with a different structure.",
      no: "Useful signal. The time mark works the same way on giving as on seeing." }),

  /* --- negation in context --- */
  makeDecode({ subj: nn("PERSON"), v: vv("SEE", { neg: true }), obj: nn("OBJECT") },
    { id: "d_neg_1", node: "N32", support: ["N20", "N10"], pre: ["N20", "N10", "N07"],
      perturbs: ["dropNeg", "flipTense", "swapRoles"],
      ok: "The bar underneath cancelled the action inside a full message.",
      no: "Useful signal. Something beneath the action is changing it." }),
  makeDecode({ subj: nn("CREATURE"), v: vv("MOVE", { neg: true }), obj: nn("WATER") },
    { id: "d_neg_2", node: "N32", support: ["N20", "N09", "N06"], pre: ["N20", "N09", "N06"],
      perturbs: ["dropNeg", "flipDirection", "addPlural"],
      ok: "Negation held with a destination attached.", no: "Useful signal. Check underneath the action symbol." }),

  /* --- properties --- */
  makeDecode({ subj: nn("CREATURE", false, "LARGE"), v: vv("SEE"), obj: nn("PERSON") },
    { id: "d_prop_1", node: "N25", support: ["N13", "N04", "N03"], pre: ["N13", "N04", "N10"],
      perturbs: ["moveProperty", "flipProperty", "swapRoles"],
      ok: "The size mark attached to the right noun.",
      no: "Useful signal. The description belongs to whichever noun follows it." }),
  makeDecode({ subj: nn("PERSON"), v: vv("SEE"), obj: nn("OBJECT", false, "SMALL") },
    { id: "d_prop_2", node: "N25", support: ["N14", "N07"], pre: ["N14", "N07", "N10"],
      perturbs: ["moveProperty", "flipProperty", "addPlural"],
      ok: "You tracked which noun the description was sitting in front of.",
      no: "Useful signal. Look at what comes immediately after the size mark." }),

  /* --- multi-rule --- */
  makeDecode({ subj: nn("PERSON", true, "LARGE"), v: vv("SEE", { past: true }), obj: nn("OBJECT") },
    { id: "d_multi_1", node: "N33", support: ["N15", "N17", "N25", "N24"], pre: ["N15", "N17", "N24"],
      perturbs: ["dropPlural", "flipTense", "moveProperty"], choices: 4,
      ok: "Three rules at once, all held.", no: "Useful signal. Take the marks one at a time." }),
  makeDecode({ subj: nn("PERSON", true), v: vv("MOVE", { fut: true, neg: true }), obj: nn("HOME") },
    { id: "d_multi_2", node: "N33", support: ["N21", "N18", "N20", "N15"], pre: ["N21", "N24"],
      perturbs: ["dropNeg", "flipTense", "dropPlural"], choices: 4,
      ok: "Two marks on one action, plus number. All separate jobs.",
      no: "Useful signal. That action carries more than one mark." }),
  makeDecode({ subj: nn("PERSON", true, "SMALL"), v: vv("TAKE", { past: true }), obj: nn("OBJECT", true) },
    { id: "d_multi_3", node: "N33", support: ["N15", "N17", "N25", "N12"], pre: ["N15", "N17", "N25"],
      perturbs: ["dropPlural", "flipTense", "movePlural"], choices: 4,
      ok: "The same rule applied twice, plus a time mark.",
      no: "Useful signal. Two nouns in there, and both need checking." }),
  makeDecode({ subj: nn("CREATURE", true, "LARGE"), v: vv("GIVE", { past: true, neg: true }),
      obj: nn("FOOD"), recip: nn("PERSON", true), marker: true },
    { id: "d_multi_4", node: "N36", support: ["N21", "N27", "N28", "N25", "N15"], pre: ["N33", "N27"],
      perturbs: ["dropNeg", "flipTense", "swapRecipient", "dropPlural"], choices: 4,
      ok: "Nothing in that arrangement had been practised. You built it from rules.",
      no: "Useful signal. Five things are happening there. Find the one that slipped." }),
  makeDecode({ subj: nn("PERSON", true), v: vv("SEE", { fut: true }), obj: nn("OBJECT"), q: true },
    { id: "d_query_1", node: "N38", support: ["N18", "N15", "N24"], pre: ["N33"],
      perturbs: ["flipTense", "dropPlural", "dropTense"],
      ok: "The final mark changed the whole sentence type.",
      no: "Useful signal. The mark at the end is not attached to any single word." }),

  /* --- near / structural transfer on single forms --- */
  single("t_plu_creature", "CREATURE+p", "creatures", ["creature", "people", "two creatures"],
    "N34", ["N15", "N04"], ["N15", "N04"], ["MIS05", "MIS02", "MIS02"],
    "You applied the number rule to a noun you had not seen carrying dots.",
    "Useful signal. The two dots change number, on any noun."),
  single("t_plu_food", "FOOD+p", "food", ["a large food", "gives food", "one food"],
    "N34", ["N15", "N08"], ["N15", "N08"], ["MIS09", "MIS06", "MIS05"],
    "Some nouns look the same either way in English. The mark still means more than one.",
    "Useful signal. The dots above always change number."),
  single("t_past_give", "GIVE+past", "gave", ["will give", "does not give", "gives"],
    "N35", ["N17", "N11"], ["N17", "N11"], ["MIS03", "MIS10", "MIS05"],
    "You moved the time rule onto a verb with a different structure.",
    "Useful signal. The mark is on the left, so this is behind us."),
  single("t_neg_take", "TAKE+neg", "does not take", ["took", "will take", "takes"],
    "N34", ["N20", "N12"], ["N20", "N12"], ["MIS03", "MIS03", "MIS10"],
    "The cancelling bar travelled to a new verb.",
    "Useful signal. A mark underneath cancels, wherever it appears."),
  single("t_fut_move", "MOVE+fut", "will go", ["went", "does not go", "comes"],
    "N34", ["N18", "N09"], ["N18", "N09"], ["MIS03", "MIS10", "MIS01"],
    "That rule is portable now.", "Useful signal. Right side of the action means not yet."),
  single("t_comb_1", "SEE+past+neg", "did not see", ["will not see", "does not see", "saw"],
    "N21", ["N17", "N20"], ["N17", "N20"], ["MIS03", "MIS05", "MIS10"],
    "Two marks, two jobs, read together.",
    "Useful signal. There is a mark on the left and a bar below. Both count."),
];

const BUILD = [
  makeSelection({ subj: nn("PERSON", true), v: vv("MOVE") },
    { id: "s_1", node: "N29", support: ["N15", "N22"], pre: ["N15", "N22"],
      perturbs: ["dropPlural", "flipDirection", "addPlural"],
      ok: "Found from the meaning, not just recognised.", no: "Useful signal. More than one doer needs the number mark." }),
  makeSelection({ subj: nn("PERSON"), v: vv("SEE", { past: true }), obj: nn("OBJECT") },
    { id: "s_2", node: "N31", support: ["N17", "N24"], pre: ["N17", "N24"],
      perturbs: ["flipTense", "dropTense", "swapRoles"],
      ok: "Correct side, correct slot.", no: "Useful signal. Already happened puts the mark on the left." }),
  makeSelection({ subj: nn("CREATURE"), v: vv("MOVE", { rot: true }), obj: nn("HOME") },
    { id: "s_3", node: "N30", support: ["N16", "N26"], pre: ["N16", "N05", "N04"],
      perturbs: ["flipDirection", "flipTense", "addPlural"],
      ok: "You reached for the reversed form deliberately.", no: "Useful signal. Coming toward is the turned-around action." }),
  makeSelection({ subj: nn("PERSON"), v: vv("GIVE"), obj: nn("FOOD"), recip: nn("CREATURE", true) },
    { id: "s_4", node: "N27", support: ["N11", "N15"], pre: ["N27", "N15"],
      perturbs: ["swapRecipient", "dropPlural", "flipTense"],
      ok: "Four slots and a number mark, chosen rather than read.",
      no: "Useful signal. Watch which of the two nouns carries the dots." }),
  makeSelection({ subj: nn("CREATURE"), v: vv("SEE", { neg: true }), obj: nn("PERSON") },
    { id: "s_5", node: "N32", support: ["N20"], pre: ["N20", "N24"],
      perturbs: ["dropNeg", "swapRoles", "flipTense"],
      ok: "You placed the cancelling bar yourself.", no: "Useful signal. The bar goes underneath the action." }),

  makeGeneration({ subj: nn("PERSON"), v: vv("MOVE") },
    { id: "g_1", node: "N37", support: ["N22", "N03", "N09"], pre: ["N22"],
      decoys: ["PERSON+p", "SEE", "HOME"] }),
  makeGeneration({ subj: nn("PERSON"), v: vv("SEE") },
    { id: "g_0", node: "N37", support: ["N03", "N10"], pre: ["N03", "N10"],
      decoys: ["OBJECT", "PERSON+p", "MOVE"],
      ok: "Two symbols, in the right order, built rather than chosen." }),
  makeGeneration({ subj: nn("CREATURE", true), v: vv("MOVE") },
    { id: "g_0b", node: "N37", support: ["N15", "N04", "N09"], pre: ["N15", "N09"],
      decoys: ["CREATURE", "WATER", "MOVE+r"],
      ok: "You put the number mark on the doer yourself." }),
  makeGeneration({ subj: nn("PERSON", true), v: vv("SEE"), obj: nn("OBJECT") },
    { id: "g_2", node: "N37", support: ["N15", "N24"], pre: ["N24", "N15"],
      decoys: ["PERSON", "OBJECT+p", "SEE+past"],
      ok: "You chose which symbol carried the dots. That is the rule, not the word." }),
  makeGeneration({ subj: nn("PERSON"), v: vv("MOVE", { fut: true }), obj: nn("HOME") },
    { id: "g_3", node: "N37", support: ["N18", "N26"], pre: ["N24", "N18"],
      decoys: ["MOVE", "MOVE+past", "WATER"],
      ok: "Time mark on the correct side, in the correct slot." }),
  makeGeneration({ subj: nn("CREATURE"), v: vv("SEE", { neg: true }), obj: nn("FOOD") },
    { id: "g_4", node: "N37", support: ["N20", "N24"], pre: ["N24", "N20"],
      decoys: ["SEE", "SEE+past", "CREATURE+p"],
      ok: "You produced a cancelled action from scratch." }),
  makeGeneration({ subj: nn("PERSON"), v: vv("MOVE", { rot: true }), obj: nn("HOME") },
    { id: "g_5", node: "N37", support: ["N16", "N26"], pre: ["N16", "N22"],
      decoys: ["MOVE", "WATER", "PERSON+p"],
      ok: "You reached for the reversed form on purpose." }),
  makeGeneration({ subj: nn("PERSON", true, "LARGE"), v: vv("GIVE"), obj: nn("FOOD"), recip: nn("CREATURE") },
    { id: "g_6", node: "N37", support: ["N25", "N27", "N15"], pre: ["N27", "N25"],
      decoys: ["PERSON", "SMALL", "CREATURE+p", "GIVE+past"],
      ok: "Four roles and two modifiers, produced rather than recognised." }),
  makeGeneration({ subj: nn("CREATURE", true), v: vv("TAKE", { past: true }), obj: nn("OBJECT", true) },
    { id: "g_7", node: "N36", support: ["N15", "N17", "N12"], pre: ["N33"],
      decoys: ["CREATURE", "OBJECT", "TAKE", "TAKE+fut"],
      ok: "Same rule twice plus a time mark, all produced." }),
];


/* ------- reserved for the closing challenge, never served mid-session -------
   a graded ladder so the ending is integrative at whatever level the learner
   actually reached, rather than falling back to a naming question           */
const FINALE = [
  makeGeneration({ subj: nn("PERSON"), v: vv("MOVE") },
    { id: "f_gen_1", node: "N37", support: ["N03", "N09", "N22"], pre: ["N03", "N09"],
      decoys: ["PERSON+p", "SEE", "HOME"],
      ok: "Two symbols, in the right order, built rather than chosen." }),
  makeGeneration({ subj: nn("CREATURE"), v: vv("SEE") },
    { id: "f_gen_1b", node: "N37", support: ["N04", "N10", "N22"], pre: ["N04", "N10"],
      decoys: ["CREATURE+p", "MOVE", "OBJECT"],
      ok: "Two symbols, in the right order, built rather than chosen." }),
  makeGeneration({ subj: nn("CREATURE", true), v: vv("SEE"), obj: nn("OBJECT") },
    { id: "f_gen_2", node: "N37", support: ["N15", "N24", "N04"], pre: ["N24", "N15"],
      decoys: ["CREATURE", "OBJECT+p", "SEE+past", "MOVE"],
      ok: "You decided which symbol carried the marks. That is the rule, not the word." }),
  makeGeneration({ subj: nn("PERSON"), v: vv("MOVE", { past: true }), obj: nn("WATER") },
    { id: "f_gen_3", node: "N37", support: ["N17", "N26", "N06"], pre: ["N17", "N09", "N06"],
      decoys: ["MOVE", "MOVE+fut", "HOME", "PERSON+p"],
      ok: "Time mark on the correct side, destination in the correct slot." }),
  makeGeneration({ subj: nn("CREATURE", true, "LARGE"), v: vv("GIVE", { neg: true }),
      obj: nn("FOOD"), recip: nn("PERSON") },
    { id: "f_gen_4", node: "N36", support: ["N25", "N27", "N20", "N15"], pre: ["N27", "N20"],
      decoys: ["SMALL", "CREATURE", "GIVE", "GIVE+past", "PERSON+p", "TO"],
      ok: "Size, number, negation and four roles, all produced from nothing." }),

  makeDecode({ subj: nn("PERSON"), v: vv("SEE"), obj: nn("OBJECT") },
    { id: "f_dec_1", node: "N24", support: ["N03", "N10", "N07"], pre: ["N03", "N10", "N07"],
      prompt: "One last fragment.",
      ok: "Three symbols, one meaning, read cleanly.", no: "Useful signal. Doer, action, then what it lands on." }),
  makeDecode({ subj: nn("CREATURE", true), v: vv("MOVE", { past: true }), obj: nn("WATER") },
    { id: "f_dec_2", node: "N29", support: ["N15", "N17", "N26"], pre: ["N15", "N09", "N06"],
      prompt: "One last fragment.", perturbs: ["dropPlural", "flipTense", "flipDirection"],
      ok: "Number and time, held together at the end.", no: "Useful signal. Two separate marks are doing work there." }),
  makeDecode({ subj: nn("PERSON", true, "LARGE"), v: vv("SEE", { neg: true }), obj: nn("OBJECT", true) },
    { id: "f_dec_3", node: "N33", support: ["N25", "N20", "N15"], pre: ["N15", "N20", "N24"],
      prompt: "One last fragment.", choices: 4, perturbs: ["dropNeg", "dropPlural", "moveProperty", "movePlural"],
      ok: "Four rules at once, at the end of the session.", no: "Useful signal. Check every symbol, above and below." }),
  makeDecode({ subj: nn("CREATURE", true, "SMALL"), v: vv("GIVE", { past: true, neg: true }),
      obj: nn("FOOD"), recip: nn("PERSON", true), marker: true },
    { id: "f_dec_4", node: "N36", support: ["N27", "N28", "N21", "N25"], pre: ["N27", "N21"],
      prompt: "The hardest fragment in the sample.", choices: 4,
      perturbs: ["dropNeg", "flipTense", "swapRecipient", "dropPlural"],
      ok: "Nothing in that arrangement had been practised. You built it from rules.",
      no: "Useful signal. Five things are happening there. Find the one that slipped." }),
].filter(Boolean);

const ACTIVITIES = [...HAND, ...GEN.filter(Boolean), ...BUILD.filter(Boolean), ...FINALE];
const ACT_BY_ID = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]));
const PLACEMENT = ACTIVITIES.filter((a) => a.placement);
FINALE.forEach((a) => { a.finalOnly = a.type !== "generation"; });  // guided builds are practice now
const MAIN_BANK = ACTIVITIES.filter((a) => !a.placement && !a.finalOnly);


/* ====================== free-build grammar validator ========================
   For the closing task the learner composes anything they like, so the engine
   has to parse it, decide whether it is well formed, read it back in English,
   and work out which rules they used.
   --------------------------------------------------------------------------- */

const AGENTS = ["PERSON", "CREATURE"];
const THINGS = ["OBJECT", "FOOD"];
const NOUNS = [...AGENTS, ...PLACES, ...THINGS];
const VERBS = ["MOVE", "SEE", "GIVE", "TAKE"];
const PROPS = ["LARGE", "SMALL"];

const RULE_NODE = { order: "N22", target: "N23", plural: "N15", past: "N17", future: "N18",
  negation: "N20", direction: "N16", property: "N25", recipient: "N27", marker: "N28",
  question: "N38", combined: "N21" };
const RULE_LABEL = { order: "actor before action", target: "action before target",
  plural: "plural marking", past: "past tense", future: "future tense", negation: "negation",
  direction: "direction", property: "size before noun", recipient: "recipient structure",
  marker: "role marker", question: "question marker", combined: "two marks on one action" };

function validateSignal(codes) {
  const t = codes.map(parseGlyph);
  const bad = (msg) => ({ ok: false, error: msg });
  if (t.length < 2) return bad("A message needs at least someone and an action.");

  let i = 0;
  const rules = [];
  const takeNoun = () => {
    let prop = null;
    if (i < t.length && PROPS.includes(t[i].g)) { prop = t[i].g; i++; rules.push("property"); }
    if (i >= t.length || !NOUNS.includes(t[i].g)) {
      if (prop) return { err: "A size mark has to be followed by the thing it describes." };
      return { err: null, none: true };
    }
    const n = t[i]; i++;
    if (n.plural) rules.push("plural");
    if (n.past || n.fut || n.neg) return { err: "Time and negation marks belong on actions, not on nouns." };
    return { noun: { n: n.g, p: n.plural, prop } };
  };

  if (VERBS.includes(t[0].g)) return bad("The one doing the action has to come first.");
  const subj = takeNoun();
  if (subj.err) return bad(subj.err);
  if (subj.none) return bad("This needs to start with someone or something.");
  if (!AGENTS.includes(subj.noun.n)) return bad("A place or an object cannot be the one doing the action.");
  rules.push("order");

  if (i < t.length && PROPS.includes(t[i].g))
    return bad("A size mark goes before the noun it describes, not after it.");
  if (i >= t.length || !VERBS.includes(t[i].g)) return bad("There is no action in this message.");
  const vt = t[i]; i++;
  const v = { g: vt.g, past: vt.past, fut: vt.fut, neg: vt.neg, rot: vt.rot };
  if (v.rot && v.g !== "MOVE") return bad("Only the movement symbol changes meaning when it is reversed.");
  if (v.past && v.fut) return bad("An action cannot be both behind you and ahead of you.");
  if (vt.plural) return bad("The number marks belong on nouns, not on actions.");
  if (v.past) rules.push("past");
  if (v.fut) rules.push("future");
  if (v.neg) rules.push("negation");
  if (v.rot) rules.push("direction");
  if ([v.past, v.fut, v.neg].filter(Boolean).length >= 2) rules.push("combined");

  const spec = { subj: subj.noun, v };

  if (i < t.length && t[i].g !== "TO" && t[i].g !== "QUERY") {
    const obj = takeNoun();
    if (obj.err) return bad(obj.err);
    if (obj.none) return bad("There is a symbol in there that cannot sit where it is.");
    if (v.g === "MOVE" && !PLACES.includes(obj.noun.n))
      return bad("Movement goes to a place. That symbol is not a place.");
    if (v.g !== "MOVE" && PLACES.includes(obj.noun.n))
      return bad("Only movement takes a place. That action needs a being or a thing.");
    spec.obj = obj.noun;
    rules.push("target");
  }

  if (i < t.length && t[i].g === "TO") {
    i++;
    if (v.g !== "GIVE") return bad("Only giving has someone on the receiving end.");
    if (!spec.obj) return bad("Giving needs a thing before it needs a receiver.");
    const r = takeNoun();
    if (r.err) return bad(r.err);
    if (r.none) return bad("The role marker has to be followed by whoever receives.");
    spec.recip = r.noun; spec.marker = true;
    rules.push("recipient", "marker");
  } else if (i < t.length && NOUNS.includes(t[i].g)) {
    if (v.g !== "GIVE") return bad("Only giving takes a fourth part.");
    if (!spec.obj) return bad("Giving needs a thing before it needs a receiver.");
    const r = takeNoun();
    if (r.err) return bad(r.err);
    spec.recip = r.noun;
    rules.push("recipient");
  }

  if (i < t.length && t[i].g === "QUERY") { i++; spec.q = true; rules.push("question"); }
  if (i < t.length) return bad("There is a symbol on the end that has nowhere to go.");
  if (v.g === "GIVE" && !spec.obj) return bad("Giving needs something to give.");

  const used = [...new Set(rules)];
  return { ok: true, spec, gloss: gloss(spec), rules: used,
    nodes: [...new Set(used.map((r) => RULE_NODE[r]).filter(Boolean))] };
}

/* the tile pool is exactly what this learner demonstrated */
function freeBuildPool(st) {
  const m = (id) => st.nodes[id].mastery;
  const has = (id) => m(id) >= PREREQ;
  const seen = (id) => m(id) > 0;
  const NODE_OF = { PERSON: "N03", CREATURE: "N04", HOME: "N05", WATER: "N06", OBJECT: "N07",
    FOOD: "N08", MOVE: "N09", SEE: "N10", GIVE: "N11", TAKE: "N12", LARGE: "N13", SMALL: "N14" };

  const nouns = NOUNS.filter((g) => seen(NODE_OF[g])).sort((a, b) => m(NODE_OF[b]) - m(NODE_OF[a])).slice(0, 4);
  const verbs = VERBS.filter((g) => seen(NODE_OF[g])).sort((a, b) => m(NODE_OF[b]) - m(NODE_OF[a])).slice(0, 2);
  const tiles = [];
  const pluralisable = (g) => !PLACES.includes(g) && LEX[g].pl !== LEX[g].sg;
  nouns.forEach((g) => { tiles.push(g); if (has("N15") && pluralisable(g)) tiles.push(g + "+p"); });
  verbs.forEach((g) => {
    tiles.push(g);
    if (has("N16") && g === "MOVE") tiles.push(g + "+r");
    if (has("N17")) tiles.push(g + "+past");
    if (has("N18")) tiles.push(g + "+fut");
    if (has("N20")) tiles.push(g + "+neg");
  });
  if (has("N25")) PROPS.filter((g) => seen(NODE_OF[g])).forEach((g) => tiles.push(g));
  if (has("N28")) tiles.push("TO");
  if (has("N38")) tiles.push("QUERY");

  /* guarantee something buildable: a message needs an agent and an action,
     so if the session did not establish one of each, supply the strongest */
  if (!nouns.some((g) => AGENTS.includes(g))) {
    const a = AGENTS.slice().sort((x, y) => m(NODE_OF[y]) - m(NODE_OF[x]))[0];
    tiles.unshift(a);
    if (has("N15")) tiles.splice(1, 0, a + "+p");
  }
  if (!verbs.length) tiles.push(VERBS.slice().sort((x, y) => m(NODE_OF[y]) - m(NODE_OF[x]))[0]);
  const out = [...new Set(tiles)];
  /* never trim away the agent or the action while capping */
  const keep = out.filter((t) => AGENTS.includes(parseGlyph(t).g) || VERBS.includes(parseGlyph(t).g));
  const rest = out.filter((t) => !keep.includes(t));
  return [...keep.slice(0, 8), ...rest].slice(0, 16);
}

function buildFreeFinale(st) {
  const pool = freeBuildPool(st);
  const marks = ["N15", "N16", "N17", "N18", "N20", "N25", "N28", "N38"].filter((id) => st.nodes[id].mastery >= PREREQ);
  return {
    id: "free_build", type: "freebuild", primaryNode: "N37",
    supportingNodes: [], prerequisites: [], evidenceType: "generation", personal: true,
    prompt: "Last one, and there is no single right answer. Build any message you can from what you have.",
    hint: marks.length
      ? "Use as many of the rules you picked up as you want."
      : "Someone, then an action, is enough.",
    pool,
  };
}

/* ================================== engine ================================== */

const PREREQ = 0.3, PROVISIONAL = 0.6, DURABLE = 0.8, PLACEMENT_CAP = 0.65;
const RETRIEVAL_TRIGGER = 0.45;  // schedule a return visit before a concept is fully solid

const GAIN = { recognition: 0.18, discrimination: 0.22, application: 0.24,
  retrieval: 0.28, transfer: 0.32, generation: 0.32, inference: 0.30 };
const LOSS = { recognition: 0.12, discrimination: 0.14, application: 0.16,
  retrieval: 0.20, transfer: 0.16, generation: 0.18, inference: 0.14 };

const clamp = (v) => Math.max(0, Math.min(1, v));

function blankNode() {
  return { mastery: 0, evidence: [], lastSeenAt: null, firstSeenAt: null, nextRetrievalDue: null,
    retrievalSuccesses: 0, shelvedUntil: null, everShelved: false, introduced: false, taught: false,
    inferred: false, consecutiveWrong: 0, wrongCount: 0, remediationCount: 0,
    everDropped: false, repairedAfterDrop: false, needsStrengthening: false,
    fromPlacement: false, lastActivityType: null };
}

function initState(seed) {
  RNG = mulberry32(seed);
  return { seed, interaction: 0, nodes: Object.fromEntries(NODES.map((n) => [n.id, blankNode()])),
    misconceptions: {}, placementEvidence: {}, path: [], used: {}, recent: [], recentRegions: [],
    initialKnown: [], startedAt: Date.now(), lastCandidates: [],
    metrics: { introduced: 0, strengthened: 0, inferred: 0, retrievalSuccesses: 0,
      transferSuccesses: 0, remediations: 0, shelved: 0, correct: 0, answered: 0, unlocked: 0 } };
}

function prereqSatisfied(def, st) {
  const p = def.pre || {};
  if (!(p.required || []).every((id) => st.nodes[id].mastery >= PREREQ)) return false;
  if (p.anyOf && p.anyOf.length && (p.minimumAnyOf || 0) > 0) {
    const have = p.anyOf.filter((id) => st.nodes[id].mastery >= PREREQ).length;
    if (have < p.minimumAnyOf) return false;
  }
  return true;
}
const isShelved = (id, st) => st.nodes[id].shelvedUntil !== null && st.interaction < st.nodes[id].shelvedUntil;
const activityReady = (a, st) =>
  (a.remediationFor && a.remediationFor.length)   // a repair item is for someone who is failing it
    ? true
    : (a.prerequisites || []).every((id) => st.nodes[id].mastery >= PREREQ);

function getFrontier(st) {
  return NODES.filter((n) => prereqSatisfied(n, st) && st.nodes[n.id].mastery < DURABLE && !isShelved(n.id, st))
    .map((n) => n.id);
}

function bump(prev, delta, placement) {
  let next = clamp(prev + delta);
  if (delta > 0 && prev < PREREQ) next = Math.min(next, 0.59);
  if (delta > 0 && placement) next = Math.min(next, PLACEMENT_CAP);
  return next;
}

function applyTeach(st, act) {
  const id = act.primaryNode, n = st.nodes[id], before = n.mastery;
  if (!n.introduced) { n.introduced = true; st.metrics.introduced += 1; }
  n.taught = true;
  n.mastery = Math.max(n.mastery, 0.32);
  n.lastSeenAt = st.interaction;
  if (n.firstSeenAt === null) n.firstSeenAt = st.interaction;
  n.lastActivityType = "teach";
  st.used[act.id] = true;
  st.recent = [...st.recent, id].slice(-3);
  st.recentRegions = [...st.recentRegions, NODE_BY_ID[id].region].slice(-3);
  st.path.push({ sequence: st.interaction, activityId: act.id, nodeId: id, activityType: "teach",
    evidenceType: "exposure", result: "taught", masteryBefore: before, masteryAfter: n.mastery,
    routingEffect: "new concept introduced" });
}

function applyEvidence(st, act, correct, opts = {}) {
  const evidenceType = opts.evidenceType || act.evidenceType;
  const id = act.primaryNode, n = st.nodes[id], before = n.mastery;
  const wasDue = n.nextRetrievalDue !== null && st.interaction >= n.nextRetrievalDue;
  const placement = !!act.placement;
  let routingEffect = null;

  st.metrics.answered += 1;
  if (correct) st.metrics.correct += 1;
  if (n.firstSeenAt === null) n.firstSeenAt = st.interaction;

  const delta = correct ? (opts.hinted ? 0.08 : GAIN[evidenceType] || 0.2) : -(LOSS[evidenceType] || 0.15);
  n.mastery = bump(before, delta, placement);
  if (placement) { st.placementEvidence[id] = { correct, evidenceType }; n.fromPlacement = true; }

  if (!n.introduced && correct) { n.introduced = true; st.metrics.introduced += 1; }

  /* untaught discovery is its own kind of evidence */
  if (correct && !n.taught && (evidenceType === "inference" || evidenceType === "transfer") && !n.inferred) {
    n.inferred = true; st.metrics.inferred += 1;
    routingEffect = "rule inferred without instruction";
  }

  (act.supportingNodes || []).forEach((sid) => {
    const s = st.nodes[sid]; if (!s) return;
    const b = s.mastery;
    s.mastery = clamp(b + (correct ? 0.05 : -0.02));
    if (Math.abs(s.mastery - b) > 0.001)
      s.evidence.push({ interaction: st.interaction, activityId: act.id, nodeId: sid,
        evidenceType, correct, supporting: true, masteryBefore: b, masteryAfter: s.mastery });
  });

  let misId = null;
  if (!correct && act.misconceptionMap && opts.choiceId) {
    misId = act.misconceptionMap[opts.choiceId] || null;
    if (misId) st.misconceptions[misId] = (st.misconceptions[misId] || 0) + 1;
  }

  if (correct) {
    n.consecutiveWrong = 0;
    if (evidenceType === "transfer" || evidenceType === "generation" || evidenceType === "inference")
      st.metrics.transferSuccesses += 1;
    if (evidenceType === "retrieval") { st.metrics.retrievalSuccesses += 1; n.retrievalSuccesses += 1; }
    if (n.everDropped && !n.repairedAfterDrop) {
      n.repairedAfterDrop = true; n.needsStrengthening = false;
      st.metrics.strengthened += 1; routingEffect = "concept repaired";
    }
  } else {
    n.consecutiveWrong += 1; n.wrongCount += 1;
    if (before - n.mastery >= 0.1 && before >= PREREQ) { n.everDropped = true; n.needsStrengthening = true; }
    if (evidenceType === "retrieval") {
      n.everDropped = true; n.needsStrengthening = true;
      routingEffect = "failed retrieval — strengthening queued";
    }
    if (act.type === "remediation") { n.remediationCount += 1; st.metrics.remediations += 1; }
    if ((n.wrongCount >= 3 || (n.wrongCount >= 2 && n.remediationCount >= 1)) && !isShelved(id, st)) {
      n.shelvedUntil = st.interaction + randInt(4, 6);
      if (!n.everShelved) { n.everShelved = true; st.metrics.shelved += 1; }
      routingEffect = "temporarily set aside";
    }
  }
  if (act.type === "remediation" && correct) { n.remediationCount += 1; st.metrics.remediations += 1; }

  if (n.mastery >= RETRIEVAL_TRIGGER && n.nextRetrievalDue === null) n.nextRetrievalDue = st.interaction + randInt(3, 5);
  else if (evidenceType === "retrieval" && correct) n.nextRetrievalDue = st.interaction + randInt(5, 8);
  else if (evidenceType === "retrieval" && !correct) n.nextRetrievalDue = null;
  if (n.mastery < PREREQ) n.nextRetrievalDue = null;

  n.lastSeenAt = st.interaction;
  n.lastActivityType = act.type;
  n.evidence.push({ interaction: st.interaction, activityId: act.id, nodeId: id, evidenceType,
    correct, hinted: !!opts.hinted, masteryBefore: before, masteryAfter: n.mastery, misconceptionId: misId });

  st.path.push({ sequence: st.interaction, activityId: act.id, nodeId: id, activityType: act.type,
    supportingNodes: act.supportingNodes || [], evidenceType, result: correct ? "correct" : "incorrect",
    misconception: misId, masteryBefore: before, masteryAfter: n.mastery,
    routingEffect: routingEffect || (wasDue ? "spaced retrieval" : null),
    wasDueRetrieval: wasDue, inferred: n.inferred, placement,
    remediation: act.type === "remediation" });

  st.used[act.id] = true;
  st.recent = [...st.recent, id].slice(-3);
  st.recentRegions = [...st.recentRegions, NODE_BY_ID[id].region].slice(-3);
  return { misId, routingEffect };
}

/* -------------------------------- routing ---------------------------------- */

const pool = (st, pred) => MAIN_BANK.filter((a) => !st.used[a.id] && activityReady(a, st) && pred(a));

function pickForNode(st, id, pred = () => true, primaryOnly = false) {
  const primary = pool(st, (a) => a.primaryNode === id && a.type !== "teach" && pred(a));
  if (primary.length) {
    const fresh = primary.filter((a) => a.type !== st.nodes[id].lastActivityType);
    return pickOne(fresh.length ? fresh : primary);
  }
  if (primaryOnly) return null;
  const sup = pool(st, (a) => (a.supportingNodes || []).includes(id) && a.type !== "teach" && pred(a));
  return sup.length ? pickOne(sup) : null;
}

function chooseNextActivity(st) {
  const cands = [];
  const add = (activity, kind, base, nodeId, evidenceType, why) => {
    if (activity) cands.push({ activity, kind, base, nodeId: nodeId || activity.primaryNode, evidenceType, why });
  };

  NODES.forEach((n) => {
    const s = st.nodes[n.id];
    if (s.nextRetrievalDue !== null && st.interaction >= s.nextRetrievalDue &&
        s.mastery >= PREREQ && !isShelved(n.id, st))
      add(pickForNode(st, n.id, () => true, true), "retrieval", 100, n.id, "retrieval",
        "retrieval came due after intervening work");
  });

  const hot = Object.entries(st.misconceptions).filter(([, c]) => c >= 2).map(([m]) => MIS_NODE[m]);
  NODES.forEach((n) => {
    const s = st.nodes[n.id];
    if ((s.needsStrengthening || s.consecutiveWrong >= 2 || hot.includes(n.id)) && !isShelved(n.id, st)) {
      const rem = pool(st, (a) => (a.remediationFor || []).includes(n.id));
      if (rem.length) add(pickOne(rem), "remediation", 95, n.id, null, "repeated error on this concept");
      else add(pickForNode(st, n.id), "strengthen", 92, n.id, null, "concept needs strengthening");
    }
  });

  NODES.forEach((n) => {
    const s = st.nodes[n.id];
    if (s.wrongCount === 0 || s.mastery >= PROVISIONAL) return;
    if (st.interaction - (s.lastSeenAt ?? -99) > 6) return;
    [...(n.pre.required || []), ...(n.pre.anyOf || [])].forEach((pid) => {
      if (st.nodes[pid].mastery < 0.45 && !isShelved(pid, st))
        add(pickForNode(st, pid), "prerequisite", 90, pid, null, `weak prerequisite under ${n.short}`);
    });
  });

  getFrontier(st).forEach((id) => {
    const s = st.nodes[id];
    if (!s.introduced && s.mastery < PREREQ) {
      const teach = pool(st, (a) => a.type === "teach" && a.primaryNode === id);
      if (teach.length) { add(teach[0], "teach", 82, id, null, "new concept on the frontier"); return; }
    }
    const gentle = pickForNode(st, id, (a) => ["recognition", "selection", "contrast", "inference"].includes(a.type));
    add(gentle || pickForNode(st, id, (a) => a.type !== "remediation"), "frontier", 80, id, null,
      "prerequisites are strong enough for this");
  });

  NODES.forEach((n) => {
    const m = st.nodes[n.id].mastery;
    if (m >= 0.4 && m < DURABLE && !isShelved(n.id, st))
      add(pickForNode(st, n.id, (a) => ["decode", "complete"].includes(a.type)), "application", 75, n.id, null,
        "partly known — worth using in a longer message");
  });

  NODES.forEach((n) => {
    if (st.nodes[n.id].mastery >= 0.55 && !isShelved(n.id, st))
      add(pickForNode(st, n.id, (a) => a.type === "transfer"), "transfer", 72, n.id, null,
        "strong enough to try somewhere new");
  });

  NODES.forEach((n) => {
    if (st.nodes[n.id].mastery >= 0.5 && !isShelved(n.id, st))
      add(pickForNode(st, n.id, (a) => a.type === "generation"), "generation", 70, n.id, null,
        "ready to produce rather than recognise");
  });

  /* vocabulary expansion — held back while other things are still half-learned,
     otherwise a 38-node graph gets sampled broadly and learned shallowly */
  const halfLearned = NODES.filter((n) => st.nodes[n.id].mastery >= PREREQ && st.nodes[n.id].mastery < DURABLE).length;
  NODES.filter((n) => n.cat === "vocab").forEach((n) => {
    const s = st.nodes[n.id];
    if (halfLearned >= 7) return;
    if (!s.introduced && prereqSatisfied(n, st)) {
      const teach = pool(st, (a) => a.type === "teach" && a.primaryNode === n.id);
      add(teach.length ? teach[0] : pickForNode(st, n.id), "vocabulary", 68, n.id, null, "unexplored vocabulary");
    }
  });

  NODES.forEach((n) => {
    const s = st.nodes[n.id];
    if (s.shelvedUntil !== null && st.interaction >= s.shelvedUntil && s.mastery < DURABLE) {
      const rem = pool(st, (a) => (a.remediationFor || []).includes(n.id));
      add(rem.length ? rem[0] : pickForNode(st, n.id), "return", 65, n.id, null, "set aside earlier, ready to retry");
    }
  });

  const lastTwo = st.recent.slice(-2);
  const lastNode = st.recent[st.recent.length - 1];
  const lastRegion = st.recentRegions[st.recentRegions.length - 1];
  const seen = new Set();
  let valid = cands.filter((c) => {
    if (!c.activity || st.used[c.activity.id]) return false;
    if (lastTwo.length === 2 && lastTwo[0] === c.nodeId && lastTwo[1] === c.nodeId) return false;
    const k = c.activity.id + c.kind;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });

  if (!valid.length) {
    const loose = pool(st, (a) => a.type !== "remediation");
    if (!loose.length) { st.lastCandidates = []; return null; }
    const pick = pickOne(loose.slice(0, 6));
    return { activity: pick, kind: "frontier", base: 60, nodeId: pick.primaryNode, why: "anything still reachable" };
  }

  const ranked = valid.map((c) => {
    let v = 0;
    if (c.nodeId === lastNode) v -= 22;
    const region = NODE_BY_ID[c.nodeId].region;
    if (lastRegion && region !== lastRegion) v += 7;
    if (st.recentRegions.filter((r) => r === region).length >= 2) v -= 9;
    v += Math.min(st.interaction - (st.nodes[c.nodeId].lastSeenAt ?? -20), 8);
    if (!st.nodes[c.nodeId].introduced) v += halfLearned >= 6 ? -10 : 3;
    if (st.nodes[c.nodeId].mastery >= PREREQ && st.nodes[c.nodeId].mastery < DURABLE) v += 5;
    return { ...c, score: c.base + v + rand() * 8 };
  }).sort((a, b) => b.score - a.score);

  st.lastCandidates = ranked.slice(0, 8).map((c) => ({
    id: c.activity.id, node: c.nodeId, kind: c.kind, score: Math.round(c.score), why: c.why }));

  const band = ranked.filter((c) => c.score >= ranked[0].score - 12);
  const w = band.map((c) => Math.pow(c.score - (ranked[0].score - 14), 1.6));
  let roll = rand() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < band.length; i++) { roll -= w[i]; if (roll <= 0) return band[i]; }
  return band[0];
}

const TIER = { foundation: 0, vocab: 1, morphology: 2, syntax: 2, integration: 3, transfer: 4 };

function chooseFinalChallenges(st, count = 3) {
  const depth = (a) => TIER[NODE_BY_ID[a.primaryNode].cat] || 0;
  const ready = (a) => !st.used[a.id] && activityReady(a, st);
  const meaty = (a) => ["decode", "transfer", "generation", "selection", "complete"].includes(a.type);

  /* only things that actually integrate — a naming question is not a closing challenge */
  const reserved = FINALE.filter((a) => activityReady(a, st));
  let elig = [...reserved, ...MAIN_BANK.filter((a) => ready(a) && meaty(a) && depth(a) >= 2)];
  if (!elig.length) elig = MAIN_BANK.filter((a) => ready(a) && meaty(a) && depth(a) >= 1);

  const score = (a) => depth(a) * 10
    + (st.nodes[a.primaryNode].mastery > 0 ? 6 : 0)          // near their frontier, not miles past it
    + (a.finalOnly ? 14 : 0)                                 // the reserved ladder wins ties
    + (a.supportingNodes || []).filter((n) => st.nodes[n].mastery >= PREREQ).length * 2
    + rand() * 5;
  const ranked = [...elig].sort((a, b) => score(b) - score(a));

  const chosen = [];
  const gens = ranked.filter((a) => a.type === "generation");
  if (gens.length) chosen.push(gens[0]);                     // everyone who can build, builds

  for (const a of ranked) {
    if (chosen.length >= count) break;
    if (chosen.some((c) => c.id === a.id)) continue;
    if (chosen.some((c) => c.primaryNode === a.primaryNode) && ranked.length > count) continue;
    chosen.push(a);
  }
  if (chosen.length < 2) {
    for (const a of ranked) {
      if (chosen.length >= 2) break;
      if (!chosen.some((c) => c.id === a.id)) chosen.push(a);
    }
  }
  const ordered = chosen.sort((a, b) => depth(a) - depth(b))  // build up, don't drop off
    .filter((a) => a.type !== "generation")                   // the personal build replaces a canned one
    .slice(0, count - 1);
  return [...ordered, buildFreeFinale(st)];                   // always end by composing their own
}

/* The closing task is composed at runtime from the symbols and rules this
   learner demonstrated, so everyone ends by producing a signal of their own
   and no two people are asked to build the same sentence. */
function buildPersonalFinale(st) {
  const m = (id) => st.nodes[id].mastery;
  const best = (ids) => [...ids].sort((a, b) => m(b) - m(a))[0];
  const has = (id) => m(id) >= PREREQ;

  const agent = best(["N03", "N04"]);
  const agentG = agent === "N03" ? "PERSON" : "CREATURE";
  const other = agent === "N03" ? "CREATURE" : "PERSON";
  const actionNode = best(["N09", "N10", "N11", "N12"]);
  const actionG = { N09: "MOVE", N10: "SEE", N11: "GIVE", N12: "TAKE" }[actionNode];

  const spec = { subj: nn(agentG), v: vv(actionG) };
  const support = [agent, actionNode, "N22"];
  let marks = 0;

  /* a target, if they showed they can hang one off an action */
  if (has("N23") || has("N24")) {
    const targetNode = actionG === "MOVE" ? best(["N05", "N06"]) : best(["N07", "N08"]);
    const targetG = { N05: "HOME", N06: "WATER", N07: "OBJECT", N08: "FOOD" }[targetNode];
    if (m(targetNode) > 0 || has("N24")) { spec.obj = nn(targetG); support.push(targetNode, "N24"); }
  }
  /* a recipient, only for givers who got that far */
  if (actionG === "GIVE" && spec.obj && (has("N27") || m("N27") > 0.15)) {
    spec.recip = nn(other); support.push("N27");
    if (has("N28")) { spec.marker = true; support.push("N28"); }
  }
  /* then whichever rules they actually demonstrated, up to three */
  if (has("N15") && marks < 3) { spec.subj.p = true; support.push("N15"); marks++; }
  if (has("N15") && spec.obj && marks < 3 && rand() > 0.6 && LEX[spec.obj.n].pl !== LEX[spec.obj.n].sg) {
    spec.obj.p = true; marks++;
  }
  if (has("N25") && marks < 3 && (has("N13") || has("N14"))) {
    spec.subj.prop = has("N13") && (!has("N14") || m("N13") >= m("N14")) ? "LARGE" : "SMALL";
    support.push("N25"); marks++;
  }
  const tenseOptions = [has("N17") && "past", has("N18") && "fut"].filter(Boolean);
  if (tenseOptions.length && marks < 3) {
    const t = pickOne(tenseOptions);
    spec.v[t] = true; support.push(t === "past" ? "N17" : "N18"); marks++;
  }
  if (has("N20") && marks < 3 && (marks === 0 || has("N21"))) {
    spec.v.neg = true; support.push("N20"); marks++;
  }
  if (actionG === "MOVE" && has("N16") && marks < 3 && rand() > 0.5) {
    spec.v.rot = true; support.push("N16"); marks++;
  }

  /* tempting near-misses in the tile pool */
  const decoys = [agentG, agentG + "+p", other, actionG];
  if (spec.v.past) decoys.push(actionG + "+fut");
  if (spec.v.fut) decoys.push(actionG + "+past");
  if (spec.v.neg) decoys.push(actionG);
  if (spec.v.rot) decoys.push(actionG);
  if (spec.subj.prop) decoys.push(spec.subj.prop === "LARGE" ? "SMALL" : "LARGE");
  if (spec.obj) decoys.push(spec.obj.n + "+p");

  const act = makeGeneration(spec, {
    id: "personal_finale", node: marks >= 3 ? "N36" : "N37",
    support: [...new Set(support)], pre: [],
    decoys: [...new Set(decoys)],
    ok: "You produced that from the rules you had, not from a sentence you were shown.",
    no: "Useful signal. Every part of that English meaning has a symbol or a mark to match.",
  });
  act.prompt = `Last one. Build this from what you have: ${gloss(spec)}.`;
  act.personal = true;
  return act;
}

function nodeStatus(st, id) {
  const s = st.nodes[id];
  if (isShelved(id, st)) return "shelved";
  if (s.mastery >= DURABLE) return "strong";
  if (s.everDropped && s.repairedAfterDrop) return "strengthened";
  if (s.mastery >= PREREQ) return "developing";
  if (prereqSatisfied(NODE_BY_ID[id], st)) return "frontier";
  return "locked";
}

function categorise(st) {
  const out = { strong: [], retrieved: [], strengthened: [], inferred: [], developing: [], ready: [], notReady: [] };
  NODES.forEach((n) => {
    const s = st.nodes[n.id];
    const badges = [];
    if (s.retrievalSuccesses > 0) badges.push("Retrieved later");
    if (s.everDropped && s.repairedAfterDrop) badges.push("Strengthened");
    if (s.inferred) badges.push("Inferred");
    if (s.everShelved) badges.push("Set aside");
    const e = { id: n.id, node: n, mastery: s.mastery, badges, state: s };
    if (s.retrievalSuccesses > 0) out.retrieved.push(e);
    if (s.inferred) out.inferred.push(e);
    if (s.mastery >= DURABLE) out.strong.push(e);
    else if (s.everDropped && s.repairedAfterDrop) out.strengthened.push(e);
    else if (s.mastery >= PREREQ) out.developing.push(e);
    else if (prereqSatisfied(n, st)) out.ready.push(e);
    else out.notReady.push(e);
  });
  return out;
}

/* ================================ ui pieces ================================= */

function Eyebrow({ children, tone = C.mid }) {
  return <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
    textTransform: "uppercase", color: tone, marginBottom: 14 }}>{children}</div>;
}

function Button({ children, onClick, kind = "solid", disabled, full, style }) {
  const kinds = {
    solid: { background: C.ink, color: C.cream, border: `1px solid ${C.ink}` },
    ghost: { background: "transparent", color: C.ink, border: `1px solid ${C.dim}` },
  };
  return <button className="sig-btn" onClick={disabled ? undefined : onClick} disabled={disabled}
    style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, padding: "13px 26px", borderRadius: 2,
      cursor: disabled ? "default" : "pointer", width: full ? "100%" : undefined,
      opacity: disabled ? 0.35 : 1, transition: "all .15s ease", ...kinds[kind], ...style }}>{children}</button>;
}

function Placeholder({ size = 60 }) {
  return <div style={{ width: size, height: size, border: `2px dashed ${C.dim}`, borderRadius: 3,
    display: "flex", alignItems: "center", justifyContent: "center", color: C.dim,
    fontFamily: MONO, fontSize: 20 }} aria-label="missing symbol">?</div>;
}

function Stimulus({ stimulus, size = 70 }) {
  if (!stimulus) return null;
  if (stimulus.kind === "glyph") return <AlienGlyph code={stimulus.value} size={size + 18} />;
  if (stimulus.kind === "sequence")
    return <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      {stimulus.value.map((c, i) => c === "__" ? <Placeholder key={i} size={size} /> : <AlienGlyph key={i} code={c} size={size} />)}
    </div>;
  return null;
}

function ExampleRow({ examples }) {
  return <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center",
    padding: "16px 12px", background: "rgba(184,162,200,0.13)", borderRadius: 3, marginBottom: 22 }}>
    {examples.map((e, i) => <div key={i} style={{ textAlign: "center" }}>
      <GlyphSequence codes={e.glyphs} size={46} gap={5} />
      <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.mid, marginTop: 8, letterSpacing: "0.05em" }}>{e.label}</div>
    </div>)}
  </div>;
}

function ChoiceButton({ choice, onSelect, state, disabled }) {
  const isGlyph = !!choice.glyphs;
  const tones = {
    idle: { border: `1px solid ${C.dim}`, background: C.paper, color: C.ink },
    correct: { border: `2px solid ${C.ok}`, background: "rgba(34,197,94,0.08)", color: C.ink },
    wrong: { border: `2px solid ${C.bad}`, background: "rgba(239,68,68,0.07)", color: C.ink },
    muted: { border: "1px solid rgba(184,162,200,0.4)", background: "transparent", color: C.dim },
  };
  const t = tones[state] || tones.idle;
  return <button className="sig-choice" onClick={disabled ? undefined : onSelect} disabled={disabled}
    style={{ ...t, borderRadius: 3, padding: isGlyph ? "12px 10px" : "15px 18px",
      cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", gap: 12,
      textAlign: "left", fontFamily: SANS, fontSize: 16, width: "100%", minHeight: 54,
      transition: "all .14s ease", justifyContent: isGlyph ? "center" : "flex-start" }}>
    {isGlyph ? <GlyphSequence codes={choice.glyphs} size={44} gap={6} tone={state === "muted" ? C.dim : C.ink} />
      : <span>{choice.label}</span>}
    {state === "correct" && <span style={{ marginLeft: "auto", color: C.ok, fontSize: 18 }} aria-label="correct">✓</span>}
    {state === "wrong" && <span style={{ marginLeft: "auto", color: C.bad, fontSize: 18 }} aria-label="your answer">✕</span>}
  </button>;
}

function GenerationPad({ pool, onSubmit, locked, chosen, setChosen, label }) {
  return <div>
    <div style={{ minHeight: 92, border: `1px dashed ${C.dim}`, borderRadius: 3, padding: 12, marginBottom: 16,
      display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap",
      background: "rgba(184,162,200,0.08)" }}>
      {chosen.length === 0
        ? <span style={{ fontFamily: MONO, fontSize: 11.5, color: C.dim, letterSpacing: "0.08em" }}>
            TAP SYMBOLS BELOW TO BUILD THE SIGNAL</span>
        : chosen.map((c, i) => <button key={i} onClick={() => !locked && setChosen(chosen.filter((_, j) => j !== i))}
            className="sig-choice" aria-label={`Remove symbol ${i + 1}`}
            style={{ border: `1px solid ${C.mid}`, background: C.paper, borderRadius: 3, padding: 5,
              cursor: locked ? "default" : "pointer" }}><AlienGlyph code={c} size={48} /></button>)}
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
      {pool.map((c, i) => <button key={i} onClick={() => !locked && setChosen([...chosen, c])}
        className="sig-choice" disabled={locked} aria-label={`Add symbol: ${glyphDescription(c)}`}
        style={{ border: `1px solid ${C.dim}`, background: C.paper, borderRadius: 3, padding: 7,
          cursor: locked ? "default" : "pointer" }}><AlienGlyph code={c} size={48} /></button>)}
    </div>
    {!locked && <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      <Button kind="ghost" onClick={() => setChosen([])} disabled={!chosen.length}>Clear</Button>
      <Button onClick={onSubmit} disabled={chosen.length < 2}>{label === "SEND" ? "Send my message" : "Send signal"}</Button>
    </div>}
  </div>;
}

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function ActivityCard({ activity, onAnswer, onNext, note, evidenceLabel }) {
  const choices = useMemo(() => (activity.choices ? shuffled(activity.choices) : null), [activity.id]);
  const genPool = useMemo(() => (activity.pool ? shuffled(activity.pool) : null), [activity.id]);
  const [picked, setPicked] = useState(null);
  const [chosen, setChosen] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  useEffect(() => { setPicked(null); setChosen([]); setAnswered(false); setCorrect(false); setVerdict(null); }, [activity.id]);

  const isTeach = activity.type === "teach";
  const isGen = activity.type === "generation";
  const isFree = activity.type === "freebuild";
  const [verdict, setVerdict] = useState(null);
  const submit = (id) => { if (answered) return;
    const ok = id === activity.correctAnswer;
    setPicked(id); setAnswered(true); setCorrect(ok); onAnswer(ok, id); };
  const submitGen = () => { if (answered) return;
    const ok = chosen.length === activity.correctSequence.length &&
      chosen.every((c, i) => c === activity.correctSequence[i]);
    setAnswered(true); setCorrect(ok); onAnswer(ok, null); };
  const submitFree = () => {
    if (answered) return;
    const r = validateSignal(chosen);
    setVerdict(r); setAnswered(true); setCorrect(!!r.ok);
    onAnswer(!!r.ok, null, r);
  };
  const cstate = (c) => !answered ? "idle" : c.id === activity.correctAnswer ? "correct"
    : c.id === picked ? "wrong" : "muted";

  return <div style={{ width: "100%" }}>
    {evidenceLabel && <Eyebrow>{evidenceLabel}</Eyebrow>}
    {activity.explain && <div style={{ borderLeft: `2px solid ${C.mid}`, paddingLeft: 16, marginBottom: 22,
      fontFamily: SANS, fontSize: 15, lineHeight: 1.55, color: C.mid }}>{activity.explain}</div>}
    {activity.examples && <ExampleRow examples={activity.examples} />}
    <p style={{ fontFamily: SERIF, fontSize: 21, lineHeight: 1.4, color: C.ink, margin: "0 0 26px" }}>{activity.prompt}</p>
    {activity.stimulus && <div style={{ margin: "0 0 30px", display: "flex", justifyContent: "center" }}>
      <Stimulus stimulus={activity.stimulus} /></div>}

    {isFree ? <>
        {activity.hint && !answered && <p style={{ fontFamily: SANS, fontSize: 15, color: C.mid,
          margin: "-14px 0 22px", lineHeight: 1.55 }}>{activity.hint}</p>}
        <GenerationPad pool={genPool} onSubmit={submitFree} locked={answered}
          chosen={chosen} setChosen={setChosen} label="SEND" />
      </>
      : isTeach ? <Button onClick={onNext} full>Continue</Button>
      : isGen ? <>
          <GenerationPad pool={genPool} onSubmit={submitGen} locked={answered} chosen={chosen} setChosen={setChosen} />
          {answered && !correct && <div style={{ textAlign: "center", marginTop: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.12em", color: C.mid, marginBottom: 10 }}>
              THE SIGNAL READS</div>
            <GlyphSequence codes={activity.correctSequence} size={46} gap={8} /></div>}
        </>
      : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {choices.map((c) => <ChoiceButton key={c.id} choice={c} state={cstate(c)} disabled={answered}
            onSelect={() => submit(c.id)} />)}
        </div>}

    {answered && <div style={{ marginTop: 26 }}>
      {isFree && verdict && verdict.ok && <div style={{ borderTop: `1px solid ${C.dim}`, paddingTop: 18, marginBottom: 4 }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.14em", color: C.mid, marginBottom: 8 }}>
          YOUR MESSAGE READS</div>
        <p style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1.3, color: C.ink, margin: "0 0 14px" }}>
          {verdict.gloss}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
          {verdict.rules.map((r) => <span key={r} style={{ fontFamily: MONO, fontSize: 10,
            letterSpacing: "0.06em", textTransform: "uppercase", border: `1px solid ${C.ok}`,
            color: C.ink, background: "rgba(34,197,94,0.12)", borderRadius: 2, padding: "4px 8px" }}>
            {RULE_LABEL[r]}</span>)}
        </div>
      </div>}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "16px 0", borderTop: `1px solid ${C.dim}` }}>
        <span aria-hidden style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.1em",
          color: correct ? C.ok : C.warn, paddingTop: 3, whiteSpace: "nowrap" }}>{correct ? "HELD" : "SIGNAL"}</span>
        <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.55, color: C.ink, margin: 0 }}>
          {isFree
            ? (verdict && verdict.ok
                ? `That is a well-formed message, and you used ${verdict.rules.length} ${verdict.rules.length === 1 ? "rule" : "rules"} to make it. Nobody showed you that sentence.`
                : (verdict && verdict.error) || "Not quite a message yet.")
            : correct ? activity.feedbackCorrect : activity.feedbackIncorrect}</p>
      </div>
      {isFree && verdict && !verdict.ok && <div style={{ marginBottom: 14 }}>
        <Button kind="ghost" onClick={() => { setAnswered(false); setVerdict(null); }}>Try another message</Button>
      </div>}
      {note && <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.1em", color: C.mid,
        textTransform: "uppercase", marginBottom: 16 }}>{note}</div>}
      <Button onClick={onNext} full>Continue</Button>
    </div>}
  </div>;
}

function Shell({ children, wide }) {
  return <div style={{ minHeight: "100%", background: C.cream, color: C.ink, padding: "22px 18px 60px", boxSizing: "border-box" }}>
    <div style={{ maxWidth: wide ? 1000 : 620, margin: "0 auto" }}>{children}</div></div>;
}

function Wordmark({ right }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 34 }}>
    <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.34em", color: C.ink }}>THE SIGNAL</div>
    {right && <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", color: C.mid }}>{right}</div>}
  </div>;
}

/* ============================ knowledge graph view =========================== */

const STATUS = {
  strong:       { fill: C.ink,   stroke: C.ink,  text: C.cream, mark: "✓",  label: "Strong" },
  strengthened: { fill: C.mid,   stroke: C.mid,  text: C.cream, mark: "✦",  label: "Strengthened" },
  developing:   { fill: C.paper, stroke: C.mid,  text: C.ink,   mark: "",   label: "Developing" },
  frontier:     { fill: "rgba(34,197,94,0.13)", stroke: C.ok, text: C.ink, mark: "", label: "Ready next" },
  locked:       { fill: "transparent", stroke: C.dim, text: C.dim, mark: "", label: "Not ready yet" },
  shelved:      { fill: C.paper, stroke: C.warn, text: C.ink,   mark: "❙❙", label: "Set aside" },
};

function KnowledgeGraph({ state, mode, highlight = [], selected, onSelect, samplePath, dim, compact, highlightTone }) {
  const R = 19;
  const pathNodes = useMemo(() => {
    const seq = [];
    state.path.forEach((p) => { if (seq[seq.length - 1] !== p.nodeId) seq.push(p.nodeId); });
    return seq;
  }, [state.path]);
  const line = (seq) => seq.map((id) => `${NODE_BY_ID[id].x},${NODE_BY_ID[id].y}`).join(" ");
  const hi = new Set(highlight);
  const touched = new Set(state.path.map((p) => p.nodeId));

  return <div style={{ overflowX: compact ? "hidden" : "auto", overflowY: "hidden",
    WebkitOverflowScrolling: "touch", border: `1px solid ${C.dim}`, borderRadius: 3, background: C.paper }}>
    <svg viewBox="-10 10 930 720" preserveAspectRatio="xMidYMid meet"
      style={compact
        ? { width: "100%", height: "min(40vh, 340px)", display: "block" }
        : { width: "100%", minWidth: 700, height: "auto", display: "block" }}
      role="img" aria-label="The full knowledge graph of the language, with your progress marked">
      <defs><marker id="a2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 z" fill={C.dim} /></marker></defs>

      {EDGES.map((e, i) => {
        const a = NODE_BY_ID[e.from], b = NODE_BY_ID[e.to];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const live = state.nodes[e.from].mastery >= PREREQ;
        return <line key={i} x1={a.x + (dx / len) * R} y1={a.y + (dy / len) * R}
          x2={b.x - (dx / len) * (R + 5)} y2={b.y - (dy / len) * (R + 5)}
          stroke={live ? C.mid : C.dim} strokeOpacity={dim ? 0.18 : live ? 0.5 : 0.22}
          strokeWidth={live ? 1.5 : 1} strokeDasharray={e.soft ? "4 4" : undefined} markerEnd="url(#a2)" />;
      })}

      {mode === "path" && pathNodes.length > 1 && <>
        <polyline points={line(pathNodes)} fill="none" stroke={C.ink} strokeWidth="2.2"
          strokeLinejoin="round" strokeLinecap="round" opacity="0.85" className="sig-trace" strokeDasharray="4000" />
        {pathNodes.map((id, i) => <g key={`p${i}`} className="sig-step" style={{ animationDelay: `${i * 0.09}s` }}>
          <circle cx={NODE_BY_ID[id].x + 16} cy={NODE_BY_ID[id].y - 16} r="9.5" fill={C.ink} />
          <text x={NODE_BY_ID[id].x + 16} y={NODE_BY_ID[id].y - 12.5} textAnchor="middle"
            fontFamily={MONO} fontSize="10" fill={C.cream}>{i + 1}</text></g>)}
      </>}

      {samplePath && samplePath.length > 1 &&
        <polyline points={line(samplePath)} fill="none" stroke={C.warn} strokeWidth="2.2"
          strokeDasharray="7 6" strokeLinejoin="round" opacity="0.9" />}

      {NODES.map((n) => {
        const st = nodeStatus(state, n.id);
        const s = STATUS[st];
        const d = state.nodes[n.id];
        const isHi = hi.has(n.id);
        const faded = dim && !touched.has(n.id);
        const circ = 2 * Math.PI * (R - 3);
        return <g key={n.id} onClick={onSelect ? () => onSelect(n.id) : undefined}
          tabIndex={onSelect ? 0 : undefined} role={onSelect ? "button" : "img"}
          aria-label={`${n.name}. ${s.label}.`} className="sig-node"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect && onSelect(n.id); } }}
          style={{ cursor: onSelect ? "pointer" : "default", opacity: faded ? 0.25 : 1, transition: "opacity .6s ease" }}>
          {st === "frontier" && !dim &&
            <circle cx={n.x} cy={n.y} r={R + 10} fill={C.ok} opacity="0.14" />}
          {(isHi || (st === "frontier" && !dim)) &&
            <circle cx={n.x} cy={n.y} r={R + 7} fill="none"
              stroke={isHi ? (highlightTone || C.warn) : C.ok}
              strokeWidth={isHi ? 2 : 2.4} opacity="0.95" className={isHi ? "sig-pulse" : "sig-frontier"}
              strokeDasharray={st === "frontier" && !isHi ? "4 4" : undefined} />}
          <circle cx={n.x} cy={n.y} r={R} fill={s.fill} stroke={s.stroke}
            strokeWidth={selected === n.id ? 3.2 : 2} opacity={st === "locked" ? 0.55 : 1} />
          {st === "developing" && <circle cx={n.x} cy={n.y} r={R - 3} fill="none" stroke={C.ink} strokeWidth="3"
            strokeDasharray={`${circ * Math.min(d.mastery, 1)} ${circ}`}
            transform={`rotate(-90 ${n.x} ${n.y})`} strokeLinecap="round" />}
          {s.mark && <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily={SANS} fontSize="13" fill={s.text}>{s.mark}</text>}
          {d.retrievalSuccesses > 0 && <g>
            <circle cx={n.x + 15} cy={n.y - 15} r="7.5" fill={C.cream} stroke={C.ink} strokeWidth="1.3" />
            <text x={n.x + 15} y={n.y - 11.5} textAnchor="middle" fontFamily={SANS} fontSize="9" fill={C.ink}>↻</text></g>}
          {d.inferred && <g>
            <circle cx={n.x - 15} cy={n.y - 15} r="7.5" fill={C.cream} stroke={C.ink} strokeWidth="1.3" />
            <text x={n.x - 15} y={n.y - 11.5} textAnchor="middle" fontFamily={SANS} fontSize="9" fill={C.ink}>◇</text></g>}
          <text x={n.x} y={n.y + R + 13} textAnchor="middle" fontFamily={MONO} fontSize="9.5"
            letterSpacing="0.03em" fill={st === "locked" ? C.dim : st === "frontier" ? C.ink : C.mid}
            stroke={C.paper} strokeWidth="3" paintOrder="stroke">{n.short}</text>
        </g>;
      })}
    </svg>
  </div>;
}

function Legend() {
  const items = [["strong", "Strong"], ["strengthened", "Strengthened"], ["developing", "Developing"],
    ["frontier", "Ready next"], ["shelved", "Set aside"], ["locked", "Not ready yet"]];
  return <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", marginTop: 14 }}>
    {items.map(([k, label]) => { const s = STATUS[k];
      return <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
          {k === "frontier" && <circle cx="10" cy="10" r="9" fill={C.ok} opacity="0.16" />}
          <circle cx="10" cy="10" r="8" fill={s.fill} stroke={s.stroke}
            strokeWidth={k === "frontier" ? 2.2 : 1.8}
            strokeDasharray={k === "frontier" ? "3 3" : undefined} />
          {s.mark && <text x="10" y="14" textAnchor="middle" fontSize="9" fill={s.text} fontFamily={SANS}>{s.mark}</text>}
          {k === "developing" && <path d="M10 3 A7 7 0 0 1 17 10" fill="none" stroke={C.ink} strokeWidth="2.4" />}
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.05em", color: C.mid, textTransform: "uppercase" }}>{label}</span>
      </div>; })}
    {[["↻", "Retrieved later"], ["◇", "Inferred"]].map(([m, l]) =>
      <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: SANS, fontSize: 13 }}>{m}</span>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.05em", color: C.mid, textTransform: "uppercase" }}>{l}</span>
      </div>)}
  </div>;
}

/* ------------------------------ sample learners ----------------------------- */

const SAMPLES = [
  { id: "A", name: "Fast structural inference",
    note: "Read the sentence rule off the placement question, so most vocabulary teaching was skipped. Spent the session in integration and transfer.",
    path: ["N01", "N24", "N03", "N15", "N09", "N22", "N10", "N23", "N31", "N17", "N33", "N36", "N37"] },
  { id: "B", name: "Strong recognition, weaker integration",
    note: "Named every symbol confidently. Multi-part messages stayed hard, so routing kept returning to two-part structures.",
    path: ["N01", "N03", "N07", "N10", "N09", "N05", "N22", "N24", "N23", "N22", "N24", "N29", "N24"] },
  { id: "C", name: "Past/future confusion and repair",
    note: "Reversed the time marks repeatedly. Targeted repair, then shelving, then productive work in number and negation instead.",
    path: ["N01", "N10", "N17", "N18", "N19", "N17", "N19", "N15", "N03", "N20", "N32", "N19"] },
  { id: "D", name: "Morphology strength with a syntax gap",
    note: "Inferred plural, tense and negation quickly. Word order needed explicit support before longer messages could open.",
    path: ["N01", "N03", "N15", "N17", "N20", "N21", "N34", "N09", "N22", "N22", "N24", "N29"] },
  { id: "E", name: "Shelved concept, productive elsewhere",
    note: "Direction would not stick. It was set aside and the session moved into the exchange region, which opened recipient structure.",
    path: ["N01", "N09", "N16", "N16", "N11", "N04", "N08", "N24", "N27", "N28", "N35", "N16"] },
];

/* -------------------------------- node story -------------------------------- */

function nodeStory(st, id) {
  const evs = st.path.filter((p) => p.nodeId === id);
  const s = st.nodes[id];
  const out = [];
  if (!evs.length) {
    out.push(prereqSatisfied(NODE_BY_ID[id], st)
      ? "You never reached this one, but everything underneath it was strong enough that it was available to you."
      : "This stayed out of reach. Something underneath it needed more evidence first.");
    const sup = st.path.filter((p) => (p.supportingNodes || []).includes(id));
    if (sup.length) out.push(`It did pick up ${sup.length} piece${sup.length === 1 ? "" : "s"} of indirect evidence from messages that used it.`);
    return out;
  }
  const first = evs[0];
  out.push(first.placement ? `First met in the opening questions, at step ${first.sequence + 1}.`
    : first.activityType === "teach" ? `First met at step ${first.sequence + 1}, as direct instruction.`
    : `First met at step ${first.sequence + 1}, as a ${first.evidenceType} question.`);
  if (s.inferred) out.push("You worked this rule out without being taught it.");
  if (s.fromPlacement) out.push("The opening questions gave the system a hypothesis about this, which later questions tested.");
  const wrong = evs.filter((e) => e.result === "incorrect");
  if (wrong.length) {
    const m = wrong.find((e) => e.misconception);
    out.push(m ? `An error at step ${m.sequence + 1} pointed at one thing: it ${MIS[m.misconception]}.`
      : `An error at step ${wrong[0].sequence + 1} pulled the estimate back down.`);
  }
  if (s.remediationCount) out.push("You were given a short targeted repair rather than the topic again from the start.");
  if (s.retrievalSuccesses) out.push(`It came back after other work and you retrieved it ${s.retrievalSuccesses === 1 ? "once" : s.retrievalSuccesses + " times"}.`);
  if (evs.some((e) => e.evidenceType === "transfer" && e.result === "correct"))
    out.push("You used it on a combination you had not practised.");
  if (s.everShelved) out.push("It was temporarily set aside so you could keep learning elsewhere.");
  if (s.everDropped && s.repairedAfterDrop) out.push("It weakened, then held again afterwards.");
  return out;
}

function NodeDetail({ state, id, onClose }) {
  const n = NODE_BY_ID[id];
  const st = nodeStatus(state, id);
  const s = state.nodes[id];
  const badges = [STATUS[st].label,
    s.retrievalSuccesses > 0 && "Retrieved later", s.inferred && "Inferred",
    s.everDropped && s.repairedAfterDrop && "Strengthened"].filter(Boolean);
  return <div style={{ border: `1px solid ${C.ink}`, borderRadius: 3, padding: "20px 22px", marginTop: 16, background: C.paper }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
      <div>
        <Eyebrow>{badges.join(" · ")}</Eyebrow>
        <h3 style={{ fontFamily: SERIF, fontSize: 22, margin: "0 0 6px" }}>{n.name}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.mid, margin: "0 0 14px", lineHeight: 1.5 }}>{n.desc}</p>
      </div>
      <button onClick={onClose} aria-label="Close concept details" className="sig-choice"
        style={{ background: "none", border: "none", color: C.mid, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
    </div>
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {nodeStory(state, id).map((l, i) =>
        <li key={i} style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.6, marginBottom: 6 }}>{l}</li>)}
    </ul>
  </div>;
}

function Reveal({ eyebrow, title, body, action, active }) {
  return <div style={{ borderTop: `1px solid ${C.dim}`, padding: "26px 0" }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h3 style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1.25, margin: "0 0 12px" }}>{title}</h3>
    {body.map((b, i) => <p key={i} style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.65, margin: "0 0 12px" }}>{b}</p>)}
    {action && <Button kind={active ? "solid" : "ghost"} onClick={action.onClick}>
      {active ? action.activeLabel : action.label}</Button>}
  </div>;
}

function CategoryList({ title, note, items, empty }) {
  return <div style={{ marginBottom: 24 }}>
    <Eyebrow>{title}</Eyebrow>
    {note && <p style={{ fontFamily: SANS, fontSize: 14, color: C.mid, margin: "-6px 0 10px", lineHeight: 1.5 }}>{note}</p>}
    {items.length === 0 ? <p style={{ fontFamily: SANS, fontSize: 15, color: C.dim, margin: 0 }}>{empty}</p>
      : <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((e) => <span key={e.id} style={{ fontFamily: SANS, fontSize: 14, border: `1px solid ${C.dim}`,
          borderRadius: 2, padding: "6px 11px", background: C.paper }}>{e.node.name}
          {e.badges.length > 0 && <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.mid, marginLeft: 8,
            letterSpacing: "0.05em" }}>{e.badges.join(" · ").toUpperCase()}</span>}</span>)}
      </div>}
  </div>;
}

/* --------------------------- developer inspector ---------------------------- */

function DebugPanel({ state, current }) {
  const rows = NODES.map((n) => ({ n, s: state.nodes[n.id] }))
    .filter((r) => r.s.mastery > 0 || r.s.wrongCount > 0)
    .sort((a, b) => b.s.mastery - a.s.mastery);
  const cell = { padding: "3px 8px", fontFamily: MONO, fontSize: 10.5, borderBottom: `1px solid rgba(184,162,200,.3)` };
  return <div style={{ marginTop: 28, border: `1px solid ${C.warn}`, borderRadius: 3, padding: 14, background: "#fff" }}>
    <Eyebrow tone={C.warn}>Engine inspector · not shown to learners</Eyebrow>
    <div style={{ fontFamily: MONO, fontSize: 11, lineHeight: 1.7, color: C.ink }}>
      <div>interaction {state.interaction} · seed {state.seed} · answered {state.metrics.answered} · correct {state.metrics.correct}</div>
      <div>frontier: {getFrontier(state).join(" ") || "—"}</div>
      <div>due retrieval: {NODES.filter((n) => state.nodes[n.id].nextRetrievalDue !== null &&
        state.interaction >= state.nodes[n.id].nextRetrievalDue).map((n) => n.id).join(" ") || "—"}</div>
      <div>shelved: {NODES.filter((n) => isShelved(n.id, state)).map((n) => n.id).join(" ") || "—"}</div>
      <div>misconceptions: {Object.entries(state.misconceptions).map(([k, v]) => `${k}×${v}`).join(" ") || "—"}</div>
      <div>placement: {Object.entries(state.placementEvidence).map(([k, v]) => `${k}:${v.correct ? "✓" : "✗"}`).join(" ") || "—"}</div>
      {current && <div style={{ marginTop: 8, color: C.warn }}>
        selected: {current.activity.id} · {current.kind} · node {current.nodeId} — {current.why}</div>}
    </div>
    <div style={{ marginTop: 12, maxHeight: 190, overflow: "auto" }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", color: C.mid, marginBottom: 4 }}>CANDIDATES CONSIDERED</div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}><tbody>
        {state.lastCandidates.map((c, i) => <tr key={i}>
          <td style={cell}>{c.score}</td><td style={cell}>{c.kind}</td>
          <td style={cell}>{c.node}</td><td style={cell}>{c.id}</td><td style={{ ...cell, color: C.mid }}>{c.why}</td>
        </tr>)}
      </tbody></table>
    </div>
    <div style={{ marginTop: 12, maxHeight: 190, overflow: "auto" }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", color: C.mid, marginBottom: 4 }}>MASTERY</div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}><tbody>
        {rows.map(({ n, s }) => <tr key={n.id}>
          <td style={cell}>{n.id}</td><td style={cell}>{n.short}</td>
          <td style={cell}>{s.mastery.toFixed(2)}</td>
          <td style={{ ...cell, color: C.mid }}>{[s.inferred && "inf", s.retrievalSuccesses && `ret×${s.retrievalSuccesses}`,
            s.everShelved && "shelved", s.everDropped && "dropped", s.wrongCount && `wrong×${s.wrongCount}`]
            .filter(Boolean).join(" ")}</td>
        </tr>)}
      </tbody></table>
    </div>
  </div>;
}

/* ================================== results ================================= */

const CAPTION = { frontier: "showing your frontier", placement: "showing placement seeds",
  inferred: "showing what you inferred", spacing: "showing what came back",
  inter: "tracing your path", error: "showing the rerouted concept", shelved: "showing what was set aside" };

function Results({ state, onRestart, facilitator, debug }) {
  const [stage, setStage] = useState("whole");   // whole → yours
  const [mode, setMode] = useState("path");
  const [selected, setSelected] = useState(null);
  const [highlight, setHighlight] = useState([]);
  const [reveal, setReveal] = useState(null);
  const [sample, setSample] = useState(null);

  const cats = useMemo(() => categorise(state), [state]);
  const frontier = getFrontier(state).filter((id) => state.nodes[id].mastery < PREREQ);
  const known = NODES.filter((n) => state.nodes[n.id].mastery >= PREREQ).length;
  const built = Math.max(0, known - state.initialKnown.length);
  const retrieved = NODES.filter((n) => state.nodes[n.id].retrievalSuccesses > 0).map((n) => n.id);
  const inferredIds = NODES.filter((n) => state.nodes[n.id].inferred).map((n) => n.id);
  const shelvedIds = NODES.filter((n) => state.nodes[n.id].everShelved).map((n) => n.id);
  const untouched = NODES.filter((n) => !state.path.some((p) => p.nodeId === n.id)).length;
  const pivotal = state.path.find((p) => p.result === "incorrect" && p.misconception);
  const placementHits = Object.entries(state.placementEvidence).filter(([, v]) => v.correct);

  const show = (id, nodes, m) => {
    if (reveal === id) { setReveal(null); setHighlight([]); return; }
    setReveal(id); setHighlight(nodes); if (m) setMode(m);
  };

  if (stage === "whole") {
    return <Shell wide>
      <Wordmark right="SIGNAL DECODED" />
      <Eyebrow>The whole language</Eyebrow>
      <h1 style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.15, fontWeight: 400, margin: "0 0 18px" }}>
        Here is the language.</h1>
      <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 24px", maxWidth: 640 }}>
        Thirty-eight connected ideas. Nobody sees all of it in nine minutes — you were never meant to.
      </p>
      <KnowledgeGraph state={state} mode="mastery" dim onSelect={null} />
      <div style={{ marginTop: 26 }}>
        <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 20px" }}>
          The lit part is what your learning opened. You reached {NODES.length - untouched} of the {NODES.length}.
        </p>
        <Button onClick={() => setStage("yours")} full>Show what I did</Button>
      </div>
    </Shell>;
  }

  const summary = [
    `You started with ${state.initialKnown.length} ${state.initialKnown.length === 1 ? "idea" : "ideas"} already within reach.`,
    `You built ${built} new ${built === 1 ? "idea" : "ideas"}.`,
    state.metrics.inferred > 0 && `You inferred ${state.metrics.inferred} ${state.metrics.inferred === 1 ? "pattern" : "patterns"} without being taught.`,
    state.metrics.strengthened > 0 && `You strengthened ${state.metrics.strengthened} after an error.`,
    state.metrics.retrievalSuccesses > 0 && `You retrieved ${state.metrics.retrievalSuccesses} after working on something else.`,
    state.metrics.transferSuccesses > 0 && `You applied ${state.metrics.transferSuccesses} ${state.metrics.transferSuccesses === 1 ? "rule" : "rules"} in situations you had not practised.`,
    state.metrics.shelved > 0 && `You temporarily set aside ${state.metrics.shelved}.`,
    `${frontier.length} ${frontier.length === 1 ? "idea is" : "ideas are"} now within reach that you have not learned yet.`,
    `${untouched} ${untouched === 1 ? "idea" : "ideas"} you never met at all.`,
  ].filter(Boolean);

  const tab = (id, label) => <button onClick={() => { setMode(id); setHighlight([]); setReveal(null); }}
    className="sig-choice" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em",
      textTransform: "uppercase", padding: "9px 14px", cursor: "pointer", borderRadius: 2,
      border: `1px solid ${mode === id ? C.ink : C.dim}`, background: mode === id ? C.ink : "transparent",
      color: mode === id ? C.cream : C.mid }}>{label}</button>;

  return <Shell wide>
    <Wordmark right="SESSION COMPLETE" />
    <Eyebrow>Your learning path</Eyebrow>
    <h1 style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.15, fontWeight: 400, margin: "0 0 22px" }}>
      No two people ended this in the same place.</h1>
    <ul style={{ margin: "0 0 26px", paddingLeft: 20 }}>
      {summary.map((s, i) => <li key={i} style={{ fontFamily: SANS, fontSize: 16.5, lineHeight: 1.7 }}>{s}</li>)}
    </ul>

    {state.finalBuild && state.finalBuild.ok && <div style={{ border: `1px solid ${C.ok}`,
      background: "rgba(34,197,94,0.08)", borderRadius: 3, padding: "18px 20px", marginBottom: 32 }}>
      <Eyebrow tone={C.mid}>The message you wrote</Eyebrow>
      <p style={{ fontFamily: SERIF, fontSize: 25, lineHeight: 1.3, margin: "0 0 10px" }}>
        {state.finalBuild.gloss}</p>
      <p style={{ fontFamily: SANS, fontSize: 15, color: C.mid, margin: 0, lineHeight: 1.55 }}>
        Built from {state.finalBuild.rules.length} {state.finalBuild.rules.length === 1 ? "rule" : "rules"} you
        established during the session. Nobody showed you that sentence, and nobody else in the room wrote it.</p>
    </div>}

    <div style={{ position: "sticky", top: 0, zIndex: 5, background: C.cream,
      paddingTop: 6, paddingBottom: 10, marginBottom: 4,
      boxShadow: `0 10px 14px -12px rgba(61,26,78,0.28)` }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        {tab("path", "Your path")}{tab("mastery", "Mastery")}{tab("frontier", "Frontier")}
        {CAPTION[reveal]
          ? <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
              color: reveal === "frontier" ? C.ok : C.warn, marginLeft: "auto" }}>{CAPTION[reveal]}</span>
          : <button onClick={() => setStage("whole")} className="sig-choice" style={{ marginLeft: "auto",
              background: "none", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: 10,
              letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid }}>whole language</button>}
      </div>
      <KnowledgeGraph state={state} mode={mode} highlight={mode === "frontier" ? getFrontier(state) : highlight}
        highlightTone={mode === "frontier" || reveal === "frontier" ? C.ok : C.warn}
        selected={selected} onSelect={setSelected} compact
        samplePath={sample ? SAMPLES.find((s) => s.id === sample).path : null} />
    </div>
    <Legend />
    <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", color: C.mid, marginTop: 12 }}>
      TAP ANY CONCEPT FOR WHAT HAPPENED THERE · THE MAP STAYS PUT WHILE YOU SCROLL</p>
    {selected && <NodeDetail state={state} id={selected} onClose={() => setSelected(null)} />}

    <div style={{ marginTop: 38 }}>
      <Reveal eyebrow="Reveal 01" title="The glowing edge is your knowledge frontier." active={reveal === "frontier"}
        body={["These are the ideas whose prerequisites are strong enough that you are ready for them, but which you have not learned yet.",
          "Someone next to you has a different frontier after exactly the same amount of time."]}
        action={{ label: "Show my frontier", activeLabel: "Showing frontier",
          onClick: () => show("frontier", getFrontier(state), "frontier") }} />

      {placementHits.length > 0 && <Reveal eyebrow="Reveal 02" title="Your first three answers were a hypothesis, not a level."
        active={reveal === "placement"}
        body={[`At the start you got ${placementHits.length} of the opening questions right. That did not put you on a track — it gave the system a provisional guess about what you already knew.`,
          "Everything after that was testing whether the guess held. Some of it did. Some of it had to be revised."]}
        action={{ label: "Show what placement seeded", activeLabel: "Showing placement",
          onClick: () => show("placement", placementHits.map(([k]) => k), "mastery") }} />}

      {inferredIds.length > 0 && <Reveal eyebrow="Reveal 03" title="You worked some rules out on your own."
        active={reveal === "inferred"}
        body={[`${inferredIds.length} ${inferredIds.length === 1 ? "idea was" : "ideas were"} never taught to you. You read them out of the structure of the symbols.`,
          "The system counted that as stronger evidence than getting a taught rule right, because discovering a pattern requires more than remembering one."]}
        action={{ label: "Show what you inferred", activeLabel: "Showing inferred",
          onClick: () => show("inferred", inferredIds, "mastery") }} />}

      <Reveal eyebrow="Reveal 04" title="Some ideas came back after you had moved on." active={reveal === "spacing"}
        body={["Getting something right while it is fresh is a different thing from retrieving it after intervening work.",
          retrieved.length ? `${retrieved.length} ${retrieved.length === 1 ? "idea survived" : "ideas survived"} that gap. The spacing was counted in interactions, not minutes.`
            : "You did not reach a spaced retrieval — usually that means the session ended before the first check came due."]}
        action={retrieved.length ? { label: "Show what returned", activeLabel: "Showing returns",
          onClick: () => show("spacing", retrieved, "mastery") } : null} />

      <Reveal eyebrow="Reveal 05" title="You never finished one topic before starting another." active={reveal === "inter"}
        body={["Vocabulary, rules, decoding and older ideas were deliberately mixed, and the path crossed between regions of the language.",
          "That may have felt unpredictable. It was not random — every step had to satisfy the prerequisites underneath it."]}
        action={{ label: "Trace my path", activeLabel: "Tracing path", onClick: () => show("inter", [], "path") }} />

      {pivotal && <Reveal eyebrow="Reveal 06" title="One of your wrong answers changed what came next."
        active={reveal === "error"}
        body={[`At step ${pivotal.sequence + 1} your answer suggested one specific thing: it ${MIS[pivotal.misconception]}.`,
          "The response was not marked wrong and filed away. It was read as evidence about which idea needed attention, and it changed the next question you saw."]}
        action={{ label: "Show that concept", activeLabel: "Showing concept",
          onClick: () => { show("error", [pivotal.nodeId], "mastery"); setSelected(pivotal.nodeId); } }} />}

      {shelvedIds.length > 0 && <Reveal eyebrow="Reveal 07" title="One idea was set aside rather than drilled."
        active={reveal === "shelved"}
        body={["You worked on this and it was not ready to stick yet.",
          "Instead of holding you there, the system left it alone and found somewhere else productive to go."]}
        action={{ label: "Show what was set aside", activeLabel: "Showing set aside",
          onClick: () => show("shelved", shelvedIds, "mastery") }} />}
    </div>

    <div style={{ borderTop: `1px solid ${C.dim}`, paddingTop: 30, marginTop: 14 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 400, margin: "0 0 24px" }}>Where each idea ended up</h2>
      <CategoryList title="Strong" note="Enough application or transfer evidence to count as durable." items={cats.strong} empty="Nothing reached this level in the time available." />
      <CategoryList title="Inferred" note="Discovered without being taught." items={cats.inferred} empty="Every rule you learned was shown to you first." />
      <CategoryList title="Retrieved later" note="Recalled after other work came in between." items={cats.retrieved} empty="No retrieval checks came due before the session ended." />
      <CategoryList title="Strengthened" note="Weakened after an error, then repaired." items={cats.strengthened} empty="Nothing needed repairing." />
      <CategoryList title="Developing" note="Real but partial evidence." items={cats.developing} empty="Nothing sitting in between." />
      <CategoryList title="Ready next" note="Prerequisites satisfied. You simply did not get here." items={cats.ready} empty="Nothing waiting." />
      <CategoryList title="Not ready yet" note="Something underneath these needs more evidence first." items={cats.notReady} empty="Everything was reachable." />
    </div>

    {facilitator && <div style={{ borderTop: `1px solid ${C.dim}`, paddingTop: 26, marginTop: 10 }}>
      <Eyebrow>Facilitator</Eyebrow>
      <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.6, margin: "0 0 14px" }}>
        Overlay another learner's route through the same graph. All five reached a productive place. None took the same road.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {SAMPLES.map((s) => <Button key={s.id} kind={sample === s.id ? "solid" : "ghost"}
          onClick={() => setSample(sample === s.id ? null : s.id)}>{s.name}</Button>)}</div>
      {sample && <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.6, color: C.mid,
        borderLeft: `2px solid ${C.warn}`, paddingLeft: 14 }}>{SAMPLES.find((s) => s.id === sample).note}</p>}
    </div>}

    {debug && <DebugPanel state={state} />}

    <div style={{ borderTop: `1px solid ${C.dim}`, marginTop: 30, paddingTop: 40 }}>
      <Eyebrow>Now scale it</Eyebrow>
      <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 14px" }}>
        You just moved through part of a language built from thirty-eight connected ideas. Math Academy maps a far larger network of mathematical knowledge the same way.</p>
      <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 30px" }}>
        Students do not need to move through one shared sequence of lessons. They learn from the edge of what they currently know.</p>
      <p style={{ fontFamily: SERIF, fontSize: 32, lineHeight: 1.2, margin: "0 0 10px" }}>Nonlinear does not mean random.</p>
      <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: C.mid, margin: "0 0 8px" }}>
        The structure comes from the relationships among knowledge. The path comes from the learner.</p>
      <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: C.mid, margin: "0 0 30px" }}>
        The glowing edge you saw was your knowledge frontier.</p>
      <div style={{ border: `1px solid ${C.dim}`, borderRadius: 3, padding: "18px 20px", marginBottom: 30 }}>
        <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.6, margin: 0 }}>
          Compare your graph with someone near you. Where did your learning diverge?</p></div>
      <Button kind="ghost" onClick={onRestart}>Run the signal again</Button>
    </div>
  </Shell>;
}

/* ==================================== app =================================== */

const MAX_LEARN = 28;
const LEARN_SECONDS = 7 * 60;
const LABEL = { recognition: "Recognition", discrimination: "Discrimination", application: "Application",
  retrieval: "Returning to something earlier", transfer: "New combination",
  generation: "Build a signal", inference: "Work out the rule" };

export default function Page() {
  const params = useMemo(() => { try { return new URLSearchParams(window.location.search); }
    catch { return new URLSearchParams(""); } }, []);
  const seedParam = Number(params.get("seed"));
  const [facilitator, setFacilitator] = useState(params.get("facilitator") === "true");
  const [debug, setDebug] = useState(params.get("debug") === "true");
  const [seed, setSeed] = useState(Number.isFinite(seedParam) && seedParam ? seedParam : Math.floor(Math.random() * 99999));

  const engine = useRef(null);
  if (engine.current === null) engine.current = initState(seed);
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);

  const [phase, setPhase] = useState("intro1");
  const [plIndex, setPlIndex] = useState(0);
  const [current, setCurrent] = useState(null);
  const [finals, setFinals] = useState([]);
  const [finalIndex, setFinalIndex] = useState(0);
  const [note, setNote] = useState(null);
  const learnStart = useRef(null);
  const s = engine.current;

  const restart = () => {
    const ns = Math.floor(Math.random() * 99999);
    setSeed(ns); engine.current = initState(ns);
    setPhase("intro1"); setPlIndex(0); setCurrent(null); setFinals([]); setFinalIndex(0); setNote(null); rerender();
  };

  const answer = (act, correct, choiceId, evidenceType, verdict) => {
    const before = getFrontier(s).length;
    if (act.type === "freebuild" && verdict) {
      s.finalBuild = { ok: verdict.ok, gloss: verdict.gloss, rules: verdict.rules || [], error: verdict.error };
      act = { ...act, supportingNodes: verdict.nodes || [] };
    }
    applyEvidence(s, act, correct, { choiceId, evidenceType });
    const gained = getFrontier(s).length - before;
    if (gained > 0) s.metrics.unlocked += gained;
    setNote(gained > 0 && rand() > 0.45
      ? `${gained} new ${gained === 1 ? "possibility" : "possibilities"} unlocked` : null);
    rerender();
  };

  const beginLearning = () => {
    s.initialKnown = NODES.filter((n) => s.nodes[n.id].mastery >= PREREQ).map((n) => n.id);
    learnStart.current = Date.now();
    const next = chooseNextActivity(s);
    if (next) { setCurrent(next); setPhase("learn"); }
    else { setFinals(chooseFinalChallenges(s)); setPhase("final"); }
    rerender();
  };

  const nextInLearning = () => {
    setNote(null); s.interaction += 1;
    const elapsed = (Date.now() - (learnStart.current || Date.now())) / 1000;
    const done = s.interaction - PLACEMENT.length >= MAX_LEARN || elapsed >= LEARN_SECONDS;
    const next = done ? null : chooseNextActivity(s);
    if (next) { setCurrent(next); rerender(); return; }
    const f = chooseFinalChallenges(s);
    setFinals(f); setFinalIndex(0); setPhase(f.length ? "final" : "decoded"); rerender();
  };

  const wrap = (inner, right) => <Shell><Styles /><Wordmark right={right} />{inner}
    {debug && phase !== "results" && <DebugPanel state={s} current={current} />}</Shell>;

  if (phase === "intro1") return <Shell><Styles /><Wordmark />
    <div style={{ display: "flex", justifyContent: "center", margin: "30px 0 38px", gap: 16, flexWrap: "wrap" }}>
      {["CREATURE", "MOVE+r", "OBJECT+p", "GIVE+past"].map((g, i) =>
        <div key={g} className="sig-arrive" style={{ animationDelay: `${0.15 + i * 0.2}s` }}>
          <AlienGlyph code={g} size={66} tone={C.mid} /></div>)}
    </div>
    <h1 style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.1, fontWeight: 400, margin: "0 0 22px" }}>
      A signal has arrived.</h1>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 14px" }}>
      Researchers have decoded part of an unknown language. Your job is to learn as much of it as you can.</p>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 34px", color: C.mid }}>
      Your path will change based on what you already know and what you learn along the way.</p>
    <Button onClick={() => setPhase("intro2")} full>Decode the signal</Button>
    <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
      <button onClick={() => setFacilitator((f) => !f)} className="sig-choice" style={{ background: "none",
        border: "none", cursor: "pointer", fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em",
        color: facilitator ? C.ink : C.dim }}>FACILITATOR {facilitator ? "ON" : "OFF"}</button>
      <button onClick={() => setDebug((d) => !d)} className="sig-choice" style={{ background: "none",
        border: "none", cursor: "pointer", fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em",
        color: debug ? C.warn : C.dim }}>ENGINE {debug ? "ON" : "OFF"}</button>
    </div>
  </Shell>;

  if (phase === "intro2") return <Shell><Styles /><Wordmark />
    <h1 style={{ fontFamily: SERIF, fontSize: 36, lineHeight: 1.15, fontWeight: 400, margin: "40px 0 22px" }}>
      There is no set sequence.</h1>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 14px" }}>
      You may learn something new, meet something familiar in a new way, or suddenly work on something completely different.</p>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 34px", color: C.mid }}>That is intentional.</p>
    <Button onClick={() => { s.nodes.N01.mastery = 0.5; s.nodes.N01.introduced = true; setPhase("placeIntro"); }} full>Begin</Button>
  </Shell>;

  if (phase === "placeIntro") return <Shell><Styles /><Wordmark right="FIRST CONTACT" />
    <h1 style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1.2, fontWeight: 400, margin: "40px 0 20px" }}>
      Researchers have already decoded a few pieces.</h1>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 34px", color: C.mid }}>
      See what you can work out from their notes.</p>
    <Button onClick={() => setPhase("placement")} full>Read the notes</Button></Shell>;

  if (phase === "placement") {
    const act = PLACEMENT[plIndex];
    return wrap(<ActivityCard activity={act} evidenceLabel="Sampling the signal"
      onAnswer={(ok, id) => answer(act, ok, id)}
      onNext={() => { s.interaction += 1;
        if (plIndex + 1 < PLACEMENT.length) setPlIndex(plIndex + 1); else setPhase("analysed"); }} />,
      "FIRST CONTACT");
  }

  if (phase === "analysed") return <Shell><Styles /><Wordmark />
    <h1 style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.15, fontWeight: 400, margin: "60px 0 16px" }}>
      Signal analysed.</h1>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 34px", color: C.mid }}>
      Finding your starting point…</p>
    <Button onClick={beginLearning} full>Keep decoding</Button></Shell>;

  if (phase === "learn" && current) {
    const act = current.activity;
    const strong = NODES.filter((n) => s.nodes[n.id].mastery >= PROVISIONAL).length;
    return <Shell><Styles />
      <Wordmark right={`${strong} IDEAS STRONG · ${getFrontier(s).length} UNLOCKED`} />
      <ActivityCard activity={act} note={note}
        evidenceLabel={current.kind === "retrieval" ? LABEL.retrieval
          : act.type === "teach" ? "New signal" : LABEL[current.evidenceType || act.evidenceType]}
        onAnswer={(ok, id) => answer(act, ok, id, current.evidenceType)}
        onNext={() => { if (act.type === "teach") applyTeach(s, act); nextInLearning(); }} />
      <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.14em", color: C.dim,
        textAlign: "center", marginTop: 34 }}>KEEP DECODING. YOUR PATH IS ADAPTING AS YOU LEARN.</p>
      {debug && <DebugPanel state={s} current={current} />}
    </Shell>;
  }

  if (phase === "final") {
    const act = finals[finalIndex];
    if (!act) { setPhase("decoded"); return null; }
    return wrap(<ActivityCard activity={act}
      evidenceLabel={act.type === "freebuild" ? "Your own message" : "Everything you have, at once"}
      onAnswer={(ok, id, v) => answer(act, ok, id, undefined, v)}
      onNext={() => { s.interaction += 1;
        if (finalIndex + 1 < finals.length) setFinalIndex(finalIndex + 1); else setPhase("decoded"); }} />,
      "LAST FRAGMENTS");
  }

  if (phase === "decoded") return <Shell><Styles /><Wordmark />
    <h1 style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.1, fontWeight: 400, margin: "60px 0 20px" }}>
      Signal decoded.</h1>
    <p style={{ fontFamily: SANS, fontSize: 18, lineHeight: 1.7, margin: "0 0 36px", color: C.mid }}>
      You did not follow a lesson sequence.</p>
    <Button onClick={() => setPhase("results")} full>See how you learned</Button></Shell>;

  if (phase === "results") return <><Styles />
    <Results state={s} onRestart={restart} facilitator={facilitator} debug={debug} /></>;

  return <Shell><Styles /><Wordmark />
    <h1 style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 1.15, fontWeight: 400, margin: "60px 0 20px" }}>
      The signal has gone quiet.</h1>
    <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.7, margin: "0 0 32px", color: C.mid }}>
      There is nothing left in the fragment that you are ready for.</p>
    <Button onClick={() => setPhase("results")} full>See how you learned</Button></Shell>;
}

function Styles() {
  return <style>{`
    .sig-btn:hover:not(:disabled) { filter: brightness(1.12); }
    .sig-choice:hover:not(:disabled) { border-color: ${C.ink}; }
    .sig-btn:focus-visible, .sig-choice:focus-visible, .sig-node:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
    .sig-node:focus { outline: none; }
    .sig-trace { animation: sig-draw 2.6s ease-out forwards; }
    @keyframes sig-draw { from { stroke-dashoffset: 4000; } to { stroke-dashoffset: 0; } }
    .sig-step { opacity: 0; animation: sig-fade .4s ease-out forwards; }
    @keyframes sig-fade { to { opacity: 1; } }
    .sig-arrive { opacity: 0; animation: sig-rise .7s ease-out forwards; }
    @keyframes sig-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    .sig-pulse { animation: sig-glow 1.9s ease-in-out infinite; }
    @keyframes sig-glow { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
    .sig-frontier { animation: sig-soft 3.2s ease-in-out infinite; }
    @keyframes sig-soft { 0%,100% { opacity: .62; } 50% { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .sig-trace, .sig-step, .sig-arrive, .sig-pulse, .sig-frontier { animation: none !important; opacity: 1 !important; stroke-dashoffset: 0 !important; }
    }
  `}</style>;
}
