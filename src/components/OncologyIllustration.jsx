// Hero illustration, drawn on a 400x500 grid (same 4:5 ratio as the arch on Home): a DNA helix
// and a targeted cell.
const CELL = { x: 262, y: 228, r: 66 }

const HELIX = { x: 76, top: 148, height: 300, amplitude: 30, turns: 2.25 }

function helixX(y, flip) {
  const phase = ((y - HELIX.top) / HELIX.height) * HELIX.turns * Math.PI * 2
  return +(HELIX.x + Math.sin(phase) * HELIX.amplitude * flip).toFixed(2)
}

function helixStrand(flip) {
  const points = Array.from({ length: 61 }, (_, i) => {
    const y = HELIX.top + (i / 60) * HELIX.height
    return `${i === 0 ? 'M' : 'L'}${helixX(y, flip)} ${y}`
  })
  return points.join(' ')
}

const helixRungs = Array.from({ length: 19 }, (_, i) => {
  const y = HELIX.top + 8 + i * 16
  return { y, x1: helixX(y, 1), x2: helixX(y, -1) }
})

// Beams converging on the cell, the idea behind targeted treatment: [x, y] start points
const beams = [
  [400, 118],
  [400, 228],
  [392, 352],
]

// Smaller neighbouring cells: [x, y, radius]
const neighbours = [
  [162, 158, 15],
  [152, 322, 20],
  [356, 92, 13],
]

// Organelle dots inside the target cell: [x, y, radius]
const organelles = [
  [226, 196, 4],
  [296, 186, 3],
  [306, 256, 4.5],
  [232, 268, 3.5],
  [274, 276, 3],
]

// All motion is opt-in (no-preference), so reduced-motion users get a still image.
const styles = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes mga-onc-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes mga-onc-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes mga-onc-beam {
    to { stroke-dashoffset: -28; }
  }
  .mga-onc-pulse { animation: mga-onc-pulse 5s ease-in-out infinite; }
  .mga-onc-reticle {
    transform-box: fill-box;
    transform-origin: center;
    animation: mga-onc-spin 40s linear infinite;
  }
  .mga-onc-beam { animation: mga-onc-beam 2.5s linear infinite; }
}
`

export default function OncologyIllustration() {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of a DNA helix beside a cell under targeted treatment beams"
      className="absolute inset-0 h-full w-full"
    >
      <style>{styles}</style>
      <defs>
        <pattern id="mga-onc-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.07" />
        </pattern>
        <radialGradient id="mga-onc-glow">
          <stop offset="0%" stopColor="var(--color-accent-300)" stopOpacity="0.5" />
          <stop offset="55%" stopColor="var(--color-accent-500)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mga-onc-nucleus" cx="40%" cy="38%">
          <stop offset="0%" stopColor="var(--color-accent-300)" />
          <stop offset="100%" stopColor="var(--color-accent-700)" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="url(#mga-onc-dots)" />

      {/* DNA helix: back strand, rungs, front strand */}
      <g aria-hidden="true" fill="none" strokeLinecap="round">
        <path d={helixStrand(-1)} className="stroke-primary-300" strokeOpacity="0.55" strokeWidth="2.5" />
        <g className="stroke-primary-300" strokeOpacity="0.4" strokeWidth="1.5">
          {helixRungs.map((rung) => (
            <path key={rung.y} d={`M${rung.x1} ${rung.y} H${rung.x2}`} />
          ))}
        </g>
        <path d={helixStrand(1)} className="stroke-accent-300" strokeOpacity="0.9" strokeWidth="2.5" />
      </g>

      {/* Neighbouring cells */}
      <g aria-hidden="true" className="fill-primary-100 stroke-primary-300" fillOpacity="0.06" strokeOpacity="0.6" strokeWidth="1.5">
        {neighbours.map(([x, y, r]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={r} />
            <circle cx={x} cy={y} r={r * 0.38} fillOpacity="0.3" />
          </g>
        ))}
      </g>

      {/* Treatment beams */}
      <g aria-hidden="true" fill="none" className="stroke-accent-300" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round">
        {beams.map(([x, y]) => (
          <path key={`${x}-${y}`} className="mga-onc-beam" d={`M${x} ${y} L${CELL.x} ${CELL.y}`} strokeDasharray="10 4" />
        ))}
      </g>

      {/* Target cell: glow, membrane, organelles, nucleus, reticle */}
      <g aria-hidden="true">
        <circle cx={CELL.x} cy={CELL.y} r="118" fill="url(#mga-onc-glow)" className="mga-onc-pulse" />
        <circle cx={CELL.x} cy={CELL.y} r={CELL.r} className="fill-primary-900 stroke-accent-300" fillOpacity="0.9" strokeOpacity="0.9" strokeWidth="2" />
        <circle cx={CELL.x} cy={CELL.y} r={CELL.r - 7} fill="none" className="stroke-primary-300" strokeOpacity="0.35" strokeWidth="1" />
        <g className="fill-primary-300" fillOpacity="0.75">
          {organelles.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
        <circle cx={CELL.x} cy={CELL.y} r="24" fill="url(#mga-onc-nucleus)" className="mga-onc-pulse" />
        <g className="mga-onc-reticle stroke-white" fill="none" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round">
          <circle cx={CELL.x} cy={CELL.y} r={CELL.r + 16} strokeDasharray="30 22" />
          <path d={`M${CELL.x} ${CELL.y - CELL.r - 24} v12 M${CELL.x} ${CELL.y + CELL.r + 12} v12 M${CELL.x - CELL.r - 24} ${CELL.y} h12 M${CELL.x + CELL.r + 12} ${CELL.y} h12`} />
        </g>
      </g>
    </svg>
  )
}
