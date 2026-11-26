import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StatePanel } from '../components/CourseCard.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { formatFee, typeLabel, useCourseDetail, useOncologyCourses } from '../data/oncologyCourseApi.js'
import { site } from '../data/site.js'
import NotFound from './NotFound.jsx'

const headingClass = 'text-3xl font-semibold text-primary-900'
const checkPath = 'M5 12.5l4.5 4.5L19 7.5'
const counsellorHref = `tel:${site.counsellorPhone.replace(/\s/g, '')}`

function metaDescription(text) {
  if (text.length <= 155) return text
  return `${text.slice(0, 155).replace(/\s+\S*$/, '')}…`
}

// Certificates have no online or hybrid fee in the API, so they show the total instead.
function getFeeRows(course) {
  const rows = [{ label: 'Registration Fee', value: course.registrationFee }]
  if (course.onlineFee) rows.push({ label: 'Online CPD Fee', value: course.onlineFee })
  if (course.hybridFee) rows.push({ label: 'Hybrid CPD Fee', value: course.hybridFee })
  if (!course.onlineFee && !course.hybridFee) rows.push({ label: 'Total Fee', value: course.totalFee })
  return rows
}

function countLabel(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

function AllCoursesLink() {
  return (
    <Link to="/courses" className="text-sm text-primary-100 underline underline-offset-4 hover:text-accent-300">
      All courses
    </Link>
  )
}

function Highlights({ items }) {
  return (
    <section aria-labelledby="highlights-heading">
      <h2 id="highlights-heading" className={headingClass}>
        Program highlights
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 rounded-xl border border-mist-200 bg-white p-5 shadow-card">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-500 text-ink-900">
              <Icon path={checkPath} className="size-3.5" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function WhatYouLearn({ items }) {
  return (
    <section aria-labelledby="learn-heading">
      <h2 id="learn-heading" className={headingClass}>
        What you&apos;ll learn
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-mist-200 border-t-2 border-t-accent-500 bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold leading-snug text-primary-900">{item.heading}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Workshop({ workshop }) {
  return (
    <section aria-labelledby="workshop-heading">
      <h2 id="workshop-heading" className={headingClass}>
        {workshop.title || 'Workshops'}
      </h2>
      {workshop.intro.length > 0 && (
        <div className="mt-5 space-y-4 leading-relaxed text-ink-600">
          {workshop.intro.map((block) => (
            <p key={block.label || block.text}>
              {block.label && <strong className="block font-semibold text-primary-900">{block.label}</strong>}
              {block.text}
            </p>
          ))}
        </div>
      )}
      <div className={`mt-8 grid gap-6 ${workshop.parts.length > 1 ? 'lg:grid-cols-2' : ''}`}>
        {workshop.parts.map((part, index) => (
          <article key={part.id} className="rounded-xl bg-primary-900 p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Part {index + 1}</p>
            <h3 className="mt-2 text-2xl font-semibold">{part.title}</h3>
            {part.subtitle && <p className="mt-3 text-sm leading-relaxed text-primary-100">{part.subtitle}</p>}
            <ul className="mt-6 space-y-3 border-t border-white/15 pt-6">
              {part.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
                  <Icon path={checkPath} className="mt-0.5 size-4 shrink-0 text-accent-300" strokeWidth={2.5} />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function Curriculum({ curriculum }) {
  return (
    <section aria-labelledby="curriculum-heading">
      <h2 id="curriculum-heading" className={headingClass}>
        Curriculum
      </h2>
      <p className="mt-2 text-sm font-medium text-ink-600">
        {countLabel(curriculum.modules.length, 'module')} · {countLabel(curriculum.lessonCount, 'lesson')}
      </p>
      <div className="mt-6 space-y-3">
        {curriculum.modules.map((module, index) => (
          <details key={module.id} open={index === 0} className="group rounded-xl border border-mist-200 bg-white shadow-card">
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="font-display text-2xl font-bold text-accent-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-ink-600">
                  Module {index + 1} · {countLabel(module.lessons.length, 'lesson')}
                </span>
                <span className="mt-0.5 block font-display text-lg font-semibold leading-snug text-primary-900">
                  {module.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-50 text-xl leading-none text-primary-700 transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ol className="divide-y divide-mist-100 border-t border-mist-200 px-5">
              {module.lessons.map((lesson, lessonIndex) => (
                <li key={lessonIndex} className="flex gap-4 py-3 text-sm leading-relaxed">
                  <span className="w-9 shrink-0 font-semibold text-accent-700">
                    {index + 1}.{lessonIndex + 1}
                  </span>
                  <span className="min-w-0">{lesson}</span>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </section>
  )
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading course content" className="animate-pulse space-y-4">
      <div className="h-8 w-56 rounded bg-mist-200" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-20 rounded-xl bg-mist-200" />
        ))}
      </div>
      <div className="h-8 w-44 rounded bg-mist-200 pt-8" />
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-20 rounded-xl bg-mist-100" />
      ))}
    </div>
  )
}

export default function CourseDetail() {
  const { slug } = useParams()
  const { status, courses, retry } = useOncologyCourses()
  const [imageFailed, setImageFailed] = useState(false)
  const course = courses.find((item) => item.slug === slug)
  const { status: detailStatus, detail, retry: retryDetail } = useCourseDetail(course?.slug)

  if (status === 'ready' && !course) return <NotFound />

  if (!course) {
    return (
      <>
        <Seo title="Oncology Course | Medical Global Academy" description="Oncology course details from Medical Global Academy." />
        <section className="bg-primary-900 text-white">
          <div className="page-gutter py-12 md:py-16">
            <AllCoursesLink />
          </div>
        </section>
        <div className="page-gutter py-16">
          {status === 'loading' ? (
            <p role="status" className="text-ink-600">
              Loading course…
            </p>
          ) : (
            <StatePanel
              title="We couldn't load this course"
              actions={
                <button type="button" onClick={retry} className="btn-primary">
                  Try again
                </button>
              }
            >
              Please check your connection and try again, or call us on {site.counsellorPhone}.
            </StatePanel>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <Seo title={`${course.title} | MGA`} description={metaDescription(course.description)} />

      <section className="bg-linear-to-b from-primary-900 to-primary-800 text-white">
        <div className="page-gutter py-12 md:py-16">
          <AllCoursesLink />
          <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-accent-300">
            {typeLabel(course.type)}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{course.title}</h1>
        </div>
      </section>

      <div className="page-gutter grid gap-12 py-14 md:py-20 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="about-heading">
            {course.image && !imageFailed && (
              <img
                src={course.image}
                alt=""
                width="776"
                height="450"
                onError={() => setImageFailed(true)}
                className="mb-10 aspect-[776/450] w-full rounded-xl bg-mist-100 object-cover shadow-card"
              />
            )}
            <h2 id="about-heading" className={headingClass}>
              About this program
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink-600">{course.description}</p>
          </section>

          {detailStatus === 'loading' && <DetailSkeleton />}

          {detailStatus === 'error' && (
            <StatePanel
              title="We couldn't load the full course details"
              actions={
                <button type="button" onClick={retryDetail} className="btn-primary">
                  Try again
                </button>
              }
            >
              The curriculum and workshop details did not load. Please try again, or call us on {site.counsellorPhone}.
            </StatePanel>
          )}

          {detail && (
            <>
              {detail.highlights.length > 0 && <Highlights items={detail.highlights} />}
              {detail.learn.length > 0 && <WhatYouLearn items={detail.learn} />}
              {detail.workshop && <Workshop workshop={detail.workshop} />}
              {detail.curriculum.modules.length > 0 && <Curriculum curriculum={detail.curriculum} />}
            </>
          )}
        </div>

        <aside aria-labelledby="summary-heading" className="order-first lg:sticky lg:top-28 lg:order-none lg:self-start">
          <div className="rounded-xl border-t-4 border-accent-500 bg-white p-7 shadow-card">
            <h2 id="summary-heading" className="text-xl font-semibold text-primary-900">
              Course details
            </h2>
            <dl className="mt-4 divide-y divide-mist-200 text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-600">Type</dt>
                <dd className="text-right font-semibold">{typeLabel(course.type)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-600">Duration</dt>
                <dd className="text-right font-semibold">{course.durationMonths} months</dd>
              </div>
              {getFeeRows(course).map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-600">{row.label}</dt>
                  <dd className="text-right font-semibold">{formatFee(row.value)}</dd>
                </div>
              ))}
            </dl>
            <Link to={`/contact?course=${course.slug}`} className="btn-primary mt-6 w-full">
              Enquire Now
            </Link>
            <a href={counsellorHref} className="btn-secondary mt-3 w-full">
              Talk to Counsellor
            </a>
          </div>
        </aside>
      </div>

      <section aria-labelledby="enrol-heading" className="bg-primary-900 text-white">
        <div className="page-gutter py-16 text-center md:py-20">
          <h2 id="enrol-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            Enrol in this program
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-primary-100">
            Talk to our counsellors to check your eligibility, confirm the fees and next start date, and complete
            your enrolment in the {course.title}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={counsellorHref} className="btn-primary">
              Talk to Counsellor
            </a>
            <Link
              to={`/contact?course=${course.slug}`}
              className="inline-flex items-center justify-center rounded-sm border border-white/35 px-6 py-3 font-semibold text-white transition-colors hover:border-accent-500 hover:bg-white/10"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
