import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Accent, Kicker, Unveil } from '../components/FernKit.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { getCourseTypes, typeLabel, useOncologyCourses } from '../data/oncologyCourseApi.js'
import { courseTypeLinks, legalLinks, navLinks } from '../data/site.js'

const arrowPath = 'M5 12h14 M13 6l6 6-6 6'

const pageGroups = [
  { heading: 'Main pages', links: navLinks, look: 'bg-lilac-100' },
  { heading: 'Course types', links: courseTypeLinks, look: 'bg-coral-100' },
  { heading: 'Legal', links: legalLinks, look: 'bg-fern-100' },
]

function SitemapLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group/map flex items-start justify-between gap-3 rounded-[1.25rem] px-3 py-2 font-medium text-fern-950 transition-colors duration-300 hover:bg-white"
    >
      {children}
      <Icon
        path={arrowPath}
        className="mt-1 size-4 shrink-0 text-coral-700 transition-transform duration-300 group-hover/map:translate-x-1 motion-reduce:transition-none"
        strokeWidth={2.2}
      />
    </Link>
  )
}

function CourseLinks() {
  const { status, courses, retry } = useOncologyCourses()
  const types = useMemo(() => getCourseTypes(courses), [courses])

  if (status === 'loading') {
    return (
      <p role="status" className="mt-6 text-bark-600">
        Loading courses…
      </p>
    )
  }

  if (status === 'error') {
    return (
      <div className="mt-6">
        <p className="text-bark-600">We couldn't load the courses.</p>
        <button type="button" onClick={retry} className="pill-coral mt-4">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-10">
      {types.map((type) => (
        <div key={type} className={type === types[0] ? 'lg:row-span-2' : ''}>
          <h3 className="px-3 text-xl font-medium text-fern-950">{typeLabel(type)}</h3>
          <ul className={`mt-3 grid gap-0.5 ${type === types[0] ? 'sm:grid-cols-2' : ''}`}>
            {courses
              .filter((course) => course.type === type)
              .map((course) => (
                <li key={course.slug}>
                  <SitemapLink to={`/courses/${course.slug}`}>{course.title}</SitemapLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Sitemap() {
  return (
    <>
      <Seo
        title="Sitemap | Medical Global Academy"
        description="Every page on the Medical Global Academy oncology site, including all oncology courses, in one place."
      />

      <section className="rounded-b-[3rem] bg-cream-200 py-16 md:rounded-b-[5rem] md:py-24">
        <div className="fern-frame">
          <div className="motion-safe:animate-wipe-in">
            <Kicker>Find your way</Kicker>
          </div>
          <h1 className="mt-4 text-[clamp(2.75rem,6.4vw,5rem)] font-medium leading-[1.04] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
            Site<Accent>map</Accent>
          </h1>
        </div>
      </section>

      <div className="fern-frame space-y-4 py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {pageGroups.map((group, index) => (
            <Unveil key={group.heading} effect="scale" delay={index * 90} className="h-full">
              <nav aria-labelledby={`map-${index}`} className={`h-full rounded-[2rem] p-5 sm:p-6 ${group.look}`}>
                <h2 id={`map-${index}`} className="px-3 text-2xl font-medium text-fern-950">
                  {group.heading}
                </h2>
                <ul className="mt-3 grid gap-0.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <SitemapLink to={link.to}>{link.label}</SitemapLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </Unveil>
          ))}
        </div>

        <nav aria-labelledby="map-courses" className="rounded-[2rem] bg-cream-100 p-5 sm:p-8">
          <h2 id="map-courses" className="px-3 text-2xl font-medium text-fern-950 md:text-3xl">
            All courses
          </h2>
          <CourseLinks />
        </nav>
      </div>
    </>
  )
}
