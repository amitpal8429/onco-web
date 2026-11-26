import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accent, Kicker, LoopStrip, PillLink, SectionTitle, Unveil } from '../components/FernKit.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import StatsCounter from '../components/StatsCounter.jsx'
import ValuesSection from '../components/ValuesSection.jsx'

// TODO: verify these company numbers before launch.
// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const stats = [
  {
    icon: 'M6 3v6a4 4 0 008 0V3 M10 13v3a5 5 0 0010 0v-2 M20 14a2 2 0 100-4 2 2 0 000 4z',
    value: '200+',
    label: 'Practicing Physicians',
  },
  {
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
    value: '150+',
    label: 'Specialized Programs',
  },
  {
    icon: 'M6 18h8 M3 22h18 M14 22a7 7 0 100-14h-1 M9 14h2 M9 12a2 2 0 01-2-2V6h6v4a2 2 0 01-2 2z M12 6V3a1 1 0 00-1-1H9a1 1 0 00-1 1v3',
    value: '25+',
    label: 'Medical Specializations',
  },
  {
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
    value: '10K+',
    label: 'Students Trained',
  },
]

// Company-wide specialties (Medical Global Academy teaches all of these); Oncology is listed first on this site.
const specialties = [
  'Oncology',
  'Surgery',
  'Neurology',
  'Cardiology',
  'Medicine',
  'Nephrology',
  'Orthopedics',
  'Obstetrics & Gynecology',
]

// Hero "What we offer" items. Each line restates the hero copy; no new claims.
const offerings = [
  {
    title: 'PG Diplomas',
    line: 'Built for the professional development of healthcare practitioners.',
    icon: 'M12 3L2 8l10 5 10-5-10-5z M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5',
  },
  {
    title: 'Fellowships',
    line: 'Flexible learning with attending and non-attending classes.',
    icon: 'M12 15a4 4 0 100-8 4 4 0 000 8z M9 14.5L8 21l4-2 4 2-1-6.5',
  },
  {
    title: 'Certificates',
    line: 'Pursue your education at your convenience, without compromising on quality.',
    icon: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h5',
  },
]

const recognitions = ['CPD Accredited', 'ACTD Accredited', 'Global Recognition']

// Teaching approach steps. Describes how the programs are delivered; no outcome claims.
// TODO: confirm the faculty claim ("experienced specialists") with the academic team.
const approach = [
  {
    title: 'Case-Based Learning',
    line: 'Topics are taught through clinical cases, from presentation to management.',
    icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12h6 M9 16h4',
  },
  {
    title: 'Specialist-Led Faculty',
    line: 'Sessions are led by experienced specialists in the field.',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
  },
  {
    title: 'Flexible Online Access',
    line: 'Live and recorded sessions you can fit around clinical work.',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4',
  },
  {
    title: 'Certification',
    line: 'A certificate on completion, from a CPD and ACTD accredited provider.',
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
  },
]

