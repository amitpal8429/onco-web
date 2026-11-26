import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FaqSection from '../components/FaqSection.jsx'
import Field from '../components/Field.jsx'
import { Accent, Kicker, PillLink, SectionTitle, Unveil } from '../components/FernKit.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { typeLabel, useOncologyCourses } from '../data/oncologyCourseApi.js'
import { oncologyFaqs } from '../data/oncologyFaqs.js'
import { courseTypeLinks, site, socialLinks } from '../data/site.js'

const EMPTY_FORM = { name: '', email: '', phone: '', message: '' }

const counsellorHref = `tel:${site.counsellorPhone.replace(/\s/g, '')}`
const [emailName, emailDomain] = site.contact.email.split('@')
const phonePath =
  'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z'

const contactOptions = [
  {
    title: 'Talk to Counsellor',
    line: 'For guidance on choosing a course.',
    value: site.counsellorPhone,
    href: counsellorHref,
    icon: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74',
    look: 'bg-lilac-100',
    disc: 'bg-fern-900 text-cream-50',
  },
  {
    title: 'Phone',
    line: 'For questions about the academy.',
    value: site.contact.phone,
    href: `tel:${site.contact.phone.replace(/\s/g, '')}`,
    icon: phonePath,
    look: 'bg-coral-100',
    disc: 'bg-coral-500 text-fern-950',
  },
  {
    title: 'Email',
    line: 'Write to our support team.',
    // Break after the @ (not mid-word) when the card is narrow
    value: (
      <>
        {emailName}@<wbr />
        {emailDomain}
      </>
    ),
    href: `mailto:${site.contact.email}`,
    icon: 'M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z M3 7l9 6 9-6',
    look: 'bg-cream-200',
    disc: 'bg-fern-700 text-cream-50',
  },
]

// Restates the page intro and the FAQ answers; no new claims.
const enquiryTopics = [
  {
    title: 'A course',
    line: 'Ask about the duration, fees or curriculum of a course you are considering.',
    icon: 'M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z',
  },
  {
    title: 'Eligibility',
    line: 'Eligibility can differ between courses, so ask us to confirm it for yours.',
    icon: 'M9 4h6v3H9z M7 5H5v15h14V5h-2 M9 12l2 2 4-4',
  },
  {
    title: 'How to enroll',
    line: 'Ask about the steps to enroll, and the online and clinical training parts.',
    icon: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.2 13.9L7 22l5-3 5 3-1.2-8.1',
  },
]

// The numbers come from the accreditation certificates on the Home page. Keep them in sync if a
// certificate is renewed.
const accreditationNumbers = [
  { label: 'CPD provider no.', value: 'PDCD1106' },
  { label: 'ACTD accreditation no.', value: 'GNA452N' },
]

function validate(values) {
  const errors = {}
  const phoneDigits = values.phone.replace(/\D/g, '')

  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!/^\+?[\d\s-]+$/.test(values.phone.trim()) || phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = 'Please enter a valid phone number with 10 to 15 digits.'
  }
  if (values.message.trim().length < 10) errors.message = 'Please write at least 10 characters.'

  return errors
}

// TODO: Replace this mock with a real API call or form service. Nothing is sent or stored yet.
async function mockSubmitEnquiry(values) {
  console.info('Mock enquiry submit:', values)
}

