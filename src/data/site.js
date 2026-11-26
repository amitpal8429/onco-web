// Site-wide details. Replace the placeholders here before going live.
export const site = {
  name: 'Medical Global Academy',
  shortName: 'MGA',
  specialty: 'Oncology',
  logoUrl: 'https://medicalglobalacademy.com/wp-content/uploads/2026/08/logo_new.png',
  counsellorPhone: '+91 93100 27474',
  contact: {
    email: 'support@medicalglobalacademy.com',
    phone: '+91 9289994218',
  },
}

// The label shown wherever content is still dummy.
export const DUMMY_MARKER = 'Dummy content, live se pehle badlein'

// Set to false once all site copy is final. This hides the banner at the top of every page.
export const SHOW_DUMMY_BANNER = false

// The Doctors page lists dummy doctors. Set to true to show the route and nav link in production.
// Switch back to import.meta.env.DEV or remove the dummy data once the real list is in src/data/oncologyDoctors.js.
export const SHOW_DOCTORS = true

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  ...(SHOW_DOCTORS ? [{ to: '/doctor', label: 'Doctors' }] : []),
  { to: '/contact', label: 'Contact Us' },
]

export const courseTypeLinks = [
  { to: '/courses?type=Certificate', label: 'Certificate' },
  { to: '/courses?type=Fellowship', label: 'Fellowship' },
  { to: '/courses?type=Pg%20Diploma', label: 'PG Diploma' },
]

export const legalLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/refund', label: 'Refund & Cancellation Policy' },
  { to: '/sitemap', label: 'Sitemap' },
]

// path is a filled icon drawn on a 24x24 grid.
export const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/medicalglobalacademy1',
    path: 'M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.5V2H14c-3.6 0-4.5 2.7-4.5 4.4v2.1H7V12h2.5v10H14V12h3l.5-3.5H14z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/medicalglobalacademy/',
    path: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-3.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/108696261/',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@MedicalGlobalAcademy',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'X',
    href: 'https://x.com/MGA_Courses',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
]