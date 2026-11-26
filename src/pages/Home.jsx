import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCard, { CourseCardSkeleton } from '../components/CourseCard.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import FaqSection from '../components/FaqSection.jsx'
import { Accent, LoopStrip, PillLink, SectionTitle, Unveil } from '../components/FernKit.jsx'
import Icon from '../components/Icon.jsx'
import ImageLightbox from '../components/ImageLightbox.jsx'
import OncologyIllustration from '../components/OncologyIllustration.jsx'
import Seo from '../components/Seo.jsx'
import { getFeaturedCourses, useOncologyCourses } from '../data/oncologyCourseApi.js'
import { oncologyDoctors } from '../data/oncologyDoctors.js'
import { oncologyFaqs } from '../data/oncologyFaqs.js'
import { courseTypeLinks } from '../data/site.js'
import useSeenOnce from '../hooks/useSeenOnce.js'

// Faculty, hospitals and reviews only show in development until they are real. Switch each to
// true once every entry in its list has been confirmed.
const SHOW_FACULTY = import.meta.env.DEV
const SHOW_HOSPITALS = import.meta.env.DEV
const SHOW_TESTIMONIALS = import.meta.env.DEV

// TODO: these figures came from the surgery site. Confirm they are accurate for this site before launch.
const stats = [
  { value: 12500, suffix: '+', label: 'Happy Students' },
  { value: 25, suffix: '+', label: 'Years Experience' },
  { value: 15, suffix: '+', label: 'Expert Doctors' },
  { value: 98, suffix: '%', label: 'Success Rate' },
]

const shieldCheckPath = 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4'
const peoplePath =
  'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74'
const clipboardPath = 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4'
const ribbonPath = 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1'
const bookPath = 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z'
const arrowPath = 'M5 12h14 M13 6l6 6-6 6'
const backArrowPath = 'M19 12H5 M11 6l-6 6 6 6'

const heroSeals = [
  {
    title: 'CPD Accredited',
    subtitle: 'The CPD Standards Office',
    look: 'left-0 top-6 bg-lilac-300 text-fern-950 sm:left-[4%] sm:top-16 lg:left-[10%]',
  },
  {
    title: 'ACTD Aligned',
    subtitle: 'American Council of Training & Development',
    look: 'right-0 top-44 bg-coral-500 text-fern-950 [animation-delay:-5s] sm:right-[3%] sm:top-48 lg:right-[9%]',
  },
]

const heroTrust = [
  { label: 'CPD Accredited', icon: shieldCheckPath },
  { label: 'Specialist-led Faculty', icon: peoplePath },
  { label: 'Online & Hybrid', icon: 'M3 5h18v11H3z M8 20h8 M12 16v4' },
  { label: 'Case-based Learning', icon: clipboardPath },
]

// TODO: confirm the faculty, curriculum and guideline claims below with the academic team.
const features = [
  {
    icon: peoplePath,
    title: 'Specialist-Led Faculty',
    description:
      'Learn from doctors who work in oncology and bring real cases and clinical judgement into their teaching.',
    span: 'sm:col-span-2 lg:col-span-2',
    look: 'bg-cream-100 hover:shadow-stamp',
  },
  {
    icon: clipboardPath,
    title: 'Case-Based Learning',
    description:
      'Go beyond theory with case discussions and tumour board style sessions, from diagnosis and staging to treatment planning.',
    span: 'lg:col-span-2',
    look: 'bg-lilac-100 hover:shadow-stamp',
  },
  {
    icon: ribbonPath,
    title: 'Recognised Certification',
    description:
      'Receive a certificate on completion, backed by CPD accreditation and ACTD alignment, to strengthen your professional profile.',
    span: 'lg:col-span-2',
    look: 'bg-coral-100 hover:shadow-stamp',
  },
  {
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a14 14 0 010 18 M12 3a14 14 0 000 18',
    title: 'Multidisciplinary Thinking',
    description:
      'See how medical, surgical and radiation oncology fit together with supportive and palliative care in one plan.',
    span: 'lg:col-span-2',
    look: 'bg-fern-100 hover:shadow-stamp',
  },
  {
    icon: bookPath,
    title: 'Current Curriculum',
    description:
      'Study modules that move from cancer biology and staging to systemic therapy and case-based management.',
    span: 'lg:col-span-2',
    look: 'bg-cream-200 hover:shadow-stamp',
  },
  {
    icon: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
    title: 'Career Advancement',
    description:
      'Deepen your oncology knowledge with confidence and take the next step in your medical career.',
    span: 'sm:col-span-2 lg:col-span-2',
    look: 'border-2 border-fern-900 bg-transparent hover:shadow-stamp',
  },
]