// Grouped from the live course API (the same name, category and department filter as
// oncologyCourseApi.js, checked 3 Nov 2026: all 21 oncology courses are listed). `courses` lists
// the slugs behind each group; `line` only repeats topics named in those course descriptions.
// TODO: confirm the six groups and their wording with the academic team.
const specializations = [
  {
    title: 'Core Oncology & Oncopathology',
    line: 'Cancer biology, tumour pathology, chemotherapy, targeted therapy, immunotherapy and molecular diagnostics.',
    courses: [
      'fellowship-in-oncology',
      'pg-diploma-in-oncology',
      'certificate-in-oncology',
      'fellowship-in-oncopathology',
    ],
    // Cell: membrane and nucleus
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 15a3 3 0 100-6 3 3 0 000 6z',
  },
  {
    title: 'Surgical Oncology',
    line: 'Principles of surgical oncology, tumour staging and preoperative assessment, including breast cancer and musculoskeletal tumours.',
    courses: [
      // TODO: surgery overlap. The first three are also shown on the surgery site; decide where they belong.
      'fellowship-in-surgical-oncology',
      'fellowship-in-oncosurgery',
      'fellowship-in-breast-onco-surgery',
      'fellowship-in-orthopedic-oncology',
    ],
    // Surgical scissors
    icon: 'M6 9a3 3 0 100-6 3 3 0 000 6z M6 21a3 3 0 100-6 3 3 0 000 6z M8.2 8.2L20 19 M8.2 15.8L20 5',
  },
  {
    title: 'Gynecologic Oncology',
    line: 'Cervical, ovarian, endometrial, vulvar and vaginal cancers, gestational trophoblastic malignancies and robotic surgery.',
    courses: [
      'fellowship-in-gynecologic-oncology',
      'fellowship-in-oncogynecology',
      'fellowship-in-robotic-gynaecological-oncology',
    ],
    // Awareness ribbon
    icon: 'M12 3a4 4 0 00-3 6.6L5 20l3 1 4-8 4 8 3-1-4-10.4A4 4 0 0012 3z',
  },
  {
    title: 'Hemato & Pediatric Oncology',
    line: 'Blood disorders and cancers, and the diagnosis, evaluation and management of cancers in infants, children and adolescents.',
    courses: ['fellowship-in-hemato-oncology', 'fellowship-in-pediatric-oncology'],
    // Blood drop
    icon: 'M12 3s6.5 6.6 6.5 11a6.5 6.5 0 01-13 0C5.5 9.6 12 3 12 3z',
  },
  {
    title: 'Neuro-Oncology',
    line: 'Brain and spinal cord tumours, and the long-term care of children and adolescents with CNS tumours.',
    // TODO: neurology overlap. Both match the neurology site's filter; decide where they belong.
    courses: ['fellowship-in-neuro-oncology', 'fellowship-in-pediatric-neuro-oncology'],
    // Brain: two lobes
    icon: 'M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 1V5a2 2 0 00-3-1z M15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 1',
  },
  {
    title: 'Head & Neck, Thoracic & GI Oncology',
    line: 'Oral, laryngeal and thyroid cancers, lung cancer and mesothelioma, and cancers of the esophagus, stomach, liver and pancreas.',
    courses: [
      // TODO: surgery overlap. This one is also shown on the surgery site; decide where it belongs.
      'fellowship-in-head-and-neck-oncosurgery',
      'fellowship-in-oral-oncology',
      'certificate-in-dental-oncology',
      'fellowship-in-thoracic-oncology',
      'certificate-in-thoracic-oncology',
      'fellowship-in-gastrointestinal-oncology',
    ],
    // Target: rings and crosshair
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 16a4 4 0 100-8 4 4 0 000 8z M12 1v4 M12 19v4 M1 12h4 M19 12h4',
  },
]

// TODO: confirm "Clinical Mentorship" is part of the oncology programs (company-level label kept as is).
const learningModes = [
  {
    label: 'Live Online Classes',
    icon: 'M3 5h18v11H3z M8 20h8 M12 16v4 M10 8.5v4l3.5-2-3.5-2z',
    tint: 'bg-lilac-100',
    disc: 'bg-fern-900 text-cream-50',
  },
  {
    label: 'Self-Paced Learning',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2',
    tint: 'bg-coral-100',
    disc: 'bg-coral-500 text-fern-950',
  },
  {
    label: 'Clinical Mentorship',
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
    tint: 'bg-fern-100',
    disc: 'bg-fern-700 text-cream-50',
  },
]

