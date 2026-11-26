import { useEffect, useState } from 'react'

const API_URL = 'https://24x7.medicalglobalacademy.com/api/course-list'
const IMAGE_BASE = 'https://24x7.medicalglobalacademy.com/storage/uploads/course/'
const TIMEOUT_MS = 20000

// Filter buttons and the course list follow this order; any other type goes after these.
const TYPE_ORDER = ['Fellowship', 'Pg Diploma', 'Certificate']

// Shown on the Home page, in this order. A slug missing from the API is skipped.
const FEATURED_SLUGS = [
  'fellowship-in-oncology',
  'fellowship-in-surgical-oncology',
  'fellowship-in-hemato-oncology',
  'fellowship-in-gynecologic-oncology',
  'pg-diploma-in-oncology',
  'certificate-in-oncology',
]

function typeRank(type) {
  const index = TYPE_ORDER.indexOf(type)
  return index === -1 ? TYPE_ORDER.length : index
}

// The description is not checked: many other specialties mention oncology there in passing.
function isOncologyCourse(course) {
  return /onco/i.test(`${course.name} ${course.category?.name ?? ''} ${course.department ?? ''}`)
}

function toCourse(course) {
  return {
    slug: course.slug,
    title: course.name.trim().replace(/^Pg\b/, 'PG'),
    type: course.type,
    description: (course.description ?? '').replace(/\s+/g, ' ').trim(),
    image: course.image ? IMAGE_BASE + encodeURIComponent(course.image) : '',
    durationMonths: course.duration,
    registrationFee: course.fee,
    totalFee: course.total_fee,
    onlineFee: course.online_cpd,
    hybridFee: course.hybrid_cpd,
  }
}

// The full list is large, so it is fetched once and shared by every page until a reload.
let cachedCourses = null
let pendingRequest = null

let rawListRequest = null

// The raw list of every MGA course (all specialties). One download is shared by the course pages and the About stats.
export function loadCourseList() {
  rawListRequest ??= fetch(API_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    .then((response) => {
      if (!response.ok) throw new Error(`Course API responded with ${response.status}`)
      return response.json()
    })
    .then((list) => {
      if (!Array.isArray(list)) throw new Error('Course API did not return a list')
      return list
    })
    .catch((error) => {
      rawListRequest = null // Let a later call send a new request.
      throw error
    })
  return rawListRequest
}

function loadOncologyCourses() {
  pendingRequest ??= loadCourseList()
    .then((list) => {
      cachedCourses = list
        .filter(isOncologyCourse)
        .map(toCourse)
        .sort((a, b) => typeRank(a.type) - typeRank(b.type) || a.title.localeCompare(b.title))
      return cachedCourses
    })
    .catch((error) => {
      pendingRequest = null // Let "Try again" send a new request.
      throw error
    })

  return pendingRequest
}

// status is 'loading', 'ready' or 'error'.
export function useOncologyCourses() {
  const [state, setState] = useState(() =>
    cachedCourses ? { status: 'ready', courses: cachedCourses } : { status: 'loading', courses: [] },
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (cachedCourses) return
    let active = true

    loadOncologyCourses()
      .then((courses) => {
        if (active) setState({ status: 'ready', courses })
      })
      .catch((error) => {
        console.error('Could not load courses:', error)
        if (active) setState({ status: 'error', courses: [] })
      })

    return () => {
      active = false
    }
  }, [attempt])

  function retry() {
    setState({ status: 'loading', courses: [] })
    setAttempt((current) => current + 1)
  }

  return { ...state, retry }
}

// TODO: remove this slug once the course admin is fixed. Its highlights, learning points and
// workshop are critical care content, so they stay hidden. Its overview and curriculum are correct.
const WRONG_CONTENT_SLUGS = new Set(['fellowship-in-surgical-oncology'])

function cleanText(text) {
  return (text ?? '').replace(/\s+/g, ' ').trim()
}

// The curriculum was pasted from PDFs, so one lesson can arrive split across several rows.
function joinWrappedLessons(rows) {
  const lessons = []
  for (const row of rows) {
    const continuesPrevious =
      lessons.length > 0 &&
      (/^[a-z]+\b/.test(row) || /(\b(and|or|of|the|in|for|with|to|by|on|at|from)|[,&–-])$/i.test(lessons.at(-1)))
    if (continuesPrevious) lessons[lessons.length - 1] += ` ${row}`
    else lessons.push(row)
  }
  return lessons
}

