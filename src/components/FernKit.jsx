import { Link } from 'react-router-dom'
import useSeenOnce from '../hooks/useSeenOnce.js'
import Icon from './Icon.jsx'

// Building blocks of the fern brand, shared by the Home and About pages.

// Each pass of the loop moves by half the track, so half the track must be wider than the screen.
const LOOP_COPIES = [0, 1, 2, 3, 4, 5]

export function Kicker({ tone = 'text-coral-700', children }) {
  return <p className={`font-headline text-xl italic ${tone}`}>{children}</p>
}

export function Accent({ tone = 'text-coral-700', children }) {
  return <em className={`font-headline font-normal italic ${tone}`}>{children}</em>
}

// Button-style link with an arrow that slides on hover.
export function PillLink({ to, variant = 'pill-coral', children }) {
  return (
    <Link to={to} className={`group/pill ${variant}`}>
      {children}
      <Icon
        path="M5 12h14 M13 6l6 6-6 6"
        className="size-4 transition-transform duration-300 group-hover/pill:translate-x-1 motion-reduce:transition-none"
        strokeWidth={2.4}
      />
    </Link>
  )
}

// Reveals its content on first view. `effect` is wipe, left, right or scale (see .unveil in
// index.css); `delay` staggers the items in a group. The outer div is the one observed, because
// a browser treats an element clipped by its own clip-path as out of view.
export function Unveil({ effect = 'wipe', delay = 0, className = '', children }) {
  const [ref, seen] = useSeenOnce()

  return (
    <div ref={ref} className={className}>
      <div
        data-effect={effect}
        data-shown={seen}
        style={{ transitionDelay: seen ? `${delay}ms` : '0ms' }}
        className="unveil h-full"
      >
        {children}
      </div>
    </div>
  )
}

export function SectionTitle({ id, kicker, align = 'text-left', children }) {
  return (
    <div className={align}>
      <Kicker>{kicker}</Kicker>
      <h2 id={id} className="mt-3 text-4xl font-medium leading-[1.08] text-fern-950 md:text-6xl">
        {children}
      </h2>
    </div>
  )
}

// Endless strip of chips. Only the first copy of the list is exposed to screen readers.
// Reduced-motion users get that one list, wrapped and still.
export function LoopStrip({ label, items, renderChip }) {
  return (
    <div className="overflow-hidden">
      <div className="flex w-max hover:[animation-play-state:paused] motion-safe:animate-drift motion-reduce:w-full">
        {LOOP_COPIES.map((copy) => (
          <ul
            key={copy}
            aria-label={copy === 0 ? label : undefined}
            aria-hidden={copy === 0 ? undefined : true}
            className={`flex shrink-0 gap-3 pr-3 motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-4 ${
              copy === 0 ? '' : 'motion-reduce:hidden'
            }`}
          >
            {items.map((item) => (
              <li key={item} className="shrink-0">
                {renderChip(item)}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
