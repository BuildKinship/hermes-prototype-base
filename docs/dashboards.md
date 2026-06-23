# Dashboard, Animation & Other Prototype Guide

> This guide covers dashboard pages, data visualisations, animations, 3D scenes,
> and any prototype type not covered by `docs/surveys.md` or `docs/slideshows.md`.
> Read `CLAUDE.md` first, then come back here.

---

## Dashboard Prototypes

### Layout pattern (Hearth / Horizon)
```tsx
// app/my-dashboard/page.tsx
"use client";
// needed for interactive filters / useState

export default function Page() {
  return (
    <div className="flex min-h-screen bg-[var(--kinship-cream)]">
      {/* Sidebar — 240px, ink background */}
      <aside className="w-60 shrink-0 bg-[var(--kinship-ink)] flex flex-col p-6 gap-2">
        <p className="text-[var(--kinship-cream)] text-serif text-lg mb-6">kinship</p>
        {/* nav items: lowercase, mid color, ink hover */}
        <a className="text-[var(--kinship-mid)] text-sm lowercase px-3 py-2 rounded-md hover:bg-white/10">
          dashboard
        </a>
        <a className="text-[var(--kinship-cream)] text-sm lowercase px-3 py-2 rounded-md bg-white/10">
          students   {/* active state */}
        </a>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <FadeUp>
          <StatGrid>
            <StatCard label="CLASS ACCURACY" value="74%" subtext="↑ 3% this week" />
            <StatCard label="ACTIVE TODAY"   value="18" subtext="of 24 students" />
            <StatCard label="SESSIONS"       value="132" />
            <StatCard label="TIME ON TASK"   value="28 min" subtext="avg per student" />
          </StatGrid>
        </FadeUp>
        {/* rest of content */}
      </main>
    </div>
  );
}
```

### Sidebar nav rules
- Items: **lowercase** (not title case, not uppercase)
- Active item: `bg-white/10`, cream text
- Inactive item: mid text, ink bg
- No icons unless they already exist in `lucide-react` and add real clarity

### Content area rules
- Page background: always `bg-[var(--kinship-cream)]`
- Section padding: `p-8` on main, `gap-6` between sections
- Use `<FadeUp>` for each section entrance — one `<FadeUp>` per logical section
- Use `<Stagger>` for grids of cards (students, activities, subjects)

---

## Kinship UI Components

### `StatCard` + `StatGrid`
```tsx
import { StatCard, StatGrid } from "@/components/kinship/stat-card";

// Grid: responsive 4→2→1 columns
<StatGrid>
  <StatCard
    label="CLASS ACCURACY"          // section-label style (auto-uppercased)
    value="74%"                      // large serif number
    subtext="↑ 3% this week"         // small dim subtext
    accent="var(--kinship-mid)"      // optional: colors the value text
  />
  <StatCard label="STUDENTS" value={24} />
</StatGrid>
```

### `AccuracyRing`
```tsx
import { AccuracyRing } from "@/components/kinship/accuracy-ring";

// SVG circular progress — color follows accuracy thresholds automatically
// ≥75% → green, 50–74% → amber, <50% → red, null → gray
<AccuracyRing
  accuracy={74}      // 0–100, or null for "no data"
  size={48}          // outer diameter in px (default 48)
  strokeWidth={4}    // ring thickness (default 4)
/>
```

### `StudentAvatar`
```tsx
import { StudentAvatar } from "@/components/kinship/student";

// Deterministic color avatar from initials
<StudentAvatar
  name="Lena Abramov"   // generates initials + deterministic bg color
  size="md"             // "sm" | "md" | "lg"
/>
```

### `StudentStatusIndicator`
```tsx
import { StudentStatusIndicator } from "@/components/kinship/student";

<StudentStatusIndicator status="active" />
// status: "active" | "struggling" | "needs-attention" | "inactive" | "offline"
// Renders a colored dot
```

### `SubjectBadge` + `PlatformBadge` + `SubjectDot`
```tsx
import { SubjectBadge, PlatformBadge, SubjectDot } from "@/components/kinship/badges";

<SubjectBadge subject="math" />          // pill badge with subject color
<PlatformBadge platform="hearth" />      // pill badge for platform
<SubjectDot subject="reading" />         // small colored dot
```

---

## Mock Data Pattern

All visual data lives in `mock/`. Create a file per entity type.

