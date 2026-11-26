import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks, site } from '../data/site.js'
import AuthModal from './AuthModal.jsx'

const SCROLL_THRESHOLD = 12

const MOBILE_MENU_ID = 'primary-nav'

const linkBase = 'border-b-2 pb-1 text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-200'

// `solid` = white bar (scrolled, other pages, or mobile menu open); otherwise the dark bar at the top of Home
function navClass(solid) {
  return ({ isActive }) => {
    if (isActive) {
      return `${linkBase} border-accent-500 ${solid ? 'text-primary-900' : 'text-white'}`
    }
    return `${linkBase} border-transparent ${
      solid ? 'text-ink-600 hover:text-primary-900' : 'text-white/75 hover:text-white'
    }`
  }
}

const buttonBase =
  'inline-flex h-10 items-center justify-center rounded-sm px-6 text-sm font-semibold transition-colors duration-200'

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)
  const [logoFailed, setLogoFailed] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const closeMenu = () => setMenuOpen(false)
  const closeAuth = useCallback(() => setAuthMode(null), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on any route change (back/forward, links outside the menu).
  // Done during render, not in an effect, so there's no extra render with the menu still open.
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  // While the mobile menu is open: lock page scroll and close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  const solid = pathname !== '/' || scrolled || menuOpen
  const textColor = solid ? 'text-primary-900' : 'text-white'

  const navItems = navLinks.map((link) => (
    <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={closeMenu} className={navClass(solid)}>
      {link.label}
    </NavLink>
  ))

  const buttons = (
    <>
      <button
        type="button"
        onClick={() => {
          closeMenu()
          setAuthMode('login')
        }}
        className={`${buttonBase} border ${
          solid
            ? 'border-mist-200 bg-white text-primary-900 hover:border-accent-500 hover:text-accent-700'
            : 'border-white/35 text-white hover:border-accent-500 hover:bg-white/10'
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => {
          closeMenu()
          setAuthMode('signup')
        }}
        className={`${buttonBase} border border-accent-500 bg-accent-500 text-ink-900 hover:border-accent-300 hover:bg-accent-300`}
      >
        Sign Up
      </button>
    </>
  )

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          solid ? 'border-mist-200 bg-white shadow-sm' : 'border-white/10 bg-primary-900'
        }`}
      >
        <div className="page-gutter flex items-center justify-between py-3 md:py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:grid-cols-[auto_auto_1fr] xl:gap-12">
          <Link
            to="/"
            onClick={closeMenu}
            aria-label={`${site.name} ${site.specialty}, Home`}
            className="flex shrink-0 items-center gap-3 justify-self-start lg:pl-0"
          >
            {!logoFailed && (
              <img
                src={site.logoUrl}
                alt={site.name}
                loading="eager"
                width="256"
                height="256"
                onError={() => setLogoFailed(true)}
                className="h-11 w-auto object-contain md:h-[52px]"
              />
            )}
            <span>
              {/* The name needs xl width next to the logo; without a logo it always shows. */}
              <span
                className={`${logoFailed ? 'block' : 'hidden xl:block'} whitespace-nowrap font-display text-lg font-bold leading-tight transition-colors duration-300 ${textColor}`}
              >
                {site.name}
              </span>
              <span
                className={`block text-xs font-semibold uppercase leading-tight tracking-[0.25em] transition-colors duration-300 xl:text-[10px] ${
                  solid ? 'text-accent-700' : 'text-accent-300'
                }`}
              >
                {site.specialty}
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navItems}
          </nav>

          <div className="hidden items-center justify-end gap-3 lg:flex">{buttons}</div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            className={`flex size-10 flex-col items-center justify-center gap-1.5 rounded-sm transition-colors lg:hidden ${
              solid ? 'hover:bg-mist-100' : 'hover:bg-white/10'
            }`}
          >
            <span className={`h-0.5 w-6 ${solid ? 'bg-primary-900' : 'bg-white'}`} />
            <span className={`h-0.5 w-6 ${solid ? 'bg-primary-900' : 'bg-white'}`} />
            <span className={`h-0.5 w-6 ${solid ? 'bg-primary-900' : 'bg-white'}`} />
          </button>
        </div>

        {menuOpen && (
          <div
            id={MOBILE_MENU_ID}
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-mist-200 bg-white px-5 pb-6 pt-4 sm:px-8 lg:hidden"
          >
            <nav aria-label="Primary mobile" className="flex flex-col items-start gap-4">
              {navItems}
            </nav>
            <div className="mt-6 flex flex-col gap-3">{buttons}</div>
          </div>
        )}
      </header>
      <AuthModal mode={authMode} onClose={closeAuth} onSwitchMode={setAuthMode} />
    </>
  )
}



