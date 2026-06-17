'use client'
// Needs client for interactive size toggle

import { useState } from 'react'

const scales = [
  { label: 'Display', size: '3rem',   weight: '800', sample: 'Students grow here.' },
  { label: 'H1',      size: '2.25rem', weight: '700', sample: 'Reading — Grade 3' },
  { label: 'H2',      size: '1.75rem', weight: '600', sample: 'Weekly Progress' },
  { label: 'H3',      size: '1.375rem',weight: '600', sample: 'Accuracy this week' },
  { label: 'Body',    size: '1rem',    weight: '400', sample: 'Maya completed 14 reading sessions with an average accuracy of 87%.' },
  { label: 'Small',   size: '0.875rem',weight: '400', sample: 'Last updated 2 minutes ago' },
  { label: 'Caption', size: '0.75rem', weight: '400', sample: 'Source: Kinship platform data' },
]

export default function TypeScalePage() {
  const [dark, setDark] = useState(false)

  return (
    <main
      className="min-h-screen p-10 transition-colors duration-300"
      style={{
        background: dark ? 'var(--kinship-ink)' : 'var(--kinship-cream)',
        color:      dark ? 'var(--kinship-cream)' : 'var(--kinship-ink)',
      }}
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-1">Type Scale</h1>
          <p style={{ color: 'var(--kinship-mid)' }}>Kinship typographic system</p>
        </div>
        <button
          onClick={() => setDark(d => !d)}
          className="px-4 py-2 rounded-lg border text-sm font-medium"
          style={{
            borderColor: dark ? 'var(--kinship-dim)' : 'var(--kinship-ink)',
            color:        dark ? 'var(--kinship-cream)' : 'var(--kinship-ink)',
          }}
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>
      </div>

      <div className="space-y-8">
        {scales.map((s) => (
          <div
            key={s.label}
            className="pb-8 border-b"
            style={{ borderColor: dark ? 'var(--kinship-mid)' : 'var(--kinship-dim)' }}
          >
            <div className="flex items-baseline gap-4 mb-2">
              <span
                className="text-xs font-mono uppercase tracking-widest w-16"
                style={{ color: 'var(--kinship-mid)' }}
              >
                {s.label}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--kinship-dim)' }}>
                {s.size} / {s.weight}
              </span>
            </div>
            <p style={{ fontSize: s.size, fontWeight: s.weight, lineHeight: 1.2 }}>
              {s.sample}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