// TODO: confirm with the academic team what each program really includes. Do not mention
// hands-on or clinical training unless a program offers it.
const pathwaySteps = [
  {
    num: '01',
    badge: 'Foundation',
    icon: ribbonPath,
    title: 'Enroll in a Course',
    description: 'Choose a fellowship, PG Diploma or certificate that suits your goals and your working schedule.',
  },
  {
    num: '02',
    badge: 'Knowledge',
    icon: peoplePath,
    title: 'Learn From Experts',
    description: 'Build your understanding of cancer biology, staging and treatment through structured modules.',
  },
  {
    num: '03',
    badge: 'Apply',
    icon: clipboardPath,
    title: 'Case-based Learning',
    description: 'Work through oncology case scenarios covering evaluation, treatment intent and supportive care.',
  },
  {
    num: '04',
    badge: 'Achieve',
    icon: shieldCheckPath,
    title: 'Get Certified',
    description: 'Receive a certificate on completion, backed by our CPD accreditation and ACTD alignment.',
  },
]

const uploads = 'https://medicalglobalacademy.com/wp-content/uploads'

// Shown as one strip: round seals on the outside, tilted certificate papers overlapping in the
// middle. On phones the seals share a row above the certificates, using `place`.
const accreditations = [
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-25-at-4.27.09-PM.jpeg`,
    kind: 'seal',
    place: 'order-1 -rotate-6',
    title: 'CPD Accredited Badge',
    // The two logos open the accreditor's public listing instead of the lightbox.
    href: 'https://directory.cpdstandards.com/providers/medical-global-academy/',
    alt: 'Accredited CPD & Training Excellence badge, PDCD1106 Dual Training & CPD Accreditation',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-10.15.41-AM.jpeg`,
    kind: 'paper',
    place: 'order-3 -rotate-2 lg:order-2 lg:-rotate-3',
    title: 'CPD Accreditation Certificate',
    alt: 'Official Certificate of CPD Accreditation certifying that Medical Global Academy has achieved Dual CPD & Provider of Training Excellence status with The CPD Standards Office, provider number PDCD1106, valid 2026–2028',
  },
  {
    src: `${uploads}/2026/10/WhatsApp-Image-2026-10-17-at-5.58.43-PM.jpeg`,
    kind: 'paper',
    place: 'order-4 rotate-2 lg:order-3 lg:-ml-10 lg:rotate-3',
    title: 'ACTD Certificate of Accreditation',
    alt: 'American Council of Training and Development Certificate of Accreditation certifying Medical Global Academy as an accredited professional training institution, accreditation number GNA452N, valid until September 12, 2027',
  },
  {
    src: `${uploads}/2026/09/WhatsApp-Image-2026-09-24-at-12.17.06-PM.jpeg`,
    kind: 'seal',
    place: 'order-2 rotate-6 lg:order-4',
    title: 'ACTD Member Seal',
    href: 'https://www.actd.us/medicalglobalacademy/',
    alt: 'ACTD, American Council of Training and Development eagle seal',
  },
]

// The wording comes from the certificates above. Keep it in sync if a certificate is renewed.
const accreditationDetails = [
  {
    name: 'CPD Accreditation',
    body: 'Dual CPD & Provider of Training Excellence, awarded by The CPD Standards Office.',
    meta: 'Provider no. PDCD1106 · Valid 2026–2028',
  },
  {
    name: 'ACTD Accreditation',
    body: 'Accredited professional training institution, certified by the American Council of Training and Development.',
    meta: 'Accreditation no. GNA452N · Valid until 12 September 2027',
  },
]

// TODO: confirm these hospitals are partners for the oncology programs, then set SHOW_HOSPITALS.
const hospitals = ['Medanta', 'Fortis', 'Manipal Hospitals', 'Jeeban Suraksha Hospital', 'Max Hospital']

