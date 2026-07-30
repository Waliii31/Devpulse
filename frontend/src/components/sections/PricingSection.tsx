const plans = [
  {
    name: 'Hobbyist',
    price: '$0',
    description: 'For students and side-project builders',
    features: ['Public repository tracking', 'Basic activity insights', 'Weekly developer digest'],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$9',
    description: 'For serious developers and freelancers',
    features: ['Private and public tracking', 'Advanced analytics', 'Unlimited AI summaries'],
    highlighted: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--terminal-green)]">Plans</p>
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Simple, transparent pricing</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.name} className={`rounded border p-8 ${plan.highlighted ? 'border-[var(--terminal-green)] bg-[var(--surface-elevated)]' : 'border-[var(--border-subtle)] bg-[var(--surface)]'}`}>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">{plan.name}</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{plan.description}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-semibold text-[var(--text-primary)]">{plan.price}</span>
              <span className="pb-1 text-sm text-[var(--text-secondary)]">/month</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-[var(--text-secondary)]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="text-[var(--terminal-green)]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`mt-8 w-full rounded px-4 py-3 text-sm font-medium transition ${plan.highlighted ? 'bg-[var(--terminal-green)] text-[var(--text-on-accent)] hover:opacity-90' : 'border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--terminal-green)]'}`}>
              {plan.highlighted ? 'Upgrade to Pro' : 'Start Free'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