// Some final modules also picked up the back page of the brochure. It always starts at this line.
function toLessons(sessions) {
  const rows = (sessions ?? []).map((session) => cleanText(session.title)).filter(Boolean)
  const brochureStart = rows.findIndex((row) => /^(national\s*&\s*)?international accreditation\b/i.test(row))
  return joinWrappedLessons(brochureStart === -1 ? rows : rows.slice(0, brochureStart))
}

// Keeps "Part 1: Online Training" lines as labels, whatever line breaks the text around them has.
function toWorkshopIntro(text) {
  const blocks = []
  for (const line of (text ?? '').split(/\r?\n/).map(cleanText).filter(Boolean)) {
    if (/^Part \d+\s*:/.test(line) && line.length <= 60) blocks.push({ label: line, text: '' })
    else if (blocks.length > 0) blocks[blocks.length - 1].text = cleanText(`${blocks.at(-1).text} ${line}`)
    else blocks.push({ label: '', text: line })
  }
  return blocks
}

function toCourseDetail(raw) {
  const modules = (raw.module ?? [])
    .map((module) => ({ id: module.id, title: cleanText(module.module), lessons: toLessons(module.sessions) }))
    .filter((module) => module.title)
  const curriculum = {
    modules,
    lessonCount: modules.reduce((total, module) => total + module.lessons.length, 0),
  }
  if (WRONG_CONTENT_SLUGS.has(raw.slug)) return { highlights: [], learn: [], workshop: null, curriculum }

  const parts = (raw.workshop?.parts ?? []).map((part) => ({
    id: part.id,
    title: cleanText(part.title),
    subtitle: cleanText(part.subtitle),
    points: (part.key_points ?? []).map((point) => cleanText(point.content)).filter(Boolean),
  }))

  return {
    highlights: (raw.highlight ?? []).map((item) => cleanText(item.highlight).replace(/^\d+\.\s*/, '')).filter(Boolean),
    learn: (raw.what_you_learn ?? [])
      .map((item) => ({ id: item.id, heading: cleanText(item.heading), description: cleanText(item.description) }))
      .filter((item) => item.heading),
    workshop: raw.workshop
      ? { title: cleanText(raw.workshop.title), intro: toWorkshopIntro(raw.workshop.subtitle), parts }
      : null,
    curriculum,
  }
}

const detailRequests = new Map()

function loadCourseDetail(slug) {
  if (!detailRequests.has(slug)) {
    const request = fetch(`${API_URL.replace('course-list', 'course-details')}/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Course details API responded with ${response.status}`)
        return response.json()
      })
      .then((raw) => {
        if (raw?.slug !== slug) throw new Error(`Course details API has no data for ${slug}`)
        return toCourseDetail(raw)
      })
      .catch((error) => {
        detailRequests.delete(slug) // Let "Try again" send a new request.
        throw error
      })
    detailRequests.set(slug, request)
  }
  return detailRequests.get(slug)
}

// Pass undefined until the course is known to be on the oncology list. status is 'loading', 'ready' or 'error'.
export function useCourseDetail(slug) {
  const [state, setState] = useState({ slug: null, status: 'loading', detail: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!slug) return
    let active = true

    loadCourseDetail(slug)
      .then((detail) => {
        if (active) setState({ slug, status: 'ready', detail })
      })
      .catch((error) => {
        console.error('Could not load course details:', error)
        if (active) setState({ slug, status: 'error', detail: null })
      })

    return () => {
      active = false
    }
  }, [slug, attempt])

  function retry() {
    setState({ slug, status: 'loading', detail: null })
    setAttempt((current) => current + 1)
  }

  const current = state.slug === slug ? state : { status: 'loading', detail: null }
  return { status: current.status, detail: current.detail, retry }
}

export function getFeaturedCourses(courses) {
  return FEATURED_SLUGS.flatMap((slug) => courses.find((course) => course.slug === slug) ?? [])
}

export function getCourseTypes(courses) {
  return [...new Set(courses.map((course) => course.type).filter(Boolean))].sort(
    (a, b) => typeRank(a) - typeRank(b),
  )
}

export function typeLabel(type) {
  return type === 'Pg Diploma' ? 'PG Diploma' : type
}

export function formatFee(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}