// TODO: replace with real, consented reviews (name, role, hospital, text), then set SHOW_TESTIMONIALS.
// The names and "Sample review:" quotes are invented text for layout only.
const testimonials = [
  {
    name: 'Sample Learner 1',
    quote: 'Sample review: The case discussions were well structured and easy to follow alongside my hospital duties.',
  },
  {
    name: 'Sample Learner 2',
    quote: 'Sample review: The staging modules helped me revise concepts, and the material was organised module by module.',
  },
  {
    name: 'Sample Learner 3',
    quote: 'Sample review: The program was designed for working doctors, which made planning my study time simple.',
  },
  {
    name: 'Sample Learner 4',
    quote: 'Sample review: The sessions on treatment intent and common toxicities were explained in a clear order.',
  },
]

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function HeroCollage() {
  return (
    <div className="relative mx-auto mt-14 h-[25rem] w-full max-w-5xl sm:h-[30rem] lg:h-[34rem]">
      <div className="absolute bottom-0 left-1/2 aspect-[4/5] h-full -translate-x-1/2 overflow-hidden rounded-t-full bg-fern-900 motion-safe:animate-bloom">
        <OncologyIllustration />
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream-50 px-4 py-1.5 text-xs font-bold text-fern-900">
          Biology · Staging · Treatment
        </span>
      </div>

      {heroSeals.map((seal) => (
        <div
          key={seal.title}
          className={`absolute ${seal.look} grid size-36 place-content-center rounded-[58%_42%_47%_53%/46%_56%_44%_54%] p-4 text-center motion-safe:animate-morph sm:size-52 sm:p-7`}
        >
          <span className="font-headline text-base font-semibold leading-tight sm:text-2xl">{seal.title}</span>
          <span className="mt-1 text-[11px] font-medium leading-snug sm:text-[13px]">{seal.subtitle}</span>
        </div>
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cream-50 pt-14 md:pt-20">
      <div aria-hidden="true" className="absolute -left-40 top-24 -z-10 size-[28rem] rounded-full bg-lilac-100" />
      <div aria-hidden="true" className="absolute -right-44 top-[-6rem] -z-10 size-[30rem] rounded-full bg-coral-100" />

      <div className="fern-frame text-center">
        <p className="font-headline text-lg italic text-coral-700 motion-safe:animate-wipe-in md:text-xl">
          Welcome to Medical Global Academy
        </p>
        <h1 className="mx-auto mt-5 max-w-6xl text-[clamp(2.5rem,7.2vw,6.25rem)] font-medium leading-[1.04] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
          <span className="block">
            Master <Accent>Oncology.</Accent>
          </span>
          <span className="block">
            Lead with <Accent>Confidence.</Accent>
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-bark-600 motion-safe:animate-wipe-in motion-safe:[animation-delay:240ms] md:text-xl">
          Fellowships and courses with clear modules and specialist teaching, for doctors after MBBS who
          want a stronger understanding of cancer care.
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[2rem] border-2 border-fern-900 bg-white p-3 motion-safe:animate-bloom motion-safe:[animation-delay:320ms] md:flex-row md:items-center md:justify-between md:rounded-full md:p-2 md:pl-6">
          <nav aria-label="Browse courses by type" className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            <span className="mr-2 text-sm font-medium text-bark-600">Browse by</span>
            {courseTypeLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-3 py-2 text-sm font-bold text-fern-900 transition-colors duration-300 hover:bg-fern-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <PillLink to="/courses">Explore Courses</PillLink>
        </div>
        <p className="mt-5 text-bark-600">
          Not sure yet?{' '}
          <Link to="/contact" className="font-bold text-fern-800 underline decoration-coral-500 decoration-2 underline-offset-4 hover:text-coral-700">
            Enquire Now
          </Link>
        </p>

        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {heroTrust.map((item) => (
            <li
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full bg-fern-100 px-4 py-2 text-sm font-semibold text-fern-900"
            >
              <Icon path={item.icon} className="size-4 shrink-0" />
              {item.label}
            </li>
          ))}
        </ul>

        <HeroCollage />
      </div>
    </section>
  )
}

function Tally({ end, suffix, start }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    const duration = prefersReducedMotion() ? 0 : 1800
    let startTime = null
    let frame

    const tick = (time) => {
      if (startTime === null) startTime = time
      const progress = duration ? Math.min((time - startTime) / duration, 1) : 1
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, end])

  return (
    <>
      {count.toLocaleString('en-US')}
      {suffix}
    </>
  )
}

function NumbersBand() {
  const [ref, seen] = useSeenOnce(0.3)

  return (
    <section aria-label="Academy in numbers" className="bg-fern-900 text-cream-50">
      <div className="fern-frame">
        <dl ref={ref} className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-cream-50/20 px-2 py-10 text-center odd:border-r nth-[-n+2]:border-b md:py-14 lg:border-r lg:nth-[-n+2]:border-b-0 lg:last:border-r-0"
            >
              <dd className="font-headline text-4xl font-medium text-coral-300 sm:text-5xl lg:text-6xl">
                <Tally end={stat.value} suffix={stat.suffix} start={seen} />
              </dd>
              <dt className="mt-3 text-sm font-medium text-fern-100 md:text-base">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function WhyBento() {
  return (
    <section aria-labelledby="why-heading" className="bg-cream-50 py-20 md:py-28 lg:py-36">
      <div className="fern-frame">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Unveil effect="left">
            <SectionTitle id="why-heading" kicker="Why Choose Us">
              Learn Oncology the Way <Accent>Specialists Teach It</Accent>
            </SectionTitle>
          </Unveil>
          <Unveil effect="right">
            <p className="text-lg leading-relaxed text-bark-600">
              Medical Global Academy offers specialist-led oncology education, designed to help doctors build
              their understanding of cancer care with confidence.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ul aria-label="Accreditations" className="flex flex-wrap gap-2">
                {['CPD', 'ACTD'].map((badge) => (
                  <li
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full bg-lilac-100 px-3.5 py-2 text-sm font-bold text-fern-950"
                  >
                    <Icon path={shieldCheckPath} className="size-4" strokeWidth={2} />
                    {badge} Accredited
                  </li>
                ))}
              </ul>
              <PillLink to="/courses" variant="pill-line">
                Explore Courses
              </PillLink>
            </div>
          </Unveil>
        </div>

        {/* Equal rows on desktop; below that each card hugs its content (cards side by side still match) */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:auto-rows-fr lg:grid-cols-6">
          {features.map((feature, index) => (
            <Unveil key={feature.title} effect="scale" delay={index * 70} className={feature.span}>
              <article
                className={`group/tile relative flex h-full flex-col overflow-hidden rounded-[2rem] p-5 transition-shadow duration-300 md:p-6 lg:min-h-[220px] ${feature.look}`}
              >
                <span className="relative grid size-10 place-items-center rounded-full bg-fern-900 text-cream-50 transition-transform duration-500 group-hover/tile:rotate-[18deg] motion-reduce:transition-none">
                  <Icon path={feature.icon} className="size-5" />
                </span>
                <h3 className="relative mt-4 text-xl font-medium leading-[1.2] text-balance text-fern-950 md:text-2xl">
                  {feature.title}
                </h3>
                <p className="relative mt-3 max-w-sm text-sm leading-normal text-bark-600 md:text-[15px]">
                  {feature.description}
                </p>
              </article>
            </Unveil>
          ))}
        </div>
      </div>
    </section>
  )
}

// Tracks which ways the carousel can still scroll, and scrolls it by one card.
function useCourseRail(itemCount) {
  const railRef = useRef(null)
  const [canScroll, setCanScroll] = useState({ back: false, forward: false })

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const measure = () => {
      setCanScroll({
        back: rail.scrollLeft > 4,
        forward: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4,
      })
    }

    // The observer also fires once on start, which sets the first state.
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    rail.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      rail.removeEventListener('scroll', measure)
    }
  }, [itemCount])

  const scrollRail = (direction) => {
    const rail = railRef.current
    const step = rail.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap)
    rail.scrollBy({ left: direction * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return { railRef, canScroll, scrollRail }
}

function RailArrow({ label, path, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-13 place-items-center rounded-full border-2 border-fern-900 text-fern-900 transition-colors duration-300 hover:bg-fern-900 hover:text-cream-50 disabled:cursor-not-allowed disabled:border-cream-200 disabled:bg-transparent disabled:text-bark-600/50"
    >
      <Icon path={path} strokeWidth={2.2} />
    </button>
  )
}

function CourseCarousel() {
  const { status, courses } = useOncologyCourses()
  const featured = getFeaturedCourses(courses)
  const { railRef, canScroll, scrollRail } = useCourseRail(status === 'ready' ? featured.length : 0)

  // The Courses page explains a failed load, so Home just leaves this section out.
  if (status === 'error' || (status === 'ready' && featured.length === 0)) return null

  const slideClass = 'w-[86%] shrink-0 snap-start sm:w-[58%] lg:w-[calc((100%-3rem)/3)]'

  return (
    <section aria-labelledby="courses-heading" className="rounded-t-[3rem] bg-cream-100 py-20 md:rounded-t-[5rem] md:py-28">
      <div className="fern-frame">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Unveil effect="left">
            <SectionTitle id="courses-heading" kicker="Start here">
              Featured Oncology Courses
            </SectionTitle>
          </Unveil>
          {status === 'ready' && (
            <div className="flex gap-3">
              <RailArrow label="Previous courses" path={backArrowPath} disabled={!canScroll.back} onClick={() => scrollRail(-1)} />
              <RailArrow label="Next courses" path={arrowPath} disabled={!canScroll.forward} onClick={() => scrollRail(1)} />
            </div>
          )}
        </div>

        <ul
          ref={railRef}
          tabIndex={0}
          aria-label="Featured oncology courses, scroll sideways for more"
          aria-busy={status === 'loading'}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pr-2 pt-1"
        >
          {status === 'loading'
            ? Array.from({ length: 3 }, (_, index) => (
                <li key={index} className={slideClass}>
                  <CourseCardSkeleton />
                </li>
              ))
            : featured.map((course) => (
                <li key={course.slug} className={slideClass}>
                  <CourseCard course={course} />
                </li>
              ))}
        </ul>

        {status === 'ready' && (
          <div className="mt-10">
            <PillLink to="/courses" variant="pill-fern">
              View All {courses.length} Courses
            </PillLink>
          </div>
        )}
      </div>
    </section>
  )
}

function PathwayTimeline() {
  return (
    <section aria-labelledby="pathway-heading" className="bg-cream-100 pb-20 pt-8 md:pb-32">
      <div className="fern-frame">
        <Unveil>
          <SectionTitle id="pathway-heading" kicker="Your Pathway" align="text-left lg:text-center">
            From Enrolment to <Accent>Certificate</Accent>
          </SectionTitle>
        </Unveil>

        <div className="relative mx-auto mt-14 max-w-5xl lg:mt-20">
          <Unveil className="absolute bottom-0 left-6 top-0 lg:left-1/2">
            <div aria-hidden="true" className="h-full w-0 -translate-x-1/2 border-l-[3px] border-dashed border-fern-300" />
          </Unveil>

          <ol className="relative space-y-10 lg:space-y-16">
            {pathwaySteps.map((step, index) => {
              const cardOnLeft = index % 2 === 0

              return (
                <li key={step.num} className="relative pl-16 lg:grid lg:grid-cols-2 lg:gap-28 lg:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-6 z-10 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-coral-500 font-headline text-lg font-semibold text-fern-950 ring-8 ring-cream-100 lg:left-1/2 lg:top-8 lg:size-14"
                  >
                    {step.num}
                  </span>

                  <Unveil effect={cardOnLeft ? 'left' : 'right'} className={cardOnLeft ? '' : 'lg:col-start-2'}>
                    <div className="rounded-[2rem] bg-white p-7 lg:p-9">
                      <p className="flex items-center gap-2 text-sm font-bold text-coral-700">
                        <Icon path={step.icon} className="size-5" />
                        Step {index + 1} · {step.badge}
                      </p>
                      <h3 className="mt-4 text-2xl font-medium text-fern-950 lg:text-3xl">{step.title}</h3>
                      <p className="mt-3 leading-relaxed text-bark-600">{step.description}</p>
                    </div>
                  </Unveil>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function CertificateTile({ item, onOpen, onError }) {
  const isSeal = item.kind === 'seal'
  // Items with an href link out to the accreditor; the rest open in the lightbox.
  const Tile = item.href ? 'a' : 'button'
  const action = item.href
    ? {
        href: item.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Verify ${item.title} on the accreditor's website (opens in a new tab)`,
      }
    : { type: 'button', onClick: () => onOpen(item), 'aria-label': `View ${item.title} in full size` }

  return (
    <div
      className={`${item.place} ${isSeal ? '' : 'w-full sm:w-auto'} transition-[rotate] duration-300 hover:z-10 hover:rotate-0 motion-reduce:transition-none`}
    >
      <Tile
        {...action}
        className={`group/paper relative block bg-white shadow-paper transition-transform duration-300 ease-out hover:scale-105 focus-visible:scale-105 motion-reduce:transition-none ${
          isSeal ? 'size-32 rounded-full p-3 sm:size-40 lg:size-36 xl:size-44' : 'aspect-[4/3] w-full rounded-lg p-2 sm:w-80 lg:w-72 xl:w-[23rem]'
        }`}
      >
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          onError={() => onError(item.src)}
          className={`size-full object-contain ${isSeal ? 'rounded-full' : ''}`}
        />
        <span
          aria-hidden="true"
          className={`absolute grid size-9 place-items-center rounded-full bg-coral-500 text-fern-950 transition-transform duration-300 group-hover/paper:rotate-90 motion-reduce:transition-none ${
            isSeal ? '-right-1 -top-1' : 'right-5 top-4'
          }`}
        >
          <Icon path="M12 5v14 M5 12h14" className="size-4" strokeWidth={2.6} />
        </span>
      </Tile>
    </div>
  )
}

function CredentialsStrip() {
  const [openItem, setOpenItem] = useState(null)
  const [failed, setFailed] = useState(() => new Set())
  const closeLightbox = useCallback(() => setOpenItem(null), [])

  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))
  const items = accreditations.filter((item) => !failed.has(item.src))

  if (items.length === 0) return null

  return (
    <section id="accreditation" aria-labelledby="accreditation-heading" className="overflow-hidden bg-lilac-100 py-20 md:py-28">
      <div className="fern-frame">
        <Unveil className="mx-auto max-w-3xl text-center">
          <SectionTitle id="accreditation-heading" kicker="Accreditation" align="text-center">
            Globally recognised &amp; <Accent>CPD/ACTD</Accent> aligned certification
          </SectionTitle>
          <p className="mt-6 text-lg leading-relaxed text-bark-600">
            Our programs are backed by CPD accreditation and ACTD alignment. Open any badge or certificate to
            view the official document in full size.
          </p>
        </Unveil>

        <Unveil effect="scale">
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-8 lg:flex-nowrap lg:gap-x-4">
            {items.map((item) => (
              <CertificateTile key={item.src} item={item} onOpen={setOpenItem} onError={markFailed} />
            ))}
          </div>
        </Unveil>

        <ul className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-2">
          {accreditationDetails.map((detail, index) => (
            <li key={detail.name}>
              <Unveil effect={index === 0 ? 'left' : 'right'} className="h-full">
                <div className="h-full rounded-[2rem] bg-white p-7">
                  <h3 className="flex items-center gap-2.5 text-xl font-medium text-fern-950">
                    <Icon path={shieldCheckPath} className="size-6 shrink-0 text-coral-700" strokeWidth={2} />
                    {detail.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-bark-600">{detail.body}</p>
                  <p className="mt-4 text-sm font-bold text-fern-800">{detail.meta}</p>
                </div>
              </Unveil>
            </li>
          ))}
        </ul>
      </div>
      <ImageLightbox item={openItem} onClose={closeLightbox} />
    </section>
  )
}

function FacultyPortraits() {
  return (
    <section aria-labelledby="faculty-heading" className="bg-cream-50 py-20 md:py-28">
      <div className="fern-frame">
        <SectionTitle id="faculty-heading" kicker="The people teaching you">
          Meet Our Faculty
        </SectionTitle>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {oncologyDoctors.map((doctor, index) => (
            <li key={doctor.name} className={index % 2 === 1 ? 'sm:mt-8' : ''}>
              <Unveil className="h-full">
                <DoctorCard doctor={doctor} tone={index} headingLevel="h3" />
              </Unveil>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HospitalStrip() {
  return (
    <section aria-labelledby="hospitals-heading" className="bg-cream-100 py-14">
      <h2 id="hospitals-heading" className="text-center text-2xl font-medium text-fern-950 md:text-3xl">
        Our Hospital Network
      </h2>
      <div className="mt-8">
        <LoopStrip
          items={hospitals}
          renderChip={(hospital) => (
            <span className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white py-2 pl-2 pr-6 font-headline text-lg font-medium text-fern-900">
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-fern-100 font-bold">
                {hospital[0]}
              </span>
              {hospital}
            </span>
          )}
        />
      </div>
    </section>
  )
}

function QuoteSlider() {
  const [active, setActive] = useState(0)
  const total = testimonials.length
  const current = testimonials[active]

  return (
    <section aria-labelledby="testimonials-heading" className="bg-fern-50 py-20 md:py-28">
      <div className="fern-frame">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <h2 id="testimonials-heading" className="text-3xl font-medium text-fern-950 md:text-4xl">
              What Doctors Say
            </h2>
            <div className="flex gap-3">
              <RailArrow label="Previous review" path={backArrowPath} onClick={() => setActive((active - 1 + total) % total)} />
              <RailArrow label="Next review" path={arrowPath} onClick={() => setActive((active + 1) % total)} />
            </div>
          </div>

          <div aria-live="polite" className="mt-10 min-h-[17rem] md:min-h-[15rem]">
            <figure key={current.name} className="motion-safe:animate-quote-in">
              <span aria-hidden="true" className="block font-headline text-8xl leading-[0.7] text-coral-500">
                “
              </span>
              <blockquote className="font-headline text-2xl font-normal leading-snug text-fern-950 md:text-4xl">
                {current.quote}
              </blockquote>
              <figcaption className="mt-6 font-bold text-fern-800">{current.name}</figcaption>
            </figure>
          </div>

          <ul className="mt-8 flex gap-1">
            {testimonials.map((testimonial, index) => (
              <li key={testimonial.name}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show review ${index + 1} of ${total}`}
                  aria-current={index === active || undefined}
                  className="group/dot grid size-8 place-items-center"
                >
                  <span
                    className={`block h-2.5 rounded-full transition-all duration-300 ${
                      index === active ? 'w-7 bg-fern-900' : 'w-2.5 bg-fern-300 group-hover/dot:bg-fern-600'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function FaqPanel() {
  return (
    <section aria-labelledby="faq-heading" className="bg-cream-50 py-20 md:py-28">
      <div className="fern-frame grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle id="faq-heading" kicker="Good to know">
            Frequently Asked Questions
          </SectionTitle>
        </div>
        <FaqSection faqs={oncologyFaqs} />
      </div>
    </section>
  )
}

function ClosingCard() {
  return (
    <section aria-labelledby="cta-heading" className="bg-cream-50 pb-20 md:pb-28">
      <div className="fern-frame">
        <Unveil effect="scale">
          <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-linear-to-br from-fern-950 via-fern-800 to-fern-600 px-6 py-16 text-center text-cream-50 md:rounded-[4rem] md:px-16 md:py-24">
            <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-coral-500/80" />
            <div aria-hidden="true" className="absolute -bottom-28 -left-16 -z-10 size-72 rounded-full bg-lilac-300/25" />
            <h2 id="cta-heading" className="mx-auto max-w-3xl text-4xl font-medium leading-[1.1] md:text-6xl">
              Ready to deepen your oncology knowledge?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream-50">
              Compare courses, or send us your question and we will help you find the right fit.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <PillLink to="/courses">Explore Courses</PillLink>
              <PillLink to="/contact" variant="pill-line-light">
                Contact Us
              </PillLink>
            </div>
          </div>
        </Unveil>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        title="Oncology Fellowships for MBBS Doctors | MGA India"
        description="Explore oncology fellowships and courses for doctors after MBBS at Medical Global Academy. Compare modules, duration, mode and eligibility."
      />

      <Hero />
      <NumbersBand />
      <WhyBento />
      <CourseCarousel />
      <PathwayTimeline />
      <CredentialsStrip />
      {SHOW_FACULTY && <FacultyPortraits />}
      {SHOW_HOSPITALS && <HospitalStrip />}
      {SHOW_TESTIMONIALS && <QuoteSlider />}
      <FaqPanel />
      <ClosingCard />
    </>
  )
}