// Eligibility groups, same degree lists as the Neurology site.
// TODO: confirm these apply to every oncology program, or link to per-course eligibility.
const eligibility = [
  {
    group: 'NMC',
    degrees: ['MBBS', 'MD', 'MS', 'DGO', 'DCH', 'DNB', 'DM', 'MCh'],
    // Stethoscope (same icon as the "Practicing Physicians" stat)
    icon: 'M6 3v6a4 4 0 008 0V3 M10 13v3a5 5 0 0010 0v-2 M20 14a2 2 0 100-4 2 2 0 000 4z',
    tint: 'bg-lilac-100',
    disc: 'bg-fern-900 text-cream-50',
  },
  {
    group: 'AYUSH',
    degrees: ['BAMS', 'BHMS', 'BUMS'],
    // Leaf
    icon: 'M11 20A7 7 0 014 13c0-5 4-9 16-10-1 12-5 16-10 16z M4 21c4-4 7-7 11-11',
    tint: 'bg-coral-100',
    disc: 'bg-coral-500 text-fern-950',
  },
  {
    group: 'Dental',
    degrees: ['BDS', 'MDS'],
    // Tooth
    icon: 'M12 5.5C10.5 4 8.5 3 6.5 3.5 4 4.2 3.5 7 4 9.5c.5 2.6 1.5 4.5 2 7 .4 2 1 4 2.3 4 1.6 0 1.7-3.5 2.2-5 .3-1 .7-1.5 1.5-1.5s1.2.5 1.5 1.5c.5 1.5.6 5 2.2 5 1.3 0 1.9-2 2.3-4 .5-2.5 1.5-4.4 2-7 .5-2.5 0-5.3-2.5-6-2-.5-4 .5-5.5 2z',
    tint: 'bg-fern-100',
    disc: 'bg-fern-700 text-cream-50',
  },
]

const sealLooks = [
  'bg-fern-900 text-cream-50 -rotate-6',
  'bg-coral-500 text-fern-950 rotate-3',
  'bg-white text-fern-900 -rotate-3',
]

// Double helix on a 1200x80 grid: two opposite waves joined by rungs. Built once at load.
const helixY = (x, flip) => (40 + 26 * flip * Math.sin((x / 200) * Math.PI * 2)).toFixed(1)
const helixPoints = Array.from({ length: 121 }, (_, index) => index * 10)
const helixStrand = (flip) =>
  helixPoints.map((x, index) => `${index === 0 ? 'M' : 'L'}${x} ${helixY(x, flip)}`).join(' ')
const helixRungs = helixPoints
  .filter((x) => x % 20 === 0)
  .map((x) => `M${x} ${helixY(x, 1)} L${x} ${helixY(x, -1)}`)
  .join(' ')

// slice keeps the helix undistorted; narrow screens show the middle part
function HelixRibbon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMid slice"
      className="h-16 w-full md:h-20"
      fill="none"
      strokeLinecap="round"
    >
      <path d={helixRungs} className="stroke-fern-300" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d={helixStrand(-1)} className="stroke-fern-600" strokeWidth="2.5" />
      <path d={helixStrand(1)} className="stroke-coral-500" strokeWidth="2.5" />
    </svg>
  )
}

