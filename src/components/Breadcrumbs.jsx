import { ChevronRight, Home } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import {
  BREADCRUMB_BASE_URL,
  DYNAMIC_PARENTS,
  NOT_FOUND_LABEL,
  REDIRECT_PREFIXES,
  ROUTE_LABELS,
} from '../config/breadcrumbs.js'
import { useOncologyCourses } from '../data/oncologyCourseApi.js'

const HOME = { to: '/', label: ROUTE_LABELS['/'] }
const NOT_FOUND_TRAIL = [HOME, { to: null, label: NOT_FOUND_LABEL }]

const linkClass =
  'inline-flex items-center gap-1.5 rounded-sm transition-colors duration-200 hover:text-primary-700 motion-reduce:transition-none'

// "fellowship-in-oncology" -> "Fellowship In Oncology", shown until the real course name is known
function titleCase(slug) {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

// The router matches paths case-insensitively and ignores a trailing slash, so the lookup does too.
function normalise(pathname) {
  return pathname.replace(/\/+$/, '').toLowerCase() || '/'
}

function BreadcrumbJsonLd({ items }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BREADCRUMB_BASE_URL}${item.to === '/' ? '' : item.to}`,
    })),
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}

function Trail({ items, frameClass, structuredData = true }) {
  return (
    <>
      {structuredData && <BreadcrumbJsonLd items={items} />}
      <nav aria-label="Breadcrumb" className={`${frameClass} py-3 text-sm text-ink-600`}>
        <ol className="flex min-w-0 items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const isHome = index === 0
            return (
              <li key={`${item.to}-${index}`} className={`flex items-center gap-1.5 ${isLast ? 'min-w-0' : 'shrink-0'}`}>
                {index > 0 && <ChevronRight size={14} strokeWidth={2} aria-hidden="true" className="shrink-0 opacity-60" />}
                {isLast ? (
                  <span aria-current="page" title={item.label} className="truncate font-semibold text-ink-900">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.to} className={linkClass}>
                    {isHome && <Home size={15} strokeWidth={2} aria-hidden="true" className="shrink-0" />}
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

// Only course pages need the course list, so only they mount the hook (the list is cached for the session).
function CourseTrail({ parent, slug, label, frameClass }) {
  const { status, courses } = useOncologyCourses()
  const course = courses.find((item) => item.slug === slug)

  // CourseDetail shows the 404 page for a slug that is not on the list.
  if (status === 'ready' && !course && !label) return <Trail items={NOT_FOUND_TRAIL} frameClass={frameClass} structuredData={false} />

  const items = [
    HOME,
    { to: parent, label: ROUTE_LABELS[parent] },
    { to: `${parent}/${slug}`, label: label ?? course?.title ?? titleCase(slug) },
  ]
  return <Trail items={items} frameClass={frameClass} />
}

/**
 * Trail built from the current URL. Hidden on Home and on redirect-only paths.
 * `label` overrides the text of the current (last) item.
 * `frameClass` sets the container so it lines up with the page below it.
 */
export default function Breadcrumbs({ label, frameClass = 'page-gutter' }) {
  const { pathname } = useLocation()
  const path = normalise(pathname)

  if (path === '/') return null
  if (REDIRECT_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null

  const segments = path.split('/').filter(Boolean)

  if (segments.length === 2 && DYNAMIC_PARENTS[segments[0]]) {
    // Matched exactly as written in the URL, the same way CourseDetail matches it
    const slug = safeDecode(pathname.replace(/\/+$/, '').split('/').pop())
    return <CourseTrail parent={DYNAMIC_PARENTS[segments[0]]} slug={slug} label={label} frameClass={frameClass} />
  }

  if (segments.length === 1 && ROUTE_LABELS[path]) {
    return <Trail items={[HOME, { to: path, label: label ?? ROUTE_LABELS[path] }]} frameClass={frameClass} />
  }

  return <Trail items={NOT_FOUND_TRAIL} frameClass={frameClass} structuredData={false} />
}
