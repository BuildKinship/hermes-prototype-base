/**
 * BrandLogos — SVG brand logos for common Kinship tool integrations.
 *
 * These are simplified inline SVGs (no external requests) designed to fit
 * inside a 44–50px circle node in hub-and-spoke network diagrams.
 *
 * Usage (hub-and-spoke):
 *   <g transform="translate(nodeX - 22, nodeY - 22)">
 *     <ClaudeLogo cx={22} cy={22} r={22} size={22} />
 *   </g>
 *
 * Usage (standalone):
 *   <NotionLogo size={40} />
 */

interface LogoProps {
  /** Radius of the background circle */
  r?: number;
  /** Logical center of the circle (for transform-translate callers, set cx=cy=r) */
  cx?: number;
  cy?: number;
  size?: number;
}

// ── Claude / Anthropic A mark ──────────────────────────────────────────────────
export function ClaudeLogo({ r = 24, cx = 24, cy = 24 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="oklch(16% 0.07 293)" stroke="oklch(50% 0.08 293)" strokeWidth="1.5"/>
      {/* Anthropic A: two legs meeting at apex + crossbar */}
      <path
        d={`M${cx - 10} ${cy + 12} L${cx} ${cy - 14} L${cx + 10} ${cy + 12}`}
        stroke="oklch(88% 0.05 293)" strokeWidth="2.5" fill="none" strokeLinejoin="round"
      />
      <line x1={cx - 5} y1={cy + 4} x2={cx + 5} y2={cy + 4} stroke="oklch(88% 0.05 293)" strokeWidth="2.2"/>
      <text x={cx} y={cy + r + 14} fontSize="8" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Claude</text>
    </g>
  );
}

// ── Notion N mark ─────────────────────────────────────────────────────────────
export function NotionLogo({ r = 22, cx = 22, cy = 22 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      {/* Simplified N letterform */}
      <path
        d={`M${cx - 10} ${cy - 10} L${cx - 10} ${cy + 10} L${cx - 7} ${cy + 10} L${cx + 4} ${cy - 4} L${cx + 4} ${cy + 10} L${cx + 8} ${cy + 10} L${cx + 8} ${cy - 10} L${cx + 5} ${cy - 10} L${cx - 6} ${cy + 4} L${cx - 6} ${cy - 10} Z`}
        fill="#191919" opacity="0.88"
      />
      <text x={cx} y={cy + r + 14} fontSize="8" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Notion</text>
    </g>
  );
}

// ── Slack coloured hash ────────────────────────────────────────────────────────
export function SlackLogo({ r = 22, cx = 22, cy = 22 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      {/* Two vertical bars + two horizontal bars in Slack brand colors */}
      <rect x={cx - 10} y={cy - 8} width="5" height="16" rx="2.5" fill="#E01E5A"/>
      <rect x={cx + 5}  y={cy - 8} width="5" height="16" rx="2.5" fill="#36C5F0"/>
      <rect x={cx - 12} y={cy - 3} width="16" height="5" rx="2.5" fill="#2EB67D"/>
      <rect x={cx - 4}  y={cy + 2} width="16" height="5" rx="2.5" fill="#ECB22E"/>
      <text x={cx} y={cy + r + 14} fontSize="8" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Slack</text>
    </g>
  );
}

// ── Zoom camera icon ───────────────────────────────────────────────────────────
export function ZoomLogo({ r = 22, cx = 22, cy = 22 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#2D8CFF" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      {/* Camera body + lens */}
      <rect x={cx - 11} y={cy - 7} width="16" height="12" rx="3" fill="white"/>
      <path d={`M${cx + 5} ${cy - 5} L${cx + 13} ${cy - 9} L${cx + 13} ${cy + 9} L${cx + 5} ${cy + 5} Z`} fill="white"/>
      <text x={cx} y={cy + r + 14} fontSize="8" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Zoom</text>
    </g>
  );
}

// ── Google G ──────────────────────────────────────────────────────────────────
export function GoogleLogo({ r = 22, cx = 22, cy = 22 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      <text x={cx} y={cy + 7} fontSize="20" textAnchor="middle" fontFamily="system-ui" fontWeight="700">
        <tspan fill="#4285F4">G</tspan>
      </text>
      {/* Blue horizontal bar (distinctive Google G notch) */}
      <path d={`M${cx} ${cy - 3} L${cx + 9} ${cy - 3} L${cx + 9} ${cy + 1} L${cx} ${cy + 1}`} fill="#4285F4"/>
      <text x={cx} y={cy + r + 14} fontSize="8" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Google</text>
    </g>
  );
}

