import { Award, BookOpen, GraduationCap, ScrollText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import useCourseStats from '../hooks/useCourseStats.js'

const DURATION_MS = 2000

const CARDS = [
  { key: 'total', label: 'Active Programs', Icon: BookOpen },
  { key: 'fellowship', label: 'Fellowships', Icon: GraduationCap },
  { key: 'certificate', label: 'Certificates', Icon: Award },
  { key: 'pgDiploma', label: 'PG Diplomas', Icon: ScrollText },
]

const cardClass =
  'relative h-full overflow-hidden rounded-3xl border border-cream-50/10 bg-cream-50/5 p-5 backdrop-blur-md sm:p-7'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

// Counts from 0 to `end` once `start` is true. Reduced motion shows the final number straight away.
function useCountUp(end, start) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? end : 0))

  useEffect(() => {
    if (!start) return
    let frame
    let startTime = null
    const duration = prefersReducedMotion() ? 0 : DURATION_MS

    const tick = (time) => {
      startTime ??= time
      const progress = duration ? Math.min((time - startTime) / duration, 1) : 1
      setValue(Math.round(easeOutCubic(progress) * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [end, start])

  return value
}

// Flips to true once, when at least 30% of the element is on screen.
function useInViewOnce() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

function StatCard({ label, Icon, value, start, index }) {
  const count = useCountUp(value, start)
  const formatted = `${value.toLocaleString('en-IN')}+`

  return (
    <div
      style={{ animationDelay: `${index * 120}ms` }}
      className={`group/stat transition-[border-color,box-shadow] duration-300 hover:border-fern-300/40 hover:shadow-[0_0_36px_rgb(142_208_180/0.18)] ${cardClass} ${
        start ? 'motion-safe:animate-fade-up' : 'motion-safe:opacity-0'
      }`}
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-fern-300/10 text-fern-300 transition-colors duration-300 group-hover/stat:bg-fern-300/20">
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <dd className="mt-5 font-headline text-4xl font-medium leading-none tabular-nums sm:text-5xl lg:text-6xl">
        {/* Screen readers get the final number once; the animated digits are visual only */}
        <span className="sr-only">{formatted}</span>
        <span aria-hidden="true" className="bg-linear-to-br from-fern-300 to-fern-100 bg-clip-text text-transparent">
          {count.toLocaleString('en-IN')}+
        </span>
      </dd>
      <dt className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-fern-100 sm:text-sm">{label}</dt>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div aria-hidden="true" className={cardClass}>
      <span className="block size-11 rounded-2xl bg-cream-50/10" />
      <span className="mt-5 block h-10 w-3/4 rounded-xl bg-cream-50/10 sm:h-12 lg:h-14" />
      <span className="mt-3 block h-3.5 w-1/2 rounded-full bg-cream-50/10" />
      <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-cream-50/10 to-transparent motion-safe:animate-shimmer" />
    </div>
  )
}

export default function StatsCounter() {
  const { stats, loading } = useCourseStats()
  const [ref, inView] = useInViewOnce()

  return (
    <section aria-labelledby="stats-heading" className="bg-fern-900 py-16 text-cream-50 md:py-24">
      <div className="fern-frame">
        <div className="text-center">
          <h2 id="stats-heading" className="font-headline text-4xl font-medium md:text-5xl">
            MGA at a <span className="italic text-coral-300">Glance</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-fern-100 md:text-lg">
            Live numbers from the full Medical Global Academy course catalogue, across every specialty.
          </p>
        </div>

        <div ref={ref} aria-busy={loading} className="mt-10 md:mt-14">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {CARDS.map((card) => (
                <SkeletonCard key={card.key} />
              ))}
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {CARDS.map((card, index) => (
                <StatCard
                  key={card.key}
                  label={card.label}
                  Icon={card.Icon}
                  value={stats[card.key]}
                  start={inView}
                  index={index}
                />
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
