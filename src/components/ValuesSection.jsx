import { Accent, SectionTitle, Unveil } from './FernKit.jsx'
import Icon from './Icon.jsx'

// "Our Values" list on the About page.
// TODO: these four values and their wording are a generic starting point.
// Replace them with the academy's own approved values text.

// icon = SVG path(s) drawn on a 24x24 grid (stroke icons)
const values = [
  {
    title: 'Excellence',
    description: 'High academic standards in every program, from the curriculum to how it is taught.',
    icon: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3z',
  },
  {
    title: 'Integrity',
    description: 'Clear, honest information about courses, eligibility and what to expect.',
    icon: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4',
  },
  {
    title: 'Innovation',
    description: 'Modern, flexible ways of learning that fit around clinical work.',
    icon: 'M9 18h6 M10 21h4 M12 3a6 6 0 00-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0012 3z',
  },
  {
    title: 'Accessibility',
    description: 'Online access so doctors can keep learning wherever they practise.',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a14 14 0 010 18 M12 3a14 14 0 000 18',
  },
]

export default function ValuesSection() {
  return (
    <section aria-labelledby="values-heading" className="rounded-[3rem] bg-cream-100 py-20 md:rounded-[5rem] md:py-28">
      <div className="fern-frame">
        <Unveil effect="left">
          <SectionTitle id="values-heading" kicker="Our Values">
            What We <Accent>Stand For</Accent>
          </SectionTitle>
        </Unveil>

        <ul className="mt-12 border-b-2 border-fern-900 md:mt-16">
          {values.map((value, index) => (
            <li key={value.title} className="border-t-2 border-fern-900">
              <Unveil effect={index % 2 === 0 ? 'left' : 'right'}>
                <div className="group/value grid items-center gap-x-8 gap-y-3 py-7 transition-colors duration-300 hover:bg-lilac-100 sm:px-4 md:grid-cols-[3.5rem_1fr_1.3fr] md:py-9 lg:px-8">
                  <span className="grid size-12 place-items-center rounded-full bg-fern-900 text-cream-50 transition-transform duration-500 group-hover/value:rotate-[18deg] motion-reduce:transition-none md:size-14">
                    <Icon path={value.icon} className="size-6" />
                  </span>
                  <h3 className="text-3xl font-medium text-fern-950 transition-colors duration-300 group-hover/value:text-coral-700 md:text-5xl">
                    {value.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-bark-600">{value.description}</p>
                </div>
              </Unveil>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
