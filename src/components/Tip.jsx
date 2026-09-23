import { useEffect, useId, useRef, useState } from 'react'
import { CloseIcon, LightbulbIcon } from './Icons.jsx'

/**
 * A click-to-open memory tip. Keyboard: Enter/Space opens, Escape closes and returns focus.
 * Clicking outside also closes it.
 */
export default function Tip({ title, children }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className="relative mt-3">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-slice/60 bg-progress/40 px-3 py-1.5 text-sm font-bold text-ink hover:bg-progress/70"
      >
        <LightbulbIcon className="h-4 w-4" />
        <span>Tip: {title}</span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-5rem))] rounded-xl border border-line bg-surface p-4 shadow-tip"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 rounded-full bg-progress/60 p-1.5 text-ink">
            <LightbulbIcon className="h-5 w-5" />
          </span>
          <div className="flex-1 text-[0.95rem] leading-relaxed">
            <p className="font-serif text-lg font-semibold">{title}</p>
            <p className="mt-1">{children}</p>
          </div>
          <button
            type="button"
            aria-label="Close tip"
            onClick={() => {
              setOpen(false)
              buttonRef.current?.focus()
            }}
            className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-line/40 hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
