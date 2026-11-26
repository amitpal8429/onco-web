import { SHOW_DOCTORS } from '../data/site.js'

export const BREADCRUMB_BASE_URL = 'https://medicalglobalacademy.com'

// Label for every static route in App.jsx. A path missing here is treated as "Page Not Found".
export const ROUTE_LABELS = {
  '/': 'Home',
  '/courses': 'Courses',
  ...(SHOW_DOCTORS ? { '/doctor': 'Doctors' } : {}),
  '/about': 'About',
  '/contact': 'Contact Us',
  '/privacy-policy': 'Privacy Policy',
  '/terms': 'Terms & Conditions',
  '/refund': 'Refund & Cancellation Policy',
  '/sitemap': 'Sitemap',
}

// Dynamic routes: the parent path a pattern sits under. Its own label comes from the data (course name).
export const DYNAMIC_PARENTS = {
  courses: '/courses',
}

// These only redirect (see App.jsx), so no breadcrumb is shown while the redirect happens.
export const REDIRECT_PREFIXES = ['/programs']

export const NOT_FOUND_LABEL = 'Page Not Found'
