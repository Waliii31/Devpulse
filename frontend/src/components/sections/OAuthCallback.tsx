import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_BASE_URL } from '../../hooks/useApi'
export function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')

    if (!code) {
      setError('No authorization code provided by GitHub')
      return
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/github/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to authenticate with GitHub')
        }

        // Store tokens and user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect to dashboard
        navigate(`/dashboard/${(data.user?.email || 'octocat').split('@')[0]}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed')
      }
    }

    exchangeCode()
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-grid-pattern">
        <style>{`
          .bg-grid-pattern {
            background-color: #0A0A0B;
            background-image: url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 0H0v20h20V0zm-1 19H1V1h18v18z" fill="%23262626" fill-opacity="0.4" fill-rule="evenodd"/%3E%3C/svg%3E');
          }
        `}</style>
        <div className="max-w-md w-full p-8 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-center">
          <span className="material-symbols-outlined text-4xl mb-4 text-red-500">error</span>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Authentication Error</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded font-mono text-sm font-bold"
            style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-grid-pattern">
      <style>{`
        .bg-grid-pattern {
          background-color: #0A0A0B;
          background-image: url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 0H0v20h20V0zm-1 19H1V1h18v18z" fill="%23262626" fill-opacity="0.4" fill-rule="evenodd"/%3E%3C/svg%3E');
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--terminal-green)', borderTopColor: 'transparent' }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="font-mono text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Authenticating with GitHub...
      </motion.p>
    </div>
  )
}
