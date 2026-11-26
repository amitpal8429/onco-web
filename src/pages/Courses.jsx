import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Info } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import CourseCard, { CourseCardSkeleton } from '../components/CourseCard.jsx'
import { FilterDrawer, SearchBox, TypeFilter } from '../components/CourseFilters.jsx'
import FaqSection from '../components/FaqSection.jsx'
import { Accent, Kicker, PillLink, SectionTitle, Unveil } from '../components/FernKit.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { DISCLAIMER_BODY, DISCLAIMER_LABEL } from '../constants/disclaimer.js'
import { getCourseTypes, typeLabel, useOncologyCourses } from '../data/oncologyCourseApi.js'
import { oncologyFaqs } from '../data/oncologyFaqs.js'
import { site } from '../data/site.js'

const ALL = 'All'
const CARD_STAGGER_MS = 70
const MAX_STAGGERED_CARDS = 5
// Cards shown at first and added by each "Load more" press.
const PAGE_SIZE = 10
const phonePath =
  'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z'

function CounsellorLink({ variant = 'pill-line' }) {
  return (
    <a href={`tel:${site.counsellorPhone.replace(/\s/g, '')}`} className={variant}>
      <Icon path={phonePath} className="size-4" />
      Talk to Counsellor
    </a>
  )
}

// Rounded panel for the loading-failed, no-courses and no-results states.
function CourseNotice({ title, actions, children }) {
  return (
    <div className="rounded-[2.5rem] bg-coral-100 px-6 py-14 text-center md:py-20">
      <svg aria-hidden="true" viewBox="0 0 120 80" className="mx-auto w-36">
        <circle cx="60" cy="40" r="36" className="fill-white" />
        <circle cx="60" cy="40" r="14" className="fill-coral-300" />
        <circle cx="104" cy="20" r="12" className="fill-lilac-300" />
        <circle cx="14" cy="62" r="9" className="fill-fern-300" />
      </svg>
      <h3 className="mt-6 text-2xl font-medium text-fern-950 md:text-3xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-bark-600">{children}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
  )
}

function FilterChip({ label, removeLabel, onRemove }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="group/chip inline-flex max-w-full items-center gap-2 rounded-full bg-lilac-100 py-2 pl-4 pr-2.5 text-sm font-bold text-fern-950 transition-colors duration-300 hover:bg-lilac-300"
      >
        <span className="truncate">{label}</span>
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-fern-900 text-cream-50 transition-transform duration-300 group-hover/chip:rotate-90 motion-reduce:transition-none">
          <Icon path="M7 7l10 10 M17 7L7 17" className="size-3" strokeWidth={3} />
        </span>
      </button>
    </li>
  )
}

