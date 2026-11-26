import { useState } from 'react'
import { Link } from 'react-router-dom'
import { courseTypeLinks, legalLinks, navLinks, site, socialLinks } from '../data/site.js'
import { DISCLAIMER_BODY, DISCLAIMER_LABEL } from '../constants/disclaimer.js'
import CoursesButton from './CoursesButton.jsx'
import Icon from './Icon.jsx'

// Read once at load (not during render) for the copyright line
const YEAR = new Date().getFullYear()

const linkGroups = [
  { heading: 'Explore', links: navLinks },
  { heading: 'Course types', links: courseTypeLinks },
]

const mailPath = 'M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z M3 7l9 6 9-6'
const phonePath =
  'M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z'
const peoplePath =
  'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1 M9.5 10a3 3 0 100-6 3 3 0 000 6z M21 19v-1a4 4 0 00-3-3.87 M16 4.13a3 3 0 010 5.74'
const shieldCheckPath = 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4'

const headingClass = 'font-headline text-xl font-normal italic text-coral-300'
const legalLinkClass =
  'inline-block py-1 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-cream-50 hover:decoration-coral-500'

function telHref(phone) {
  return `tel:${phone.replace(/\s/g, '')}`
}

// Layout only scrolls up when the path changes. A course type link can keep the same path, so it scrolls here.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function ContactRow({ icon, label, href, children }) {
  return (
    <li>
      <a href={href} className="group/contact flex min-w-0 items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream-50/10 text-coral-300 transition-colors duration-300 group-hover/contact:bg-coral-500 group-hover/contact:text-fern-950">
          <Icon path={icon} className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-fern-100">{label}</span>
          <span className="block font-bold text-cream-50 [overflow-wrap:anywhere] group-hover/contact:text-coral-300">
            {children}
          </span>
        </span>
      </a>
    </li>
  )
}

export default function Footer() {
  const [logoFailed, setLogoFailed] = useState(false)
  const [emailName, emailDomain] = site.contact.email.split('@')

  return (
    <footer className="relative isolate overflow-hidden rounded-t-[3rem] bg-fern-900 font-body text-fern-100 md:rounded-t-[5rem]">
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-80 rounded-full border-[3.5rem] border-fern-800" />

      {/* Stacked on mobile, 2 columns on tablet (brand and contact full width), 4 columns from 1024px */}
      <div className="fern-frame grid gap-x-8 gap-y-8 pb-8 pt-12 sm:grid-cols-2 md:pt-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-x-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            to="/"
            onClick={scrollToTop}
            aria-label={`${site.name} ${site.specialty}, Home`}
            className="inline-flex items-center gap-3 text-cream-50"
          >
            {logoFailed ? (
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full bg-coral-500 text-sm font-bold text-fern-950"
              >
                {site.shortName}
              </span>
            ) : (
              <img
                src={site.logoUrl}
                alt=""
                width="256"
                height="256"
                loading="lazy"
                onError={() => setLogoFailed(true)}
                className="h-12 w-auto object-contain"
              />
            )}
            <span>
              <span className="block font-headline text-2xl font-medium leading-tight">{site.name}</span>
              <span className="block font-headline text-base italic leading-tight text-coral-300">{site.specialty}</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm leading-relaxed">
            Oncology fellowship, PG Diploma and certificate programs that help practising doctors build their
            knowledge alongside clinical work.
          </p>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-sm font-bold text-fern-900">
            <Icon path={shieldCheckPath} className="size-4 shrink-0" strokeWidth={2} />
            CPD &amp; ACTD Accredited
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${social.label}`}
                  className="grid size-11 place-items-center rounded-full bg-cream-50/10 text-cream-50 transition-colors duration-300 hover:bg-coral-500 hover:text-fern-950"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true" className="size-4">
                    <path d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {linkGroups.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className={headingClass}>{group.heading}</h2>
            <ul className="mt-4 grid gap-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="inline-block font-medium text-cream-50 transition-[color,translate] duration-300 hover:translate-x-1 hover:text-coral-300 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {group.heading === 'Explore' && (
                <li className="pt-2">
                  <CoursesButton />
                </li>
              )}
            </ul>
          </nav>
        ))}

        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className={headingClass}>Contact us</h2>
          <ul className="mt-4 grid gap-3">
            <ContactRow icon={peoplePath} label="Talk to Counsellor" href={telHref(site.counsellorPhone)}>
              {site.counsellorPhone}
            </ContactRow>
            <ContactRow icon={phonePath} label="Phone" href={telHref(site.contact.phone)}>
              {site.contact.phone}
            </ContactRow>
            <ContactRow icon={mailPath} label="Email" href={`mailto:${site.contact.email}`}>
              {/* Break after the @ (not mid-word) when the column is narrow */}
              {emailName}@<wbr />
              {emailDomain}
            </ContactRow>
          </ul>
          <CoursesButton className="mt-5" />
        </div>
      </div>

      <div className="fern-frame border-t border-cream-50/10 py-5">
        <p role="note" className="text-xs leading-relaxed text-fern-100/80">
          <strong className="font-bold text-coral-300">{DISCLAIMER_LABEL}</strong> {DISCLAIMER_BODY}
        </p>
      </div>

      <div className="relative bg-fern-950">
        <div className="fern-frame flex flex-col items-center gap-2 py-4 text-center text-sm lg:flex-row lg:justify-between lg:text-left">
          <p>
            © {YEAR} {site.name}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-end">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} onClick={scrollToTop} className={legalLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
