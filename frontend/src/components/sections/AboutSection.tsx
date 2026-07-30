export function AboutSection() {
  return (
    <section id="about" className="border-y border-[var(--border-subtle)] bg-[var(--surface-container-low)] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--terminal-green)]">Mission_Log</p>
        <h2 className="mb-6 text-3xl font-semibold text-[var(--text-primary)]">Decoding developer productivity</h2>
        <p className="text-lg leading-8 text-[var(--text-secondary)]">
          DevPulse combines raw GitHub activity with AI-generated context so you can understand the meaning behind every streak, pull request, and release.
        </p>
      </div>
    </section>
  )
}
