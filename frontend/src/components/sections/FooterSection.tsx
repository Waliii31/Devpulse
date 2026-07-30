export function FooterSection() {
  return (
    <footer className="border-t border-(--border-subtle) bg-[var(--surface)/80 px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-(--text-primary)">Built for developers who want clarity.</p>
          <p className="mt-2 text-sm text-(--text-secondary)">© 2026 DevPulse. All rights reserved.</p>
        </div>
        <div className="flex gap-4 text-sm text-(--text-secondary)">
          <a className="transition hover:text-(--terminal-green)" href="#features">Features</a>
          <a className="transition hover:text-(--terminal-green)" href="#pricing">Pricing</a>
          <a className="transition hover:text-(--terminal-green)" href="/signup">Sign up</a>
        </div>
      </div>
    </footer>
  )
}
