import { useState } from 'react'
import { motion } from 'framer-motion'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How does the AI summary work?',
      answer: "We use advanced LLMs (like OpenAI's GPT models) to analyze your recent commits and pull requests. We fetch the raw diffs from GitHub, summarize the changes, and categorize them into themes like 'Refactoring', 'New Features', or 'Bug Fixes'.",
    },
    {
      question: 'Do you store my code?',
      answer: "No. We only store metadata (like commit counts and language statistics). When we generate AI summaries, the code diffs are temporarily processed in-memory and immediately discarded. We never persist your proprietary source code.",
    },
    {
      question: 'Can I use this for private org repos?',
      answer: "Yes, our Professional plan supports full tracking of private repositories and organization repositories, provided you grant the DevPulse OAuth app the necessary permissions during sign-in.",
    },
  ]

  return (
    <section id="faq" className="w-full max-w-7xl mx-auto px-6 py-24 lg:px-8">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--terminal-green)] font-bold mb-4">Help</span>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-md border border-[var(--border-subtle)] bg-[#0A0A0B] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-[var(--surface-elevated)] focus:outline-none"
            >
              <span className="font-mono text-[13px] font-bold text-[var(--text-primary)]">{faq.question}</span>
              <span className={`material-symbols-outlined text-[18px] text-[var(--text-secondary)] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-5 text-[14px] text-[var(--text-secondary)] leading-relaxed bg-[#0A0A0B]">
                {faq.answer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
