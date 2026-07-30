import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      localStorage.setItem('devpulse_token', data.token)
      localStorage.setItem('devpulse_user', JSON.stringify(data.user))
      navigate(`/dashboard/${(data.user?.email || 'octocat').split('@')[0]}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-2xl border border-(--border-subtle) bg-[var(--surface-elevated) p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)">
        <p className="text-sm uppercase tracking-[0.3em] text-(--terminal-green)">{mode === 'login' ? 'Access' : 'Create account'}</p>
        <h1 className="mt-3 text-3xl font-semibold text-(--text-primary)">{mode === 'login' ? 'Welcome back' : 'Start with DevPulse'}</h1>
        <p className="mt-3 text-sm leading-7 text-(--text-secondary)">{mode === 'login' ? 'Sign in to continue your developer pulse.' : 'Create an account and start tracking your coding story.'}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border border-(--border-subtle) bg-[var(--surface) px-4 py-3 text-(--text-primary) outline-none focus:border-(--terminal-green)"
            placeholder="Email"
            type="email"
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border border-(--border-subtle) bg-[var(--surface) px-4 py-3 text-(--text-primary) outline-none focus:border-(--terminal-green)"
            placeholder="Password"
            type="password"
            required
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button disabled={loading} className="w-full rounded bg-[var(--terminal-green) px-4 py-3 font-medium text-(--text-on-accent) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          {mode === 'login' ? 'No account yet?' : 'Already have one?'}{' '}
          <Link to={mode === 'login' ? '/signup' : '/login'} className="text-(--terminal-green)">
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
