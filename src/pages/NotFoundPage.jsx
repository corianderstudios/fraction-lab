import PageHeader from '../components/PageHeader.jsx'

export default function NotFoundPage() {
  return (
    <div>
      <PageHeader crumbs={[{ label: 'Home', href: '#/' }, { label: 'Page not found' }]} title="Page not found" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p>That address does not match any lesson or game.</p>
        <a href="#/" className="btn-primary mt-4">Go to the home page</a>
      </div>
    </div>
  )
}
