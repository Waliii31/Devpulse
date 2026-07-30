import { motion } from 'framer-motion'
import { useState } from 'react'

export function ContactSection() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    setEmail('')
    setMessage('')
    alert('Message sent successfully!')
  }

  return (
    <section id="ping" className="w-full max-w-7xl mx-auto px-6 py-24 lg:px-8">
      <div className="flex flex-col items-center max-w-lg mx-auto border-t border-[var(--border-subtle)] pt-24">
        <div className="text-center mb-10">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--terminal-green)] font-bold mb-4 block">Ping</span>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Get in touch
          </h2>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-bold text-[var(--text-primary)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              required
              className="w-full bg-[#1C1C1E] border border-[var(--border-subtle)] rounded font-mono text-[13px] text-[var(--text-primary)] px-4 py-3 outline-none focus:border-[var(--terminal-green)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-bold text-[var(--text-primary)]">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="> Type your message here..."
              required
              rows={4}
              className="w-full bg-[#1C1C1E] border border-[var(--border-subtle)] rounded font-mono text-[13px] text-[var(--text-primary)] px-4 py-3 outline-none focus:border-[var(--terminal-green)] transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--terminal-green)] hover:opacity-90 text-[#000000] font-mono text-[13px] font-bold py-3 rounded transition-opacity mt-2"
          >
            [ SEND ]
          </button>
        </motion.form>
      </div>
    </section>
  )
}
