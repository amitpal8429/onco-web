import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatFee, typeLabel } from '../data/oncologyCourseApi.js'
import Icon from './Icon.jsx'

const clockPath = 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2'
const tagPath = 'M3 12V4h8l10 10-8 8L3 12z M7.5 8.5h.01'

// Shown when a course has no image, or its image fails to load.
function CellPlaceholder() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full bg-fern-100">
      <circle cx="160" cy="100" r="62" className="fill-fern-300" />
      <circle cx="160" cy="100" r="24" className="fill-coral-500" />
      <circle cx="262" cy="46" r="24" className="fill-lilac-300" />
      <circle cx="262" cy="46" r="9" className="fill-coral-300" />
      <circle cx="54" cy="156" r="16" className="fill-white" />
    </svg>
  )
}

// Stacked in a narrow space (the Home carousel) and horizontal in a wide one (the Courses list).
// This is decided by the width of the card itself, so callers pass only the course.
export default function CourseCard({ course }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="group/course @container h-full rounded-[2rem] border-2 border-cream-200 bg-white transition-[border-color,box-shadow] duration-300 hover:border-fern-900 hover:shadow-stamp">
      <div className="flex h-full flex-col p-2 @xl:flex-row">
        <div className="relative aspect-[776/450] shrink-0 overflow-hidden rounded-[1.5rem] @xl:aspect-auto @xl:min-h-60 @xl:w-2/5">
          {course.image && !imageFailed ? (
            <img
              src={course.image}
              alt=""
              loading="lazy"
              decoding="async"
              width="776"
              height="450"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 size-full bg-cream-100 object-cover transition-[scale] duration-500 group-hover/course:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <CellPlaceholder />
          )}
          <p className="absolute left-3 top-3 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-fern-900">
            {typeLabel(course.type)}
          </p>
        </div>

        <div className="flex flex-1 flex-col p-5 @xl:px-7 @xl:py-5">
          <h3 className="text-2xl font-medium leading-tight text-fern-950">{course.title}</h3>
          {/* flex-1 on a wrapper, not the clamped <p>, or a 4th line peeks out below the clamp */}
          <div className="mt-3 flex-1">
            <p className="line-clamp-3 leading-relaxed text-bark-600">{course.description}</p>
          </div>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-fern-100 text-fern-900">
                <Icon path={clockPath} className="size-4" />
              </span>
              <div>
                <dt className="text-xs text-bark-600">Duration</dt>
                <dd className="text-sm font-bold text-fern-950">{course.durationMonths} months</dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-lilac-100 text-fern-900">
                <Icon path={tagPath} className="size-4" />
              </span>
              <div>
                <dt className="text-xs text-bark-600">Registration Fee</dt>
                <dd className="text-sm font-bold text-fern-950">{formatFee(course.registrationFee)}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              to={`/contact?course=${course.slug}`}
              aria-label={`Enquire: ${course.title}`}
              className="flex-1 rounded-full bg-coral-100 px-6 py-3 text-center text-sm font-bold text-fern-950 transition-colors duration-300 hover:bg-fern-900 hover:text-cream-50 group-hover/course:bg-coral-500 hover:group-hover/course:bg-fern-900 @xl:flex-none"
            >
              Enquire Now
            </Link>
            <Link
              to={`/courses/${course.slug}`}
              aria-label={`View details: ${course.title}`}
              className="flex-1 whitespace-nowrap rounded-full py-3 text-center text-sm font-bold text-fern-900 underline decoration-coral-500 decoration-2 underline-offset-4 hover:text-coral-700 @xl:flex-none"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export function CourseCardSkeleton() {
  return (
    <div aria-hidden="true" className="@container h-full rounded-[2rem] border-2 border-cream-200 bg-white motion-safe:animate-pulse">
      <div className="flex h-full flex-col p-2 @xl:flex-row">
        <div className="aspect-[776/450] shrink-0 rounded-[1.5rem] bg-cream-200 @xl:aspect-auto @xl:min-h-60 @xl:w-2/5" />
        <div className="flex flex-1 flex-col p-5 @xl:px-7 @xl:py-5">
          <div className="h-7 w-3/4 rounded-full bg-cream-200" />
          <div className="mt-4 flex-1 space-y-2.5">
            <div className="h-3.5 rounded-full bg-cream-100" />
            <div className="h-3.5 rounded-full bg-cream-100" />
            <div className="h-3.5 w-2/3 rounded-full bg-cream-100" />
          </div>
          <div className="mt-5 flex gap-8">
            <div className="h-9 w-28 rounded-full bg-cream-100" />
            <div className="h-9 w-28 rounded-full bg-cream-100" />
          </div>
          <div className="mt-5 h-11 w-40 rounded-full bg-cream-200" />
        </div>
      </div>
    </div>
  )
}

// Message block for the loading-failed state on the Course detail page.
export function StatePanel({ title, actions, children }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-mist-200 bg-white p-8 text-center shadow-card md:p-10">
      <h3 className="text-2xl font-semibold text-primary-900">{title}</h3>
      <p className="mt-3 leading-relaxed text-ink-600">{children}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
  )
}
