const features = [
  {
    title: 'Activity Heatmap',
    description: 'Visualize commit velocity and contribution patterns across public and private repositories instantly.',
    accent: 'var(--terminal-green)',
    icon: '▦',
  },
  {
    title: 'AI Summary',
    description: 'Get concise analyses of recent PRs, code quality trends, and technology stacks.',
    accent: 'var(--cursor-amber)',
    icon: '◈',
  },
  {
    title: 'Dev News',
    description: 'Stay updated with trending repositories, framework updates, and community discussions.',
    accent: 'var(--text-primary)',
    icon: '◌',
  },
]

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--terminal-green)]">Capabilities</p>
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Deep activity insights</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded bg-[var(--surface-variant)] p-2 text-lg" style={{ color: feature.accent }}>
                {feature.icon}
              </div>
              <h3 className="font-medium text-[var(--text-primary)]">{feature.title}</h3>
            </div>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