function ContactOptions() {
  return (
    <section aria-labelledby="details-heading" className="pt-14 md:pt-20">
      <div className="fern-frame">
        <h2 id="details-heading" className="sr-only">
          Contact details
        </h2>
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {contactOptions.map((option, index) => (
            <li key={option.title} className="min-w-0">
              <Unveil effect="scale" delay={index * 90} className="h-full">
                <a
                  href={option.href}
                  className={`group/option flex h-full flex-col rounded-[2.5rem] p-7 transition-shadow duration-300 hover:shadow-stamp lg:p-9 ${option.look}`}
                >
                  <span
                    className={`grid size-14 place-items-center rounded-full transition-transform duration-500 group-hover/option:rotate-[18deg] motion-reduce:transition-none ${option.disc}`}
                  >
                    <Icon path={option.icon} className="size-6" />
                  </span>
                  <span className="mt-8 font-headline text-2xl font-medium text-fern-950">{option.title}</span>
                  <span className="mt-1 leading-relaxed text-bark-600">{option.line}</span>
                  <span className="mt-4 font-bold text-fern-900 underline decoration-coral-500 [overflow-wrap:anywhere] decoration-2 underline-offset-4">
                    {option.value}
                  </span>
                </a>
              </Unveil>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HelpColumn({ courses }) {
  const countByLabel = useMemo(() => {
    const counts = {}
    for (const course of courses) {
      const label = typeLabel(course.type)
      counts[label] = (counts[label] || 0) + 1
    }
    return counts
  }, [courses])

  return (
    <aside aria-label="More ways we can help" className="space-y-4">
      <Unveil effect="right">
        <div className="rounded-[2.5rem] bg-fern-100 p-7">
          <h2 className="text-2xl font-medium text-fern-950">What you can ask us</h2>
          <ul className="mt-5 space-y-5">
            {enquiryTopics.map((topic) => (
              <li key={topic.title} className="flex gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-fern-900">
                  <Icon path={topic.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-medium text-fern-950">{topic.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-bark-600">{topic.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Unveil>

      <Unveil effect="right" delay={90}>
        <div className="rounded-[2.5rem] bg-cream-100 p-7">
          <h2 className="text-2xl font-medium text-fern-950">Browse by course type</h2>
          <ul className="mt-4 space-y-1.5">
            {courseTypeLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-full bg-white px-5 text-sm font-bold text-fern-900 transition-colors duration-300 hover:bg-fern-900 hover:text-cream-50"
                >
                  {link.label}
                  {countByLabel[link.label] > 0 && (
                    <span className="text-xs font-medium">
                      {countByLabel[link.label]} {countByLabel[link.label] === 1 ? 'course' : 'courses'}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Unveil>

      <Unveil effect="right" delay={180}>
        <div className="rounded-[2.5rem] bg-lilac-100 p-7">
          <h2 className="text-2xl font-medium text-fern-950">Accredited &amp; connected</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {accreditationNumbers.map((item) => (
              <div key={item.value} className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-bark-600">{item.label}</dt>
                <dd className="font-bold text-fern-950">{item.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${social.label}`}
                  className="grid size-11 place-items-center rounded-full bg-white text-fern-900 transition-colors duration-300 hover:bg-fern-900 hover:text-cream-50"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true" className="size-4">
                    <path d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Unveil>
    </aside>
  )
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const { courses } = useOncologyCourses()
  const course = courses.find((item) => item.slug === searchParams.get('course'))

  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  // Courses load after the first render, so the message is filled in once the course is known.
  const [prefilled, setPrefilled] = useState(false)
  if (course && !prefilled) {
    setPrefilled(true)
    setValues((current) =>
      current.message ? current : { ...current, message: `I would like to know more about the ${course.title}.` },
    )
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setStatus('idle')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validate(values)
    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      form.elements[firstInvalid].focus()
      return
    }

    setStatus('submitting')
    await mockSubmitEnquiry(values)
    setValues(EMPTY_FORM)
    setStatus('submitted')
  }

  return (
    <>
      <Seo
        title=" Oncology MGA"
        description="Send an enquiry to Medical Global Academy about oncology fellowships and courses for doctors after MBBS. Share your details and your question."
      />

      <section className="relative overflow-hidden rounded-b-[3rem] bg-fern-100 py-16 md:rounded-b-[5rem] md:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 hidden size-56 rounded-[58%_42%_47%_53%/46%_56%_44%_54%] bg-fern-300/60 motion-safe:animate-morph lg:block"
        />
        <div className="fern-frame relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <div className="motion-safe:animate-wipe-in">
              <Kicker>Get in touch</Kicker>
            </div>
            <h1 className="mt-4 text-[clamp(2.75rem,6.4vw,5rem)] font-medium leading-[1.04] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
              Contact <Accent>us</Accent>
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-bark-600 motion-safe:animate-wipe-in motion-safe:[animation-delay:240ms]">
            Ask about a course, its eligibility or how to enroll.
          </p>
        </div>
      </section>

      <ContactOptions />

      <div className="fern-frame grid gap-6 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <section aria-labelledby="form-heading" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <Unveil effect="left">
            <div className="rounded-[2.5rem] border-2 border-fern-900 bg-white p-6 sm:p-10">
              <h2 id="form-heading" className="text-3xl font-medium text-fern-950 md:text-4xl">
                Enquiry form
              </h2>

              {course && (
                <p className="mt-4 rounded-[1.5rem] bg-coral-100 px-5 py-3 text-sm text-fern-950">
                  Enquiring about <strong className="font-bold">{course.title}</strong>.{' '}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="whitespace-nowrap font-bold underline decoration-coral-500 decoration-2 underline-offset-4"
                  >
                    View Details
                  </Link>
                </p>
              )}

              <form onSubmit={handleSubmit} noValidate className="fern-fields mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <Field
                  label="Message"
                  name="message"
                  as="textarea"
                  rows={5}
                  value={values.message}
                  onChange={handleChange}
                  error={errors.message}
                />
                <button type="submit" disabled={status === 'submitting'} className="pill-coral w-full disabled:opacity-60 sm:w-auto">
                  {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                </button>
                {/* TODO: Change this wording when mockSubmitEnquiry is replaced by a real submit. */}
                <p role="status" className="text-sm font-medium text-fern-700">
                  {status === 'submitted' && 'Form validated. This is a demo, so your enquiry was not sent.'}
                </p>
              </form>
            </div>
          </Unveil>
        </section>

        <HelpColumn courses={courses} />
      </div>

      <section aria-labelledby="contact-faq-heading" className="rounded-[3rem] bg-cream-100 py-20 md:rounded-[5rem] md:py-28">
        <div className="fern-frame grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle id="contact-faq-heading" kicker="Good to know">
              Frequently Asked Questions
            </SectionTitle>
          </div>
          <FaqSection faqs={oncologyFaqs} />
        </div>
      </section>

      <section aria-labelledby="contact-cta-heading" className="py-20 md:py-28">
        <div className="fern-frame">
          <Unveil effect="scale">
            <div className="relative isolate flex flex-col items-start gap-8 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-fern-950 via-fern-800 to-fern-600 px-6 py-14 text-cream-50 md:rounded-[4rem] md:px-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
              <div aria-hidden="true" className="absolute -right-16 -top-36 -z-10 size-64 rounded-full bg-coral-500/80" />
              <div aria-hidden="true" className="absolute -bottom-36 -left-20 -z-10 size-64 rounded-full border-[3rem] border-lilac-300/25" />
              <div className="max-w-2xl">
                <h2 id="contact-cta-heading" className="text-4xl font-medium leading-[1.08] md:text-6xl">
                  Ready to deepen your <Accent tone="text-coral-300">oncology knowledge?</Accent>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-cream-50">
                  Compare courses, or talk to a counsellor for guidance.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0 lg:flex-col">
                <PillLink to="/courses">Explore Courses</PillLink>
                <a href={counsellorHref} className="pill-line-light">
                  <Icon path={phonePath} className="size-4" />
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
