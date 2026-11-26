import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DUMMY_MARKER, SHOW_DUMMY_BANNER } from '../data/site.js'
import Breadcrumbs from './Breadcrumbs.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

// Routes that use the fern brand. Add a path here as each page is redesigned.
const FERN_ROUTES = new Set(['/', '/about', '/contact', '/courses', '/doctor', '/privacy-policy', '/refund', '/sitemap', '/terms'])

export default function Layout() {
  const { pathname } = useLocation()
  const isFern = FERN_ROUTES.has(pathname)

  // A link to a section (#cookies) is left to the page, which scrolls to that section.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className={`flex min-h-screen flex-col ${isFern ? 'theme-fern' : ''}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      {SHOW_DUMMY_BANNER && (
        <p className="bg-accent-100 px-5 py-1.5 text-center text-xs font-semibold text-accent-700">
          {DUMMY_MARKER}
        </p>
      )}
      <Header />
      {/* Same container as the page below it: fern pages use fern-frame, the others page-gutter */}
      <Breadcrumbs frameClass={isFern ? 'fern-frame' : 'page-gutter'} />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
