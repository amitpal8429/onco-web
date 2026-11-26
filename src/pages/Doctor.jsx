import { useEffect, useMemo, useRef, useState } from 'react'
import DoctorCard from '../components/DoctorCard.jsx'
import { Accent, Kicker, PillLink, Unveil } from '../components/FernKit.jsx'
import Icon from '../components/Icon.jsx'
import { oncologyDoctors } from '../data/oncologyDoctors.js'
import { site } from '../data/site.js'

const ALL = 'All'

// TODO: set to true once the faculty and their credentials are confirmed.
const FACULTY_CONFIRMED = false

const CARD_STAGGER_MS = 90

// Cells drifting behind the header: [x, y, radius]
const motifCells = [
  [370, 50, 48],
  [270, 30, 20],
  [300, 104, 13],
  [190, 60, 11],
]

function CellMotif() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 440 130"
      className="pointer-events-none absolute right-0 top-0 hidden w-[26rem] lg:block"
    >
      {motifCells.map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} className="fill-lilac-300" fillOpacity="0.5" />
          <circle cx={x} cy={y} r={r * 0.36} className="fill-coral-300" fillOpacity="0.8" />
        </g>
      ))}
    </svg>
  )
}

// Pill tabs with an indicator that slides to the active one. The indicator is moved directly
// through its style, so measuring it never causes an extra render.
function DepartmentTabs({ options, active, onChange }) {
  const railRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const rail = railRef.current
    const button = rail.querySelector('[aria-pressed="true"]')

    const place = () => {
      markerRef.current.style.width = `${button.offsetWidth}px`
      markerRef.current.style.transform = `translateX(${button.offsetLeft}px)`
    }

    // Brings the active pill into view on phones, where the row scrolls sideways.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.scrollTo({
      left: button.offsetLeft - (rail.clientWidth - button.offsetWidth) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })

    // The observer fires once on start, and again when the web font changes the pill's width.
    const observer = new ResizeObserver(place)
    observer.observe(button)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [active])

  return (
    <div
      ref={railRef}
      role="group"
      aria-label="Filter doctors by department"
      className="no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto rounded-full border-2 border-fern-900 bg-white p-1 lg:w-max"
    >
      <span
        ref={markerRef}
        aria-hidden="true"
        className="absolute inset-y-1 left-0 rounded-full bg-fern-900 transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
      />
      {options.map((option) => {
        const selected = option === active

        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`relative min-h-11 shrink-0 snap-center whitespace-nowrap rounded-full px-5 text-sm font-bold transition-colors duration-300 ${
              selected ? 'text-cream-50' : 'text-fern-900 hover:text-coral-700'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function NoDoctorsPanel({ onReset }) {
  return (
    <div className="mt-12 rounded-[2.5rem] bg-coral-100 px-6 py-14 text-center md:py-20">
      <svg aria-hidden="true" viewBox="0 0 120 80" className="mx-auto w-36">
        <circle cx="60" cy="40" r="36" className="fill-white" />
        <circle cx="60" cy="40" r="14" className="fill-coral-300" />
        <circle cx="104" cy="20" r="12" className="fill-lilac-300" />
        <circle cx="14" cy="62" r="9" className="fill-fern-300" />
      </svg>
      <p className="mt-6 font-headline text-2xl font-medium text-fern-950 md:text-3xl">
        No doctors in this department yet
      </p>
      <button type="button" onClick={onReset} className="pill-fern mt-7">
        Show all doctors
      </button>
    </div>
  )
}

export default function Doctor() {
  const [department, setDepartment] = useState(ALL)

  useEffect(() => {
    document.title = 'Our Oncology Doctors | Medical Global Academy'
  }, [])

  // Departments in the order they first appear in the list above
  const departments = useMemo(
    () => [...new Set(oncologyDoctors.map((doctor) => doctor.department).filter(Boolean))],
    [],
  )

  const shown =
    department === ALL ? oncologyDoctors : oncologyDoctors.filter((doctor) => doctor.department === department)

  return (
    <>
      <section className="relative overflow-hidden rounded-b-[3rem] bg-lilac-100 py-16 md:rounded-b-[5rem] md:py-24">
        <CellMotif />
        <div className="fern-frame relative grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-end lg:gap-16">
          <div>
            <div className="motion-safe:animate-wipe-in">
              <Kicker>Our Medical Experts</Kicker>
            </div>
            <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.04] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
              Meet Our Expert <Accent>Oncology Doctors</Accent>
            </h1>
          </div>
          <div className="motion-safe:animate-wipe-in motion-safe:[animation-delay:240ms]">
            {/* TODO: confirm the faculty claim (which areas the faculty teach) with the academic team. */}
            <p className="text-lg leading-relaxed text-bark-600">
              Our faculty teach across the oncology areas covered by our programs, from clinical and surgical oncology
              to hemato-oncology, gynecologic oncology and neuro-oncology.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-fern-900">
              <Icon
                path="M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74"
                className="size-4"
              />
              {oncologyDoctors.length} doctors
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Doctors" className="py-14 md:py-20">
        <div className="fern-frame">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {departments.length > 1 && (
              <DepartmentTabs options={[ALL, ...departments]} active={department} onChange={setDepartment} />
            )}
            <p role="status" aria-live="polite" className="font-headline text-lg italic text-bark-600">
              Showing {shown.length} of {oncologyDoctors.length} doctors
            </p>
          </div>

          {shown.length > 0 ? (
            // The key restarts the entrance animation each time the filter changes.
            <ul key={department} className="mt-10 grid gap-4 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {shown.map((doctor, index) => (
                <li
                  key={doctor.name}
                  style={{ animationDelay: `${index * CARD_STAGGER_MS}ms` }}
                  className="motion-safe:animate-wipe-in lg:even:translate-y-14"
                >
                  <DoctorCard doctor={doctor} tone={oncologyDoctors.indexOf(doctor)} />
                </li>
              ))}
            </ul>
          ) : (
            <NoDoctorsPanel onReset={() => setDepartment(ALL)} />
          )}

          {/* Only shown once the faculty and their credentials are confirmed. */}
          {FACULTY_CONFIRMED && (
            <Unveil className="mt-12">
              <p className="flex items-center justify-center gap-3 rounded-[2rem] bg-fern-100 px-6 py-4 text-center font-headline text-lg font-medium text-fern-900 md:rounded-full md:text-xl">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-fern-900 text-cream-50">
                  <Icon path="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4" className="size-5" />
                </span>
                All doctors are verified · CPD &amp; ACTD accredited
              </p>
            </Unveil>
          )}
        </div>
      </section>

      <section aria-labelledby="doctor-cta-heading" className="pb-20 md:pb-28">
        <div className="fern-frame">
          <Unveil effect="scale">
            <div className="relative isolate flex flex-col items-start gap-8 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-fern-950 via-fern-800 to-fern-600 px-6 py-14 text-cream-50 md:rounded-[4rem] md:px-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
              <div aria-hidden="true" className="absolute -right-16 -top-36 -z-10 size-64 rounded-full bg-coral-500/80" />
              <div aria-hidden="true" className="absolute -bottom-36 -left-20 -z-10 size-64 rounded-full border-[3rem] border-lilac-300/25" />
              <h2 id="doctor-cta-heading" className="max-w-xl text-4xl font-medium leading-[1.08] md:text-6xl">
                Want to learn from <Accent tone="text-coral-300">our faculty?</Accent>
              </h2>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
                <PillLink to="/courses">View Courses</PillLink>
                <a href={`tel:${site.counsellorPhone.replace(/\s/g, '')}`} className="pill-line-light">
                  Talk to Counsellor
                </a>
              </div>
            </div>
          </Unveil>
        </div>
      </section>
    </>
  )
}
