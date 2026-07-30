import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function HeroSection() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (username.trim()) {
      const token = localStorage.getItem('token')
      const targetUrl = `/dashboard/${username.trim()}`
      if (token) {
        navigate(targetUrl)
      } else {
        navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`)
      }
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 max-w-4xl flex flex-col items-center justify-center"
      >
        <div className="mb-6 flex items-center justify-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl flex items-center gap-2">
            See your GitHub activity <br className="hidden sm:block" /> like never before<span className="w-6 h-[48px] bg-[#f97316] animate-pulse rounded-sm inline-block translate-y-2"></span>
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)] mt-6">
          AI-powered summaries, trending developer news, and deep activity insights in one terminal-inspired dashboard.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="relative mx-auto w-full max-w-2xl flex items-center"
      >
        <span className="material-symbols-outlined absolute left-4 text-[var(--text-secondary)] z-10 pointer-events-none">search</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter a GitHub username..."
          className="w-full rounded bg-[#1C1C1E] border border-[var(--border-subtle)] px-4 py-4 pl-12 text-[var(--text-primary)] font-mono outline-none transition focus:border-[var(--terminal-green)] shadow-2xl"
        />
        <button type="submit" className="absolute right-2 font-mono text-[10px] bg-[var(--surface-variant)] text-[var(--text-secondary)] px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1 border border-[var(--border-subtle)] transition hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]">
          Enter <span className="material-symbols-outlined text-[12px]">keyboard_return</span>
        </button>
      </motion.form>
    </section>
  )
}
