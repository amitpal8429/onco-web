import { ArrowUpRight } from 'lucide-react'

export const COURSES_URL = 'https://medicalglobalacademy.com/courses'

// Outline button in the footer's coral accent, linking to the main MGA course catalogue
export default function CoursesButton({ className = '' }) {
  return (
    <a
      href={COURSES_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-coral-300/50 px-3.5 py-1.5 text-sm font-semibold text-cream-50 transition-[color,border-color,box-shadow] duration-200 hover:border-coral-300 hover:text-coral-300 hover:shadow-[0_0_16px_rgb(232_95_64/0.35)] motion-reduce:transition-none ${className}`}
    >
      MGA All Courses
      <ArrowUpRight
        size={16}
        strokeWidth={2.5}
        aria-hidden="true"
        className="shrink-0 text-coral-300 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  )
}
