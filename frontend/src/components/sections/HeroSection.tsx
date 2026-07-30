import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function HeroSection() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (username.trim()) {
      navigate(`/dashboard/${username.trim()}`)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
      <div className="mb-10 max-w-4xl">
        <div className="mb-6 flex-col items-center justify-center">
          <span className="text-6xl text-(--terminal-green)">⌘</span>
          <h1 className="text-4xl font-semibold tracking-tight text-(--text-primary) sm:text-5xl lg:text-6xl">
            See your GitHub activity like never before
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-(--text-secondary)">
          AI-powered summaries, trending developer news, and deep activity insights in one terminal-inspired dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-2xl">
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter a GitHub username..."
          className="w-full rounded border border-(--border-subtle) bg-(--surface-elevated) px-4 py-4 pl-12 text-(--text-primary) outline-none transition focus:border-(--terminal-green)"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--text-secondary)">⌕</span>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-(--surface-variant) px-3 py-2 text-sm text-(--text-primary) transition hover:bg-(--terminal-green) hover:text-(--text-on-accent)">
          Search
        </button>
      </form>
    </section>
  )
}