```typescript
// mock/students.ts
export interface Student {
  id: string;
  name: string;
  grade: number;
  accuracy: number | null;        // null = no data yet
  status: "active" | "struggling" | "needs-attention" | "inactive" | "offline";
  subjects: string[];
  minutesToday?: number;
}

export const students: Student[] = [
  { id: "s1", name: "Lena Abramov",    grade: 3, accuracy: 87, status: "active",        subjects: ["math", "reading"], minutesToday: 34 },
  { id: "s2", name: "Noah Chen",       grade: 3, accuracy: 54, status: "struggling",    subjects: ["math"],            minutesToday: 12 },
  { id: "s3", name: "Priya Sharma",    grade: 3, accuracy: 91, status: "active",        subjects: ["math", "science"], minutesToday: 41 },
  { id: "s4", name: "Marcus Williams", grade: 3, accuracy: 48, status: "needs-attention",subjects: ["reading"],         minutesToday: 8  },
  { id: "s5", name: "Sofia Torres",    grade: 3, accuracy: null, status: "offline",     subjects: ["math", "reading"], minutesToday: 0  },
  // aim for 10–15 students — enough to tell a story
];
```

**Mock data rules:**
- Realistic names — diverse, no "John Doe" or "Student 1"
- Realistic numbers — accuracy in 45–98% range, not round multiples of 10
- Enough records to show patterns (min 8 for a student list, min 4 for a subject breakdown)
- No real Kinship customer names

---

## Charts with Recharts

```tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { subject: "Math",    accuracy: 74 },
  { subject: "Reading", accuracy: 68 },
  { subject: "Science", accuracy: 81 },
];

<ResponsiveContainer width="100%" height={220}>
  <BarChart data={data} barSize={28}>
    <XAxis dataKey="subject" tick={{ fill: "var(--kinship-mid)", fontSize: 12 }} axisLine={false} tickLine={false} />
    <YAxis hide />
    <Tooltip
      contentStyle={{ background: "var(--kinship-ink)", border: "none", borderRadius: 8, color: "var(--kinship-cream)", fontSize: 12 }}
      cursor={{ fill: "color-mix(in oklch, var(--kinship-mid) 10%, transparent)" }}
    />
    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
      {data.map((entry) => (
        <Cell key={entry.subject} fill={entry.accuracy >= 75 ? "var(--kinship-mid)" : "var(--kinship-dim)"} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
```

**Recharts rules:**
- Always wrap in `<ResponsiveContainer width="100%" height={N}>` — never fixed width
- Tooltip style: ink background, cream text, no border
- Axis lines and tick lines: `axisLine={false} tickLine={false}` — cleaner look
- Bar colors: use brand vars, not arbitrary hex
- No legends unless there are 3+ series — use axis labels instead

---

## Animation Prototypes

### Simple entrance animations — use provided primitives
```tsx
import { FadeUp, Stagger } from "@/components/animations/fade";

// FadeUp: single section
<FadeUp><MySection /></FadeUp>

// Stagger: grid of identical items
<Stagger className="grid grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</Stagger>
```

### Framer Motion for custom animations
```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as unknown as import("framer-motion").Transition["ease"];

<motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: EASE }}
>
  ...
</motion.div>
```

### GSAP for timeline sequences
```tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const el = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (!el.current) return;
  const tl = gsap.timeline();
  tl.from(el.current, { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" });
  return () => { tl.kill(); };
}, []);
```

---

## 3D Prototypes (React Three Fiber)

```tsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RotatingShape() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#7A5590" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

export default function Page() {
  return (
    <div className="w-full h-screen bg-[var(--kinship-ink)]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Float speed={1.5} rotationIntensity={0.3}>
          <RotatingShape />
        </Float>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
```

**3D rules:**
- Always `"use client"` — Three.js needs the browser
- Canvas background: `bg-[var(--kinship-ink)]` or `bg-black` for dark scenes
- Use `<Environment>` for realistic lighting rather than many manual lights
- Use `<Float>` from drei for gentle floating/bobbing motion
- Keep poly count low — these run on Chromebooks (Intel UHD 600)
- `useFrame` cleanup: always return a cleanup if you subscribe to events

---

## Pedagogy Rules — Always Apply

These apply to every dashboard, no exceptions:

| ❌ Never show | ✅ Show instead |
|---|---|
| Student ranked against peers | Class-aggregate trends |
| Leaderboards / top/bottom N | Individual progress over time |
| XP points, streaks, coins | Concept milestone progress |
| Achievement badges | Mastery indicators |
| Comparative accuracy between students | Class-wide distribution |

Rationale: Kinship's research shows peer comparison harms motivation for struggling students. These restrictions are intentional, not arbitrary.

---

## Data Visualisation Checklist

- [ ] `ResponsiveContainer` wrapping all Recharts charts
- [ ] Tooltip styled with kinship brand (ink bg, cream text, no border)
- [ ] Axis lines and tick lines hidden (`axisLine={false} tickLine={false}`)
- [ ] No leaderboards or peer comparison
- [ ] Colors from CSS vars
- [ ] Mock data in `mock/` — min 8 realistic records
- [ ] Registered in `PrototypeRegistry.tsx`
- [ ] Mobile layout tested at ~768px
