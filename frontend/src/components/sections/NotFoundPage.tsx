import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-(--terminal-green)">404</p>
      <h1 className="mt-4 text-5xl font-semibold text-(--text-primary)">Page not found</h1>
      <p className="mt-4 max-w-xl text-lg text-(--text-secondary)">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="mt-8 rounded bg-(--terminal-green) px-5 py-3 font-medium text-(--text-on-accent) transition hover:opacity-90">
        Return home
      </Link>
    </div>
  )
}
