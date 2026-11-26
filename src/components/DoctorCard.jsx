import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

const TINTS = [
  'from-fern-300 to-fern-700',
  'from-lilac-300 to-fern-800',
  'from-coral-300 to-fern-800',
  'from-cream-200 to-fern-700',
]

// Stands in for a photo (we never use real photos here). It sits above the name overlay, with
// the coat running down behind it.
function PortraitPlaceholder() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className="absolute inset-x-0 bottom-[20%] mx-auto w-[78%] text-white transition-transform duration-700 ease-out group-hover/doctor:scale-105 motion-reduce:transition-none"
    >
      {/* Coat, with the shirt showing between the lapels */}
      <path d="M22 200c0-46 24-72 78-72s78 26 78 72z" fill="currentColor" fillOpacity="0.92" />
      <path d="M84 129l16 36 16-36c-10-2-22-2-32 0z" className="fill-fern-300" />
      {/* Neck, head and hair */}
      <path d="M86 104h28v22c-6 12-22 12-28 0z" fill="currentColor" />
      <circle cx="100" cy="76" r="34" fill="currentColor" />
      <path d="M66 78c-4-30 14-44 34-44s38 14 34 44c-3-11-10-17-20-20-14 7-34 7-42 4-3 4-5 9-6 16z" className="fill-fern-900" />
      {/* Stethoscope */}
      <path
        d="M74 136c-4 22 6 38 26 38s30-16 26-38"
        fill="none"
        className="stroke-fern-900"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="100" cy="178" r="7" className="fill-coral-500" />
    </svg>
  )
}

// `tone` picks the background tint. The action stays visible on touch screens, which have no
// hover, and appears on keyboard focus.
export default function DoctorCard({ doctor, tone = 0, headingLevel: Heading = 'h2' }) {
  return (
    <article
      className={`group/doctor relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-linear-to-b ${TINTS[tone % TINTS.length]}`}
    >
      <PortraitPlaceholder />

      {doctor.department && (
        <p className="absolute left-3 top-3 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-fern-900">
          {doctor.department}
        </p>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-fern-950 from-55% to-transparent p-5 pt-16 text-cream-50">
        <Heading className="font-headline text-2xl font-medium leading-tight">{doctor.name}</Heading>
        <p className="mt-1 text-sm font-medium text-coral-300">{doctor.designation}</p>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-focus-within/doctor:grid-rows-[1fr] group-hover/doctor:grid-rows-[1fr] motion-reduce:transition-none [@media(hover:none)]:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <Link
              to="/courses"
              className="group/action mt-3 inline-flex items-center gap-1.5 rounded-full text-sm font-bold text-cream-50 underline decoration-coral-500 decoration-2 underline-offset-4 focus-visible:outline-offset-[-2px]"
            >
              View courses
              <Icon
                path="M5 12h14 M13 6l6 6-6 6"
                className="size-4 transition-transform duration-300 group-hover/action:translate-x-1 motion-reduce:transition-none"
                strokeWidth={2.4}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}