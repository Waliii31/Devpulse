export function FooterSection() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row lg:px-8">
        <p className="font-mono text-[11px] text-[var(--terminal-green)] uppercase tracking-wider">
          Built by Wali Zafri
        </p>
        <div className="flex items-center gap-6 font-mono text-[11px] text-[var(--text-secondary)]">
          <a href="#" className="transition hover:text-[var(--text-primary)]">GitHub</a>
          <a href="#" className="transition hover:text-[var(--text-primary)]">Twitter</a>
          <a href="#" className="transition hover:text-[var(--text-primary)]">Status</a>
        </div>
      </div>
    </footer>
  )
}
