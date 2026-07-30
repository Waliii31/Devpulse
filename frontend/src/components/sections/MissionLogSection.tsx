import { motion } from 'framer-motion'

export function MissionLogSection() {
  return (
    <section id="mission" className="w-full max-w-7xl mx-auto px-6 py-24 lg:px-8 border-t border-[var(--border-subtle)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto"
      >
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--terminal-green)] font-bold mb-4">Mission_Log</span>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl mb-6">
          Decoding Developer Productivity
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] mb-10">
          DevPulse was built for engineers who want more than just green squares. We believe in providing actionable context to your open-source and private contributions. By combining raw Git data with AI analysis, we surface the real impact of your code.
        </p>

        <div className="bg-[#0A0A0B] border border-[var(--border-subtle)] rounded-md px-6 py-4 font-mono text-[13px] text-[var(--text-secondary)]">
          <span className="text-[#f97316]">~/devpulse</span> <span className="text-[var(--text-primary)]">$</span> cat mission.txt
        </div>
      </motion.div>
    </section>
  )
}
