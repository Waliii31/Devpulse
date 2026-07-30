import { motion } from 'framer-motion'

export function CapabilitiesSection() {
  const cards = [
    {
      title: 'Activity Heatmap',
      icon: 'grid_view',
      iconColor: 'text-[var(--terminal-green)]',
      iconBg: 'bg-[var(--terminal-green)]/10',
      description: 'Visualize commit velocity and contribution patterns across all public and private repositories instantly.',
      graphic: (
        <div className="flex items-end gap-1 mt-6 h-12">
          <div className="w-6 bg-[var(--terminal-green)]/20 h-2 rounded-sm" />
          <div className="w-6 bg-[var(--terminal-green)]/40 h-4 rounded-sm" />
          <div className="w-6 bg-[var(--terminal-green)] h-8 rounded-sm" />
          <div className="w-6 bg-[var(--terminal-green)]/60 h-6 rounded-sm" />
          <div className="w-6 bg-[var(--terminal-green)]/20 h-2 rounded-sm" />
          <div className="w-6 bg-[#f97316] h-3 rounded-sm" />
        </div>
      ),
    },
    {
      title: 'AI Summary',
      icon: 'blur_on',
      iconColor: 'text-[#f97316]',
      iconBg: 'bg-[#f97316]/10',
      description: 'Get concise, machine-generated analyses of recent PRs, code quality trends, and technology stacks.',
      graphic: (
        <div className="mt-6 bg-[#1C1C1E] rounded-md p-3 font-mono text-[10px] leading-tight text-[var(--text-secondary)] border border-[var(--border-subtle)]">
          <div><span className="text-[var(--terminal-green)]">&gt;</span> Analyzing repos...</div>
          <div><span className="text-[var(--terminal-green)]">&gt;</span> Status: <span className="text-white">High velocity</span><br/>detected.</div>
        </div>
      ),
    },
    {
      title: 'Dev News',
      icon: 'newspaper',
      iconColor: 'text-[var(--text-primary)]',
      iconBg: 'bg-[var(--surface-variant)]',
      description: 'Stay updated with tailored feeds on trending repositories, framework updates, and tech community discussions.',
      graphic: (
        <div className="mt-8 flex flex-col gap-2">
          <div className="h-1 bg-[var(--text-secondary)]/50 rounded w-full" />
          <div className="h-1 bg-[var(--text-secondary)]/30 rounded w-5/6" />
          <div className="h-1 bg-[var(--text-secondary)]/30 rounded w-4/6" />
        </div>
      ),
    }
  ]

  return (
    <section id="capabilities" className="w-full max-w-7xl mx-auto px-6 py-24 lg:px-8">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--terminal-green)] font-bold mb-4">Capabilities</span>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Deep Activity Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] p-6 transition-all hover:border-[var(--text-secondary)]/30"
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center mb-4 ${card.iconBg}`}>
              <span className={`material-symbols-outlined text-[16px] ${card.iconColor}`}>
                {card.icon}
              </span>
            </div>
            <h3 className="text-lg font-mono font-bold text-[var(--text-primary)] mb-3">
              {card.title}
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed flex-1">
              {card.description}
            </p>
            {card.graphic}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