// ── Google Drive triangle ──────────────────────────────────────────────────────
export function GoogleDriveLogo({ r = 22, cx = 22, cy = 22 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="oklch(88% 0.03 293)" strokeWidth="1.5"/>
      <path d={`M${cx - 12} ${cy + 8} L${cx} ${cy - 12} L${cx + 12} ${cy + 8} Z`}
        fill="none" stroke="#FBBC04" strokeWidth="2.5"/>
      <path d={`M${cx - 12} ${cy + 8} L${cx - 4} ${cy + 8}`} stroke="#34A853" strokeWidth="2.5"/>
      <path d={`M${cx + 4} ${cy + 8} L${cx + 12} ${cy + 8}`} stroke="#4285F4" strokeWidth="2.5"/>
      <text x={cx} y={cy + r + 14} fontSize="7" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">GWorkspace</text>
    </g>
  );
}

// ── Hermes (lightning bolt) ────────────────────────────────────────────────────
export function HermesLogo({ r = 22, cx = 22, cy = 22 }: LogoProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="oklch(22% 0.08 293)" stroke="oklch(40% 0.08 293)" strokeWidth="1.5"/>
      <text x={cx} y={cy + 7} fontSize="18" textAnchor="middle">⚡</text>
      <text x={cx} y={cy + r + 14} fontSize="8" textAnchor="middle"
        fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">Hermes</text>
    </g>
  );
}

// ── Hub-and-spoke SVG — drop-in network diagram ────────────────────────────────
/**
 * Renders a hub-and-spoke network with Claude at center and up to 6 tool nodes.
 *
 * @example
 * <ToolsHubSVG
 *   width={400} height={270}
 *   hub={{ cx: 200, cy: 135, r: 34 }}
 *   spokes={[
 *     { x: 200, y: 20,  Logo: NotionLogo },
 *     { x: 350, y: 70,  Logo: GoogleLogo },
 *     { x: 370, y: 190, Logo: SlackLogo },
 *     { x: 200, y: 250, Logo: ZoomLogo },
 *     { x: 30,  y: 190, Logo: HermesLogo },
 *     { x: 50,  y: 70,  Logo: GoogleDriveLogo },
 *   ]}
 * />
 */
interface SpokeConfig {
  x: number;
  y: number;
  Logo: React.FC<LogoProps>;
}

interface ToolsHubSVGProps {
  width?: number;
  height?: number;
  hub?: { cx: number; cy: number; r: number };
  spokes?: SpokeConfig[];
}

export function ToolsHubSVG({
  width = 400,
  height = 270,
  hub = { cx: 200, cy: 135, r: 34 },
  spokes = [],
}: ToolsHubSVGProps) {
  const nodeR = 22;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes hub-pulse-generic { 0%,100%{r:${hub.r};opacity:1} 50%{r:${hub.r + 3};opacity:0.85} }
        .hub-pulse-g { transform-origin:${hub.cx}px ${hub.cy}px; animation:hub-pulse-generic 3s ease-in-out infinite; }
      `}</style>

      {/* Spoke dashed lines */}
      {spokes.map((s, i) => (
        <line key={`line-${i}`}
          x1={hub.cx} y1={hub.cy} x2={s.x} y2={s.y}
          stroke="oklch(70% 0.08 293)" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.45"
        />
      ))}

      {/* Animated particles along each spoke */}
      {spokes.map((s, i) => (
        <g key={`particle-${i}`}>
          <circle r="3.5" fill="var(--kinship-mid)" opacity="0.9">
            <animateMotion dur={`${1.8 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.45}s`}>
              <mpath xlinkHref={`#hub-spoke-${i}`}/>
            </animateMotion>
          </circle>
          <path id={`hub-spoke-${i}`} d={`M ${hub.cx} ${hub.cy} L ${s.x} ${s.y}`} fill="none"/>
        </g>
      ))}

      {/* Spoke logo nodes */}
      {spokes.map((s, i) => (
        <g key={`logo-${i}`} transform={`translate(${s.x - nodeR}, ${s.y - nodeR})`}>
          <s.Logo r={nodeR} cx={nodeR} cy={nodeR} />
        </g>
      ))}

      {/* Center hub — Claude by default */}
      <ClaudeLogo r={hub.r} cx={hub.cx} cy={hub.cy} />
    </svg>
  );
}