export default function Courses() {
  const { status, courses, retry } = useOncologyCourses()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const headingId = useId()

  const types = useMemo(() => getCourseTypes(courses), [courses])

  const countByType = useMemo(() => {
    const counts = { [ALL]: courses.length }
    for (const course of courses) counts[course.type] = (counts[course.type] || 0) + 1
    return counts
  }, [courses])

  // The type filter lives in the URL (?type=Fellowship), so the back button and shared links
  // work. A type that isn't in the loaded data falls back to All, with a note.
  const typeParam = (searchParams.get('type') || '').trim()
  const matchedType = types.find((type) => type.toLowerCase() === typeParam.toLowerCase())
  const selectedType = matchedType ?? ALL

  const ready = status === 'ready'
  const unknownType = ready && typeParam && !matchedType ? typeParam : ''
  // Filters only make sense while loading (shown disabled) or when there are courses to filter.
  const showFilters = status === 'loading' || (ready && courses.length > 0)

  const search = query.trim().toLowerCase()
  const visibleCourses = courses.filter(
    (course) =>
      (selectedType === ALL || course.type === selectedType) &&
      (!search || course.title.toLowerCase().includes(search)),
  )

  // Every matching card stays in the DOM so crawlers that render the page still see all of them.
  // "Load more" only unhides the next batch. A new filter or search starts again from the first batch.
  const filterKey = `${selectedType}|${search}`
  const [shown, setShown] = useState({ key: filterKey, count: PAGE_SIZE })
  const shownCount = shown.key === filterKey ? shown.count : PAGE_SIZE
  const displayedCount = Math.min(shownCount, visibleCourses.length)
  const listRef = useRef(null)

  function loadMore() {
    const firstNew = shownCount
    flushSync(() => setShown({ key: filterKey, count: shownCount + PAGE_SIZE }))
    // Move keyboard focus to the first newly shown course, so it doesn't stay below the new cards.
    listRef.current?.children[firstNew]?.querySelector('a, button')?.focus()
  }

  function selectType(type) {
    setSearchParams(type === ALL ? {} : { type }, { replace: true })
  }

  function clearFilters() {
    selectType(ALL)
    setQuery('')
  }

  const activeFilterCount = (selectedType === ALL ? 0 : 1) + (search ? 1 : 0)

  const typeFilter = (
    <TypeFilter
      options={[ALL, ...types]}
      all={ALL}
      selected={selectedType}
      counts={countByType}
      ready={ready}
      onSelect={selectType}
    />
  )

  const clearAll = activeFilterCount > 0 && (
    <button type="button" onClick={clearFilters} className="pill-line mt-4 w-full">
      Clear filters
    </button>
  )

  return (
    <>
      <Seo
        title="Oncology Courses for Doctors | Medical Global Academy"
        description="Browse oncology fellowships, PG diplomas and certificates from Medical Global Academy. Compare course type, duration and fees, then enquire."
      />

      <section className="relative overflow-hidden rounded-b-[3rem] bg-coral-100 py-16 md:rounded-b-[5rem] md:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 hidden size-56 rounded-[58%_42%_47%_53%/46%_56%_44%_54%] bg-coral-300/60 motion-safe:animate-morph lg:block"
        />
        <div className="fern-frame relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <div className="motion-safe:animate-wipe-in">
              <Kicker>Courses</Kicker>
            </div>
            <h1 className="mt-4 text-[clamp(2.75rem,6.4vw,5rem)] font-medium leading-[1.04] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
              Oncology <Accent>Courses</Accent>
            </h1>
          </div>
          <div className="motion-safe:animate-wipe-in motion-safe:[animation-delay:240ms]">
            <p className="text-lg leading-relaxed text-bark-600">
              Fellowships, PG Diplomas and Certificates in oncology from Medical Global Academy. Choose a course to see
              its details and fees, or talk to a counsellor for guidance.
            </p>
            {ready && courses.length > 0 && (
              <p className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-fern-900">
                {courses.length} courses
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby={headingId} className="py-14 md:py-20">
        <div className="fern-frame mb-8 md:mb-10">
          <p
            role="note"
            className="flex items-start gap-3 rounded-2xl border border-fern-900/15 bg-fern-50/70 px-4 py-3.5 text-sm leading-relaxed text-bark-600 sm:px-5"
          >
            <Info size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-coral-700" />
            <span className="min-w-0">
              <strong className="font-bold text-fern-900">{DISCLAIMER_LABEL}</strong> {DISCLAIMER_BODY}
            </span>
          </p>
        </div>

        <div className={`fern-frame ${showFilters ? 'lg:grid lg:grid-cols-[17.5rem_1fr] lg:gap-10 xl:gap-14' : ''}`}>
          <h2 id={headingId} className="sr-only">
            Browse oncology courses
          </h2>

          {showFilters && (
            <>
              <aside aria-label="Course filters" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
                <SearchBox value={query} onChange={setQuery} disabled={!ready} />
                <div className="mt-5 rounded-[2rem] bg-cream-100 p-3">
                  <p className="px-3 pb-2 pt-1 font-headline text-lg italic text-coral-700">Course type</p>
                  {typeFilter}
                </div>
                {clearAll}
              </aside>

              <div className="mb-6 flex gap-2 lg:hidden">
                <SearchBox value={query} onChange={setQuery} disabled={!ready} className="min-w-0 flex-1" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  disabled={!ready}
                  aria-haspopup="dialog"
                  className="pill-fern h-12 shrink-0 px-5 py-0 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-coral-500 text-xs text-fern-950">
                      <span className="sr-only">, active: </span>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              <FilterDrawer open={drawerOpen} onClose={closeDrawer} resultCount={visibleCourses.length}>
                {typeFilter}
                {clearAll}
              </FilterDrawer>
            </>
          )}

          <div className="min-w-0">
            <p role="status" aria-live="polite" className="min-h-7 font-headline text-lg italic text-bark-600">
              {status === 'loading' && 'Loading courses…'}
              {ready &&
                visibleCourses.length > 0 &&
                `Showing ${displayedCount} of ${visibleCourses.length}${activeFilterCount > 0 ? ' matching' : ''} courses`}
            </p>

            {activeFilterCount > 0 && (
              <ul aria-label="Active filters" className="mt-3 flex flex-wrap gap-2">
                {selectedType !== ALL && (
                  <FilterChip
                    label={typeLabel(selectedType)}
                    removeLabel={`Remove filter: ${typeLabel(selectedType)}`}
                    onRemove={() => selectType(ALL)}
                  />
                )}
                {search && (
                  <FilterChip
                    label={`“${query.trim()}”`}
                    removeLabel={`Remove search: ${query.trim()}`}
                    onRemove={() => setQuery('')}
                  />
                )}
              </ul>
            )}

            {unknownType && courses.length > 0 && (
              <p className="mt-4 rounded-[1.5rem] bg-coral-100 px-5 py-3 text-sm font-medium text-coral-700">
                No {typeLabel(unknownType)} courses are listed right now. Showing all courses.
              </p>
            )}

            <div className="mt-6">
              {status === 'loading' && (
                <div aria-busy="true" className="grid gap-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <CourseCardSkeleton key={index} />
                  ))}
                </div>
              )}

              {status === 'error' && (
                <CourseNotice
                  title="We couldn't load the courses"
                  actions={
                    <>
                      <button type="button" onClick={retry} className="pill-coral">
                        Try again
                      </button>
                      <CounsellorLink />
                    </>
                  }
                >
                  Please check your connection and try again, or call us on {site.counsellorPhone}.
                </CourseNotice>
              )}

              {ready && courses.length === 0 && (
                <CourseNotice title="No oncology courses right now" actions={<CounsellorLink variant="pill-coral" />}>
                  Please check back soon, or talk to a counsellor about upcoming courses.
                </CourseNotice>
              )}

              {ready && courses.length > 0 && visibleCourses.length === 0 && (
                <CourseNotice
                  title="No courses match your filters"
                  actions={
                    <button type="button" onClick={clearFilters} className="pill-coral">
                      Clear filters
                    </button>
                  }
                >
                  Try another course type or a shorter search term.
                </CourseNotice>
              )}

              {visibleCourses.length > 0 && (
                // The key replays the entrance when the type changes. While typing in the search
                // box, cards that stay put hold still and only returning cards animate.
                // Hidden cards use display:none, so their lazy images aren't fetched until shown, and
                // each batch replays the entrance animation when it appears.
                <ul key={selectedType} ref={listRef} className="grid gap-4">
                  {visibleCourses.map((course, index) => (
                    <li
                      key={course.slug}
                      style={{
                        animationDelay: `${Math.min(index % PAGE_SIZE, MAX_STAGGERED_CARDS) * CARD_STAGGER_MS}ms`,
                      }}
                      className={`motion-safe:animate-wipe-in ${index >= shownCount ? 'hidden' : ''}`}
                    >
                      <CourseCard course={course} />
                    </li>
                  ))}
                </ul>
              )}

              {visibleCourses.length > PAGE_SIZE && (
                <div className="mt-10 flex flex-col items-center gap-3 text-center">
                  {displayedCount < visibleCourses.length ? (
                    <button type="button" onClick={loadMore} className="pill-line w-full sm:w-auto">
                      Load more courses
                      <span className="sr-only">
                        , {Math.min(PAGE_SIZE, visibleCourses.length - displayedCount)} more
                      </span>
                    </button>
                  ) : (
                    <p className="font-headline text-lg italic text-bark-600">
                      All {visibleCourses.length} courses shown
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="courses-faq-heading" className="rounded-[3rem] bg-cream-100 py-20 md:rounded-[5rem] md:py-28">
        <div className="fern-frame grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle id="courses-faq-heading" kicker="Good to know">
              Frequently Asked Questions
            </SectionTitle>
          </div>
          <FaqSection faqs={oncologyFaqs} />
        </div>
      </section>

      <section aria-labelledby="courses-cta-heading" className="py-20 md:py-28">
        <div className="fern-frame">
          <Unveil effect="scale">
            <div className="relative isolate flex flex-col items-start gap-8 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-fern-950 via-fern-800 to-fern-600 px-6 py-14 text-cream-50 md:rounded-[4rem] md:px-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
              <div aria-hidden="true" className="absolute -right-16 -top-36 -z-10 size-64 rounded-full bg-coral-500/80" />
              <div aria-hidden="true" className="absolute -bottom-36 -left-20 -z-10 size-64 rounded-full border-[3rem] border-lilac-300/25" />
              <div className="max-w-2xl">
                <h2 id="courses-cta-heading" className="text-4xl font-medium leading-[1.08] md:text-6xl">
                  Ready to deepen your <Accent tone="text-coral-300">oncology knowledge?</Accent>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-cream-50">
                  Compare courses, or send us your question and we will help you find the right fit.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0 lg:flex-col">
                <CounsellorLink variant="pill-coral" />
                <PillLink to="/contact" variant="pill-line-light">
                  Contact Us
                </PillLink>
              </div>
            </div>
          </Unveil>
        </div>
      </section>
    </>
  )
}
