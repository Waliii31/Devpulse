import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function Navbar() {
  const [user, setUser] = useState<{ email?: string; githubId?: string } | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const displayName = user ? (user.githubId || user.email?.split('@')[0]) : null

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--surface)]/80 backdrop-blur-sm border-b border-[var(--border-subtle)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg text-[var(--terminal-green)]">⌘</span>
          <span className="font-bold text-2xl font-geist text-[var(--text-primary)]">DevPulse</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex font-mono text-[13px]">
          <a className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" href="#capabilities">Features</a>
          <a className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" href="#mission">About</a>
          <a className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" href="#faq">FAQ</a>
          <a className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" href="#ping">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to={`/dashboard/${displayName}`}
                className="font-mono text-[13px] text-[var(--text-primary)] hover:text-[var(--terminal-green)] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded border border-[var(--border-subtle)] bg-[var(--surface-variant)] px-4 py-1.5 font-mono text-[13px] text-[var(--text-secondary)] transition hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded bg-[var(--terminal-green)] px-5 py-2 font-mono text-[13px] font-bold text-[var(--surface-container-lowest)] transition hover:opacity-90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
