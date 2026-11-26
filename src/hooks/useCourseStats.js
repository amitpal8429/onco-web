import { useEffect, useState } from 'react'
import { loadCourseList } from '../data/oncologyCourseApi.js'

// Shown if the course API cannot be reached (counts from the live list in November 2026).
export const FALLBACK_STATS = { total: 507, fellowship: 396, certificate: 47, pgDiploma: 64 }

// Computed once per page load and shared by every component that uses the hook.
let cachedStats = null

function countCourses(list) {
  const countType = (type) => list.filter((course) => String(course.type ?? '').trim().toLowerCase() === type).length
  return {
    total: list.length,
    fellowship: countType('fellowship'),
    certificate: countType('certificate'),
    pgDiploma: countType('pg diploma'),
  }
}

// Returns { stats, loading, error }. On failure, stats holds FALLBACK_STATS and error is set.
export default function useCourseStats() {
  const [state, setState] = useState(() =>
    cachedStats ? { stats: cachedStats, loading: false, error: null } : { stats: null, loading: true, error: null },
  )

  useEffect(() => {
    if (cachedStats) return
    let active = true

    loadCourseList()
      .then((list) => {
        cachedStats = countCourses(list)
        if (active) setState({ stats: cachedStats, loading: false, error: null })
      })
      .catch((error) => {
        console.error('Could not load course stats:', error)
        if (active) setState({ stats: FALLBACK_STATS, loading: false, error })
      })

    return () => {
      active = false
    }
  }, [])

  return state
}
