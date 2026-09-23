import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../data/sections.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { sectionIdForRoute } from '../lib/router.js'
import ThemeToggle from './ThemeToggle.jsx'
import { CheckIcon, CloseIcon, LogoMark, MenuIcon } from './Icons.jsx'

function NavItem({ section, status, active, mobile, onNavigate }) {
  const layout = mobile ? 'w-full px-3 py-3 text-base' : 'px-3 py-2 text-sm'
  // In-progress sections get the soft highlight at 50% opacity.
  const tone = status === 'in-progress' ? 'bg-progress/50' : 'hover:bg-line/40'
  const current = active ? 'font-bold text-ink ring-2 ring-inset ring-accent/70' : 'text-ink'
  return (
    <a
      href={`#${section.path}`}
      aria-current={active ? 'page' : undefined}
      data-status={status}
      onClick={onNavigate}
      className={`flex items-center gap-1.5 rounded-lg ${layout} ${tone} ${current}`}
    >
      {status === 'complete' && <CheckIcon className="h-4 w-4 shrink-0 text-good" />}
      <span>{section.navLabel}</span>
      {status === 'complete' && <span className="sr-only"> (completed)</span>}
      {status === 'in-progress' && <span className="sr-only"> (in progress)</span>}
    </a>
  )
}

export default function NavBar({ route }) {
  const [open, setOpen] = useState(false)
  const { getStatus } = useProgress()
  const menuButtonRef = useRef(null)
  const activeId = sectionIdForRoute(route)

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setOpen(false)
  }, [route.name, route.id, route.op])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const renderItems = (mobile) =>
    SECTIONS.map((s) => (
      <li key={s.id}>
        <NavItem section={s} status={getStatus(s.id)} active={activeId === s.id} mobile={mobile} onNavigate={() => setOpen(false)} />
      </li>
    ))

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <nav aria-label="Main" className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#/" className="flex items-center gap-2 rounded-lg font-serif text-xl font-semibold text-ink">
          <LogoMark />
          <span>FractionLab</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">{renderItems(false)}</ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="icon-btn lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div id="mobile-menu" hidden={!open} className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-tip lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 p-3 sm:px-6">{renderItems(true)}</ul>
        </div>
      </nav>
    </header>
  )
}
