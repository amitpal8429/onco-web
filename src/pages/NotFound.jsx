import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | Medical Global Academy"
        description="This page could not be found on the Medical Global Academy website. Return to the home page or browse our oncology courses."
        noindex
      />

      <section className="page-gutter py-20 md:py-28">
        <p className="font-display text-6xl font-semibold text-accent-700">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-primary-900 sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-600">
          The page you are looking for may have moved or may no longer exist.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/" className="btn-primary">
            Go to Home
          </Link>
          <Link to="/courses" className="btn-secondary">
            Browse Courses
          </Link>
        </div>
      </section>
    </>
  )
}
