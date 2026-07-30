import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { API_BASE_URL } from '../../hooks/useApi'
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = loginSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  const schema = mode === 'login' ? loginSchema : signupSchema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  })

  const onSubmit = async (data: any) => {
    setAuthError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/${mode === 'login' ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.error || 'Authentication failed')
      }

      localStorage.setItem('token', resData.token)
      localStorage.setItem('user', JSON.stringify(resData.user))
      
      if (redirectUrl) {
        navigate(redirectUrl)
      } else {
        navigate(`/dashboard/${(resData.user?.email || 'octocat').split('@')[0]}`)
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGithubAuth = async () => {
    try {
      setGithubLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/github/url`)
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to get GitHub URL')
      }
    } catch (err) {
      setAuthError('Failed to initiate GitHub login')
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                type="email"
                placeholder="sysadmin@devpulse.io"
                {...register('email')}
                className="terminal-input w-full bg-transparent border-none font-mono text-[14px] font-medium pl-10 py-3 pr-3"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            {errors.email?.message && (
              <p className="text-sm text-red-400 font-mono mt-1">{String(errors.email.message)}</p>
            )}
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
                type="password"
                placeholder="••••••••••••"
                {...register('password')}
                className="terminal-input w-full bg-transparent border-none font-mono text-[14px] font-medium pl-10 py-3 pr-3"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            {errors.password?.message && (
              <p className="text-sm text-red-400 font-mono mt-1">{String(errors.password.message)}</p>
            )}
          </div>

          {/* Confirm Password Input (Signup only) */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-2">
              <label
                className="font-mono text-[11px] leading-[16px] tracking-[0.1em] font-semibold uppercase"
                style={{ color: 'var(--text-secondary)' }}
                htmlFor="confirmPassword"
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
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••••••"
                  {...register('confirmPassword')}
                  className="terminal-input w-full bg-transparent border-none font-mono text-[14px] font-medium pl-10 py-3 pr-3"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              {errors.confirmPassword?.message && (
                <p className="text-sm text-red-400 font-mono mt-1">{String(errors.confirmPassword.message)}</p>
              )}
            </div>
          )}

          {authError && <p className="text-sm text-red-400 font-mono">{authError}</p>}

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
