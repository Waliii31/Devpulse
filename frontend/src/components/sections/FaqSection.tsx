const faqs = [
  {
    question: 'How does the AI summary work?',
    answer: 'We securely fetch recent activity and generate concise summaries of impact and momentum.',
  },
  {
    question: 'Do you store my code?',
    answer: 'We only process metadata and activity signals needed to provide the dashboard experience.',
  },
  {
    question: 'Can I use this for private repos?',
    answer: 'Pro users can connect read-only access for selected private repositories.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto w-full max-w-4xl px-6 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--terminal-green)]">Help</p>
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Frequently asked questions</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4">
            <summary className="cursor-pointer text-[var(--text-primary)]">{faq.question}</summary>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
