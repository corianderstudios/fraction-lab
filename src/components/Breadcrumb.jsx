import { ChevronRightIcon } from './Icons.jsx'

/** items: [{ label, href? }] — the last item is the current page. */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRightIcon className="h-4 w-4" />}
              {isLast ? (
                <span aria-current="page" className="font-bold text-ink">{item.label}</span>
              ) : item.href ? (
                <a href={item.href} className="underline decoration-line decoration-2 underline-offset-4 hover:text-ink hover:decoration-accent">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
