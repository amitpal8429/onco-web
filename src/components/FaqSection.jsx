export default function FaqSection({ faqs }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-mist-200 border-y border-mist-200">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-primary-900 [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-50 text-xl leading-none text-primary-700 transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 leading-relaxed text-ink-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}
