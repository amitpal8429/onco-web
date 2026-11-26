import { useEffect, useRef } from 'react'

// `item` is { src, alt, title } or null when closed. The native dialog handles the focus trap and Escape.
export default function ImageLightbox({ item, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (item) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [item])

  return (
    <dialog
      ref={dialogRef}
      aria-label={item?.title}
      onClose={onClose}
      onMouseDown={(event) => event.target === dialogRef.current && onClose()}
      className="m-auto max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-hidden rounded-sm bg-white shadow-xl backdrop:bg-primary-900/80"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 grid size-10 place-items-center rounded-sm bg-primary-900/85 text-2xl leading-none text-white transition-colors hover:bg-primary-900"
      >
        ×
      </button>
      {item && <img src={item.src} alt={item.alt} className="max-h-[calc(100dvh-2rem)] w-auto object-contain" />}
    </dialog>
  )
}
