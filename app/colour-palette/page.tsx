'use client'
// Needs client for hover state on swatches

import { cn } from '@/lib/utils'

const swatches = [
  { name: 'Ink',     var: '--kinship-ink',     hex: '#1A1A2E' },
  { name: 'Cream',   var: '--kinship-cream',   hex: '#F5F0E8' },
  { name: 'Mid',     var: '--kinship-mid',     hex: '#8C8C9A' },
  { name: 'Dim',     var: '--kinship-dim',     hex: '#C4C4CE' },
  { name: 'Reading', var: '--subject-reading', hex: '#4A90D9' },
  { name: 'Math',    var: '--subject-math',    hex: '#E86B3A' },
  { name: 'Writing', var: '--subject-writing', hex: '#6BBF6B' },
  { name: 'Science', var: '--subject-science', hex: '#9B59B6' },
]

export default function ColourPalettePage() {
  return (
    <main
      className="min-h-screen p-10"
      style={{ background: 'var(--kinship-cream)', color: 'var(--kinship-ink)' }}
    >
      <h1 className="text-4xl font-bold mb-2">Kinship Colour Palette</h1>
      <p className="mb-10" style={{ color: 'var(--kinship-mid)' }}>
        Design token swatches — CSS variables from globals.css
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {swatches.map((s) => (
          <div
            key={s.name}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: 'var(--kinship-dim)' }}
          >
            <div
              className="h-24 w-full"
              style={{ background: `var(${s.var}, ${s.hex})` }}
            />
            <div className="p-3" style={{ background: 'white' }}>
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--kinship-mid)' }}>
                {s.var}
              </p>
              <p className="text-xs font-mono" style={{ color: 'var(--kinship-dim)' }}>
                {s.hex}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