function StoryIntro() {
  return (
    <section className="overflow-hidden rounded-b-[3rem] bg-fern-50 pt-16 md:rounded-b-[5rem] md:pt-24">
      <div className="fern-frame">
        <div className="text-center">
          <div className="motion-safe:animate-wipe-in">
            <Kicker>About Us</Kicker>
          </div>
          <h1 className="mx-auto mt-4 text-[clamp(2.75rem,6.4vw,5rem)] font-medium leading-[1.08] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
            <span className="block">About Medical</span>
            <Accent>Global Academy</Accent>
          </h1>
          <p className="mt-5 font-headline text-lg italic text-bark-600 motion-safe:animate-wipe-in motion-safe:[animation-delay:240ms] md:text-xl">
            Trusted · Accredited · Career focused
          </p>
        </div>

        {/* TODO: verify the "200 doctors" and "150 programs" figures in this story (same as the stats). */}
        {/* The first paragraph is the lead; the other three sit in cards so the story doesn't read as one wall of text. */}
        <Unveil className="mx-auto mt-10 max-w-5xl md:mt-14">
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-fern-950 md:text-xl">
            Medical Global Academy is a leading platform for medical education in India, trusted by more than 200
            doctors and recognized for its commitment to excellence in healthcare training. Our courses are{' '}
            <strong className="font-bold text-fern-900">CPD &amp; ACTD accredited</strong>, ensuring high standards and
            credibility.
          </p>
          <div className="mt-10 grid gap-4 text-base leading-relaxed text-bark-600 lg:grid-cols-2 lg:[&>p:first-child]:row-span-2 [&>p]:rounded-[2rem] [&>p]:bg-white [&>p]:p-6 md:[&>p]:p-7">
            <p>
              We offer a diverse range of programs, including{' '}
              <strong className="font-bold text-fern-900">PG Diplomas</strong>,{' '}
              <strong className="font-bold text-fern-900">Fellowships</strong>, and{' '}
              <strong className="font-bold text-fern-900">Certificates</strong>, designed to meet the professional
              development needs of healthcare practitioners. Our extensive course catalog spans over 150 programs
              covering specialties such as Surgery, Neurology, Cardiology, Medicine, Oncology, Nephrology, Orthopedics,
              Obstetrics &amp; Gynecology, and many more. Whether you are seeking to enhance your expertise in a
              specific field or broaden your medical knowledge, Medical Global Academy has a course tailored to your
              goals.
            </p>
            <p>
              Understanding the demanding schedules of medical professionals, we provide{' '}
              <strong className="font-bold text-fern-900">flexible learning</strong> options with both attending and
              non-attending classes. This ensures that you can pursue your education at your convenience without
              compromising on quality.
            </p>
            <p>
              At Medical Global Academy, we are committed to empowering healthcare professionals with the knowledge and
              skills needed to excel in their careers and contribute to improved patient outcomes. Join us to advance
              your medical journey with courses designed to inspire growth, innovation, and excellence in healthcare.
            </p>
          </div>
        </Unveil>

        <div className="mx-auto mt-16 max-w-5xl md:mt-20">
          <h2 className="text-center font-headline text-xl font-normal italic text-coral-700">What we offer</h2>
          <ul className="mt-6 grid gap-4 lg:grid-cols-3">
            {offerings.map((item, index) => (
              <li key={item.title}>
                <Unveil effect="scale" delay={index * 90} className="h-full">
                  <Link
                    to="/courses"
                    className="group/offer flex h-full items-center gap-4 rounded-[2rem] bg-white py-4 pl-4 pr-6 shadow-card transition-colors duration-300 hover:bg-fern-900"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-coral-500 text-fern-950">
                      <Icon path={item.icon} className="size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-headline text-xl font-medium text-fern-950 transition-colors duration-300 group-hover/offer:text-cream-50">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-bark-600 transition-colors duration-300 group-hover/offer:text-fern-100">
                        {item.line}
                      </span>
                    </span>
                  </Link>
                </Unveil>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <PillLink to="/courses">Explore Courses</PillLink>
          </div>
        </div>
      </div>

      <div className="mt-14 pb-12 md:mt-20 md:pb-16">
        <HelixRibbon />
        <div className="mt-8">
          <LoopStrip
            label="Specialties"
            items={specialties}
            renderChip={(name) => (
              <span className="inline-block whitespace-nowrap rounded-full bg-white px-6 py-3 font-headline text-lg font-medium text-fern-900 transition-colors duration-300 hover:bg-coral-500 hover:text-fern-950">
                {name}
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

function BigNumbers() {
  return (
    <section aria-label="Academy in numbers" className="py-16 md:py-24">
      <div className="fern-frame">
        <Unveil effect="scale">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center border-fern-900/20 px-2 py-8 text-center lg:py-2 ${
                  index % 2 === 0 ? 'border-r' : ''
                } ${index === 1 ? 'lg:border-r' : ''} ${index < 2 ? 'border-b lg:border-b-0' : ''} ${
                  index === 2 ? 'lg:border-r' : ''
                }`}
              >
                <dd className="font-headline text-5xl font-medium leading-none text-fern-900 sm:text-7xl xl:text-8xl">
                  {stat.value}
                </dd>
                <dt className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-bark-600 md:text-base">
                  <Icon path={stat.icon} className="hidden size-5 shrink-0 text-coral-700 sm:block" />
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Unveil>
      </div>
    </section>
  )
}

function WhoWeAre() {
  return (
    <section aria-labelledby="who-heading" className="pb-20 md:pb-32">
      <div className="fern-frame grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Unveil effect="left">
          <SectionTitle id="who-heading" kicker="Who We Are">
            Advancing Oncology Education for <Accent>Modern Healthcare</Accent>
          </SectionTitle>
          {/* TODO: confirm the oncology wording and the faculty claim ("experienced specialists") with the academic team. */}
          <p className="mt-7 text-lg leading-relaxed text-bark-600">
            Medical Global Academy was founded on a commitment to clinical excellence. Our oncology programs are shaped
            around what doctors meet in practice, from clinical and surgical oncology to hemato-oncology, gynecologic
            oncology and neuro-oncology, with teaching from experienced specialists.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-bark-600">
            We aim to bridge the gap between general medical training and oncology specialisation, giving doctors a
            structured, case-based path to deepen their understanding of cancer biology, tumour staging and
            multidisciplinary cancer care, through fellowships such as Oncology, Surgical Oncology and Hemato-Oncology.
          </p>
        </Unveil>

        <Unveil effect="right" className="relative isolate">
          <div
            aria-hidden="true"
            className="absolute -right-6 -top-8 -z-10 size-56 rounded-[58%_42%_47%_53%/46%_56%_44%_54%] bg-coral-300 motion-safe:animate-morph sm:size-72"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-4 -z-10 size-40 rounded-[47%_53%_58%_42%/56%_44%_54%_46%] bg-fern-100 motion-safe:animate-morph sm:size-52"
          />
          <div className="rounded-[2.5rem] bg-lilac-100 p-7 pb-24 sm:p-10 sm:pb-28">
            <h3 className="text-3xl font-medium text-fern-950 md:text-4xl">Credibility &amp; Recognition</h3>
            <p className="mt-4 text-lg leading-relaxed text-bark-600">
              Our programs carry CPD and ACTD accreditation, so the qualifications you earn are recognised and support
              your continuing professional development wherever you practise.
            </p>
          </div>
          <ul className="-mt-16 flex justify-center gap-1.5 sm:-mt-20 sm:gap-4">
            {recognitions.map((label, index) => (
              <li
                key={label}
                className={`relative grid size-[5.5rem] place-items-center rounded-full p-2 text-center min-[360px]:size-26 shadow-paper transition-[rotate] duration-300 hover:rotate-0 motion-reduce:transition-none sm:size-36 ${sealLooks[index]}`}
              >
                <span aria-hidden="true" className="absolute inset-1 rounded-full border border-dashed border-current opacity-60 sm:inset-2" />
                <span className="flex flex-col items-center gap-0.5 font-headline text-[11px] font-semibold leading-tight min-[360px]:text-xs sm:gap-1 sm:text-base">
                  <Icon path="M5 12.5l4.5 4.5L19 7.5" className="size-4 sm:size-5" strokeWidth={2.6} />
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </Unveil>
      </div>
    </section>
  )
}

// Follows the WAI tabs pattern: arrow keys, Home and End move between the steps. Every panel stays
// in the DOM, so all four steps can be read by search engines and in-page find.
function ApproachTabs() {
  const baseId = useId()
  const [active, setActive] = useState(0)

  const onTabKey = (event) => {
    const last = approach.length - 1
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    event.currentTarget.parentElement.children[next].focus()
  }

  return (
    <div className="mt-12">
      <div role="tablist" aria-label="Our teaching approach" className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
        {approach.map((step, index) => {
          const selected = index === active

          return (
            <button
              key={step.title}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onTabKey}
              className={`rounded-[1.75rem] border-2 border-fern-900 px-4 py-3.5 text-left text-sm font-bold transition-colors duration-300 sm:text-base lg:rounded-full lg:px-6 lg:text-center ${
                selected ? 'bg-fern-900 text-cream-50' : 'text-fern-900 hover:bg-fern-100'
              }`}
            >
              {step.title}
            </button>
          )
        })}
      </div>

      {approach.map((step, index) => (
        <div
          key={step.title}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          tabIndex={0}
          hidden={index !== active}
          className="mt-4"
        >
          <div className="grid items-center gap-8 rounded-[2.5rem] bg-coral-100 p-8 motion-safe:animate-quote-in md:grid-cols-[auto_1fr] md:gap-14 md:p-14">
            <span className="grid size-24 place-items-center rounded-full bg-coral-500 text-fern-950 md:size-40">
              <Icon path={step.icon} className="size-11 md:size-20" strokeWidth={1.4} />
            </span>
            <div>
              <p className="font-headline text-lg italic text-coral-700">
                Step {index + 1} of {approach.length}
              </p>
              <h3 className="mt-2 text-3xl font-medium text-fern-950 md:text-5xl">{step.title}</h3>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bark-600 md:text-xl">{step.line}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SpecializationAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <ul className="border-b-2 border-fern-900">
      {specializations.map((item, index) => {
        const open = index === openIndex
        const panelId = `${baseId}-area-${index}`

        return (
          <li key={item.title} className="border-t-2 border-fern-900">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="group/row flex w-full items-center gap-4 py-5 text-left md:gap-5"
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                    open ? 'bg-coral-500 text-fern-950' : 'bg-fern-100 text-fern-900 group-hover/row:bg-coral-100'
                  }`}
                >
                  <Icon path={item.icon} className="size-6" />
                </span>
                <span className="flex-1 font-headline text-xl font-medium text-fern-950 md:text-3xl">{item.title}</span>
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center text-fern-900 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-45' : ''}`}
                >
                  <Icon path="M12 5v14 M5 12h14" className="size-5" strokeWidth={2.4} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none ${
                open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-7 pl-16 pr-9 text-lg leading-relaxed text-bark-600 md:pl-[4.25rem]">{item.line}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function About() {
  return (
    <>
      <Seo
        title="About Medical Global Academy | MGA India"
        description="Learn about Medical Global Academy, its focus on medical education for doctors after MBBS, and the mission behind its oncology programs."
      />

      <StoryIntro />
      <StatsCounter />
      <BigNumbers />
      <WhoWeAre />
      <ValuesSection />

      <section aria-labelledby="approach-heading" className="py-20 md:py-28">
        <div className="fern-frame">
          <Unveil effect="left">
            <SectionTitle id="approach-heading" kicker="Our Teaching Approach">
              How Our <Accent>Programs Work</Accent>
            </SectionTitle>
          </Unveil>
          <ApproachTabs />
        </div>
      </section>

      <section aria-labelledby="areas-heading" className="pb-20 md:pb-28">
        <div className="fern-frame grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle id="areas-heading" kicker="Programs">
              High-Demand <Accent>Oncology Specializations</Accent>
            </SectionTitle>
            <div className="mt-8">
              <PillLink to="/courses" variant="pill-line">
                Browse all oncology courses
              </PillLink>
            </div>
          </div>
          <SpecializationAccordion />
        </div>
      </section>

      {/* Same tinted 3-card pattern as "Designed for Working Medical Professionals", with chips per card */}
      <section aria-labelledby="eligibility-heading" className="pb-20 md:pb-28">
        <div className="fern-frame">
          <Unveil effect="left">
            <SectionTitle id="eligibility-heading" kicker="Eligibility">
              Who Can <Accent>Enroll</Accent>
            </SectionTitle>
          </Unveil>

          <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {eligibility.map((item, index) => (
              <li key={item.group}>
                <Unveil effect="scale" delay={index * 90} className="h-full">
                  <div
                    className={`group/elig flex h-full flex-col rounded-[2.5rem] p-8 transition-shadow duration-300 hover:shadow-stamp lg:p-10 ${item.tint}`}
                  >
                    <span
                      className={`grid size-14 place-items-center rounded-full transition-transform duration-500 group-hover/elig:rotate-[18deg] motion-reduce:transition-none ${item.disc}`}
                    >
                      <Icon path={item.icon} className="size-6" />
                    </span>
                    <h3 className="mt-6 text-3xl font-medium text-fern-950">{item.group}</h3>
                    <ul aria-label={`${item.group} degrees`} className="mt-5 flex flex-wrap gap-2">
                      {item.degrees.map((degree) => (
                        <li
                          key={degree}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-fern-900"
                        >
                          <Icon path="M5 12.5l4.5 4.5L19 7.5" className="size-3.5 text-coral-700" strokeWidth={2.6} />
                          {degree}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Unveil>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-bark-600">
            Eligibility can vary by program. Check the course page for its specific requirements.
          </p>
        </div>
      </section>

      <section aria-labelledby="flexible-heading" className="pb-20 md:pb-28">
        <div className="fern-frame">
          <Unveil className="max-w-4xl">
            <h2 id="flexible-heading" className="text-4xl font-medium leading-[1.08] text-fern-950 md:text-6xl">
              Designed for <Accent>Working Medical Professionals</Accent>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bark-600">
              We know doctors don&apos;t have time to step away from practice. Our programs combine live sessions,
              recorded lectures and mentorship so you can build oncology knowledge on a schedule that works around your
              shifts.
            </p>
          </Unveil>

          <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-5">
            {learningModes.map((mode, index) => (
              <li key={mode.label}>
                <Unveil effect="scale" delay={index * 90} className="h-full">
                  <div
                    className={`group/mode flex h-full flex-col justify-between gap-16 rounded-[2.5rem] p-8 transition-shadow duration-300 hover:shadow-stamp md:min-h-[22rem] lg:p-10 ${mode.tint}`}
                  >
                    <span
                      className={`grid size-20 place-items-center rounded-full transition-transform duration-500 group-hover/mode:rotate-[18deg] motion-reduce:transition-none lg:size-24 ${mode.disc}`}
                    >
                      <Icon path={mode.icon} className="size-9 lg:size-11" strokeWidth={1.5} />
                    </span>
                    <h3 className="text-3xl font-medium leading-tight text-fern-950 lg:text-4xl">{mode.label}</h3>
                  </div>
                </Unveil>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="mission-heading" className="pb-20 md:pb-28">
        <div className="fern-frame">
          <Unveil effect="scale">
            <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-linear-to-tr from-fern-950 via-fern-800 to-fern-600 px-6 py-16 text-center text-cream-50 md:rounded-[4rem] md:px-16 md:py-24">
              <div aria-hidden="true" className="absolute -bottom-24 -right-16 -z-10 size-72 rounded-full bg-coral-500/80" />
              <div aria-hidden="true" className="absolute -left-20 -top-24 -z-10 size-72 rounded-full border-[3rem] border-lilac-300/25" />
              <Kicker tone="text-coral-300">Our Mission</Kicker>
              <h2 id="mission-heading" className="mx-auto mt-4 max-w-4xl text-4xl font-medium leading-[1.08] md:text-7xl">
                Empowering <Accent tone="text-coral-300">Oncology Excellence</Accent>
              </h2>
              {/* TODO: confirm the oncology mission wording with the academic team. */}
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream-50">
                Our mission is to equip healthcare professionals with the oncology knowledge, clinical judgement and
                confidence they need to deliver better care for every patient they treat.
              </p>
              <div className="mt-10">
                <PillLink to="/courses">Enroll Today</PillLink>
              </div>
            </div>
          </Unveil>
        </div>
      </section>
    </>
  )
}
