import Breadcrumb from './Breadcrumb.jsx'
import { CheckCircleIcon } from './Icons.jsx'

export default function PageHeader({ crumbs, title, subtitle, complete = false }) {
  return (
    <div className="mx-auto w-full max-w-7xl shrink-0 px-4 pb-4 pt-5 sm:px-6">
      <Breadcrumb items={crumbs} />
      <h1 id="page-title" tabIndex={-1} className="mt-3 flex items-center gap-3 text-3xl font-semibold focus:outline-none sm:text-4xl">
        {complete && (
          <span className="shrink-0 text-good">
            <CheckCircleIcon className="h-8 w-8" />
            <span className="sr-only">Completed: </span>
          </span>
        )}
        <span>{title}</span>
      </h1>
      {subtitle && <p className="mt-2 max-w-3xl text-muted">{subtitle}</p>}
    </div>
  )
}
