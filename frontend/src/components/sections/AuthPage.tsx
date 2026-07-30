import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

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

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate(`/dashboard/${(data.user?.email || 'octocat').split('@')[0]}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGithubAuth = async () => {
    try {
      setGithubLoading(true)
      const res = await fetch('/api/auth/github/url')
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to get GitHub URL')
      }
    } catch (err) {
      setError('Failed to initiate GitHub login')
      setGithubLoading(false)
    }
  }

  return (
    <div className="antialiased min-h-screen flex items-center justify-center p-6 bg-grid-pattern">
      <style>{`
        .bg-grid-pattern {
          background-color: #0A0A0B;
          background-image: url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 0H0v20h20V0zm-1 19H1V1h18v18z" fill="%23262626" fill-opacity="0.4" fill-rule="evenodd"/%3E%3C/svg%3E');
        }
        .terminal-input:focus {
          outline: none;
          box-shadow: none;
        }
        .terminal-input::placeholder {
          color: var(--surface-variant);
        }
      `}</style>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] flex flex-col p-8 gap-8 rounded"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Header */}
        <header className="flex flex-col gap-2 items-start">
          <h1
            className="font-geist text-[32px] leading-[40px] tracking-[-0.02em] font-semibold"
            style={{ color: 'var(--terminal-green)' }}
          >
            DevPulse
          </h1>
          <p
            className="font-geist text-[14px] leading-[20px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            System authentication required.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              className="font-mono text-[11px] leading-[16px] tracking-[0.1em] font-semibold uppercase"
              style={{ color: 'var(--text-secondary)' }}
              htmlFor="email"
            >
              Email Address
            </label>
            <div
              className="relative flex items-center transition-colors duration-200 rounded"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--terminal-green)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <span
                className="material-symbols-outlined absolute left-3 text-[16px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                mail
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="sysadmin@devpulse.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="terminal-input w-full bg-transparent border-none font-mono text-[14px] font-medium pl-10 py-3 pr-3"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                className="font-mono text-[11px] leading-[16px] tracking-[0.1em] font-semibold uppercase"
                style={{ color: 'var(--text-secondary)' }}
                htmlFor="password"
              >
                Password
              </label>
              {mode === 'login' && (
                <a
                  href="#"
                  className="font-mono text-[11px] leading-[16px] tracking-[0.1em] font-semibold transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--terminal-green)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  Reset
                </a>
              )}
            </div>
            <div
              className="relative flex items-center transition-colors duration-200 rounded"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--terminal-green)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <span
                className="material-symbols-outlined absolute left-3 text-[16px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                lock
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="terminal-input w-full bg-transparent border-none font-mono text-[14px] font-medium pl-10 py-3 pr-3"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Confirm Password Input (Signup only) */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-2">
              <label
                className="font-mono text-[11px] leading-[16px] tracking-[0.1em] font-semibold uppercase"
                style={{ color: 'var(--text-secondary)' }}
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div
                className="relative flex items-center transition-colors duration-200 rounded"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--terminal-green)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              >
                <span
                  className="material-symbols-outlined absolute left-3 text-[16px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  lock
                </span>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="terminal-input w-full bg-transparent border-none font-mono text-[14px] font-medium pl-10 py-3 pr-3"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full font-mono text-[14px] font-bold py-3 transition-colors duration-200 flex justify-center items-center gap-2 rounded disabled:opacity-70 disabled:cursor-not-allowed group"
            style={{
              backgroundColor: 'var(--terminal-green)',
              color: 'var(--surface-container-lowest)',
              border: '1px solid var(--terminal-green)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--terminal-green)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--terminal-green)'
                e.currentTarget.style.color = 'var(--surface-container-lowest)'
              }
            }}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                {mode === 'login' ? 'Authenticate' : 'Create account'}
                <span className="material-symbols-outlined text-[18px]">
                  {mode === 'login' ? 'login' : 'person_add'}
                </span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
          <span className="font-mono text-[11px] uppercase" style={{ color: 'var(--text-secondary)' }}>or</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* GitHub OAuth Button */}
        <button
          type="button"
          onClick={handleGithubAuth}
          disabled={githubLoading}
          className="w-full font-mono text-[14px] font-bold py-3 transition-colors duration-200 flex justify-center items-center gap-2 rounded disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--surface-container-high)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
          }}
          onMouseEnter={(e) => {
            if (!githubLoading) e.currentTarget.style.borderColor = 'var(--text-secondary)'
          }}
          onMouseLeave={(e) => {
            if (!githubLoading) e.currentTarget.style.borderColor = 'var(--border-subtle)'
          }}
        >
          {githubLoading ? 'Connecting...' : 'Continue with GitHub'}
        </button>

        {/* Footer */}
        <footer className="pt-4 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="font-geist text-[13px] leading-[18px]" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              to={mode === 'login' ? '/signup' : '/login'}
              className="transition-colors duration-200"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--terminal-green)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            >
              {mode === 'login' ? 'Request Access' : 'Authenticate'}
            </Link>
          </p>
        </footer>
      </motion.main>
    </div>
  )
}
