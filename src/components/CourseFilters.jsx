import { useEffect, useId, useRef } from 'react'
import { typeLabel } from '../data/oncologyCourseApi.js'
import Icon from './Icon.jsx'

export function SearchBox({ value, onChange, disabled, className = '' }) {
  const id = useId()

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search courses by title
      </label>
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-fern-900">
        <Icon path="M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4" className="size-4" strokeWidth={2.2} />
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Search by course title"
        className="h-12 w-full rounded-full border-2 border-fern-900 bg-white pl-10 pr-4 text-sm text-fern-950 placeholder:text-bark-600 disabled:cursor-not-allowed disabled:border-cream-200"
      />
    </div>
  )
}

// `options` lists every choice, with `all` first. Counts only show once the courses have loaded.
export function TypeFilter({ options, all, selected, counts, ready, onSelect }) {
  return (
    <div role="group" aria-label="Filter by course type" className="grid gap-1.5">
      {options.map((type) => {
        const active = selected === type

        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            disabled={!ready}
            onClick={() => onSelect(type)}
            className={`flex min-h-11 items-center justify-between gap-3 rounded-full px-5 text-left text-sm font-bold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
              active ? 'bg-fern-900 text-cream-50' : 'text-fern-900 hover:bg-fern-100'
            }`}
          >
            {type === all ? all : typeLabel(type)}
            {ready && (
              <span className={`text-xs font-medium ${active ? 'text-fern-100' : 'text-bark-600'}`}>
                {counts[type] || 0}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Bottom sheet for phones and tablets. The native dialog handles the focus trap and Escape.
export function FilterDrawer({ open, onClose, resultCount, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  // The sidebar takes over from lg, so a sheet left open when the screen widens closes itself.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)')
    const onChange = (event) => event.matches && onClose()
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Course filters"
      onClose={onClose}
      onMouseDown={(event) => event.target === dialogRef.current && onClose()}
      className="m-0 mt-auto max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-[2rem] bg-cream-50 p-6 backdrop:bg-fern-950/60 motion-safe:animate-sheet-up"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-headline text-2xl font-medium text-fern-950">Filters</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="grid size-11 place-items-center rounded-full border-2 border-fern-900 text-fern-900 transition-colors duration-300 hover:bg-fern-900 hover:text-cream-50"
        >
          <Icon path="M6 6l12 12 M18 6L6 18" className="size-4" strokeWidth={2.4} />
        </button>
      </div>
      <div className="mt-5">{children}</div>
      <button type="button" onClick={onClose} className="pill-coral mt-6 w-full">
        Show {resultCount} courses
      </button>
    </dialog>
  )
}
