import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../data/site.js'
import { Accent, Kicker, PillLink, Unveil } from './FernKit.jsx'
import Icon from './Icon.jsx'
import Seo from './Seo.jsx'

const mailHref = `mailto:${site.contact.email}`
const [emailName, emailDomain] = site.contact.email.split('@')

// The support email as a link, for use inside policy text. Breaks after the @ (not mid-word) on
// narrow screens.
export function SupportEmail() {
  return (
    <a href={mailHref}>
      {emailName}@<wbr />
      {emailDomain}
    </a>
  )
}

// Follows which section is being read, for the highlight in the side list.
function useActiveSection(sections) {
  const [activeId, setActiveId] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) {
          setActiveId(visible.target.id)
        } else if (document.getElementById(sections[0].id).getBoundingClientRect().top > window.innerHeight * 0.2) {
          // Back above the first section, so no section is in the reading band.
          setActiveId(sections[0].id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const section of sections) observer.observe(document.getElementById(section.id))
    return () => observer.disconnect()
  }, [sections])

  return activeId
}

function SectionLinks({ sections, activeId, onPick }) {
  return (
    <ol className="grid gap-0.5">
      {sections.map((section, index) => {
        const active = section.id === activeId

        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={onPick}
              aria-current={active ? 'location' : undefined}
              className={`flex gap-2 rounded-[1.25rem] px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                active ? 'bg-fern-900 text-cream-50' : 'text-fern-900 hover:bg-fern-100'
              }`}
            >
              <span className="shrink-0 tabular-nums">{index + 1}.</span>
              {section.title}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

// Shared page for the legal documents. `sections` is [{ id, title, content }]; each id is also the
// link target in the "On this page" list. The heading reads `titleLead` then `titleAccent` in
// italics, and the closing card does the same with `ctaLead` and `ctaAccent`.
export default function LegalPage({ seoTitle, seoDescription, titleLead, titleAccent, updated, intro, sections, ctaLead, ctaAccent }) {
  const { hash } = useLocation()
  const activeId = useActiveSection(sections)
  const [listOpen, setListOpen] = useState(false)

  // A link straight to a section (/terms#eligibility) opens at that section.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} />

      <section className="relative overflow-hidden rounded-b-[3rem] bg-cream-200 py-16 md:rounded-b-[5rem] md:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 hidden size-56 rounded-[58%_42%_47%_53%/46%_56%_44%_54%] bg-lilac-300/70 motion-safe:animate-morph lg:block"
        />
        <div className="fern-frame relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <div className="motion-safe:animate-wipe-in">
              <Kicker>Legal</Kicker>
            </div>
            <h1 className="mt-4 text-[clamp(2.75rem,6.4vw,5rem)] font-medium leading-[1.04] text-fern-950 motion-safe:animate-wipe-in motion-safe:[animation-delay:120ms]">
              {titleLead} <Accent>{titleAccent}</Accent>
            </h1>
          </div>
          <div className="motion-safe:animate-wipe-in motion-safe:[animation-delay:240ms]">
            {intro && <p className="mb-5 leading-relaxed text-bark-600">{intro}</p>}
            <ul className="flex flex-wrap gap-2">
              <li className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-fern-900">
                <Icon path="M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4" className="size-4" />
                Last updated: {updated}
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-fern-900">
                <Icon path="M9 6h11 M9 12h11 M9 18h11 M4 6h.01 M4 12h.01 M4 18h.01" className="size-4" />
                {sections.length} sections
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="fern-frame grid gap-8 py-14 md:py-20 lg:grid-cols-[19rem_1fr] lg:gap-14">
        <nav aria-label="On this page" className="min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto">
          <div className="hidden rounded-[2rem] bg-cream-100 p-3 lg:block">
            <p className="px-4 pb-2 pt-1 font-headline text-lg italic text-coral-700">On this page</p>
            <SectionLinks sections={sections} activeId={activeId} />
          </div>
          <details
            open={listOpen}
            onToggle={(event) => setListOpen(event.currentTarget.open)}
            className="group/list rounded-[2rem] bg-cream-100 p-3 lg:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-full px-4 py-2 font-headline text-lg italic text-coral-700 [&::-webkit-details-marker]:hidden">
              On this page
              <Icon
                path="M12 5v14 M5 12h14"
                className="size-5 text-fern-900 transition-transform duration-300 group-open/list:rotate-45 motion-reduce:transition-none"
                strokeWidth={2.4}
              />
            </summary>
            <div className="mt-2">
              <SectionLinks sections={sections} activeId={activeId} onPick={() => setListOpen(false)} />
            </div>
          </details>
        </nav>

        <article className="min-w-0 max-w-3xl space-y-4">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="policy-copy scroll-mt-28 rounded-[2rem] bg-white p-6 sm:p-9"
            >
              <h2 id={`${section.id}-heading`} className="text-2xl font-medium text-fern-950 md:text-3xl">
                <span className="text-coral-700">{index + 1}.</span> {section.title}
              </h2>
              {section.content}
            </section>
          ))}
        </article>
      </div>

      <section aria-labelledby="legal-cta-heading" className="pb-20 md:pb-28">
        <div className="fern-frame">
          <Unveil effect="scale">
            <div className="relative isolate flex flex-col items-start gap-8 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-fern-950 via-fern-800 to-fern-600 px-6 py-14 text-cream-50 md:rounded-[4rem] md:px-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
              <div aria-hidden="true" className="absolute -right-16 -top-36 -z-10 size-64 rounded-full bg-coral-500/80" />
              <div aria-hidden="true" className="absolute -bottom-36 -left-20 -z-10 size-64 rounded-full border-[3rem] border-lilac-300/25" />
              <h2 id="legal-cta-heading" className="max-w-2xl text-4xl font-medium leading-[1.08] md:text-6xl">
                {ctaLead} <Accent tone="text-coral-300">{ctaAccent}</Accent>
              </h2>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0 lg:flex-col">
                <a href={mailHref} className="pill-coral">
                  Email Us
                </a>
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
