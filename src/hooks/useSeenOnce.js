import { useEffect, useRef, useState } from 'react'

// Returns [ref, seen]. `seen` flips to true once, when the element first scrolls into view.
export default function useSeenOnce(threshold = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, seen]
}
