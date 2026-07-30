import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

type SidebarProps = {
  open: boolean
  onToggle: () => void
}

const links = [
  { label: 'Overview', to: '/dashboard/octocat', icon: '⌁' },
  { label: 'Activity', to: '/dashboard/octocat/activity', icon: '⚡' },
  { label: 'Repositories', to: '/dashboard/octocat/repos', icon: '📁' },
  { label: 'Favorites', to: '/dashboard/octocat/favorites', icon: '★' },
]

export function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <motion.aside
      layout
      animate={{ width: open ? 288 : 72 }}
      style={{ minWidth: open ? 288 : 72, maxWidth: open ? 288 : 72 }}
      className="relative flex shrink-0 flex-col overflow-hidden rounded-3xl border border-(--border-subtle) bg-[var(--surface-elevated) shadow-[0_24px_80px_rgba(0,0,0,0.18)"
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-(--border-subtle) p-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-(--terminal-green)">Workspace</p>
          {open ? <h2 className="mt-2 text-lg font-semibold text-(--text-primary)">DevPulse</h2> : null}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-(--border-subtle) bg-[var(--surface) px-3 py-2 text-(--text-secondary) transition hover:border-(--terminal-green) hover:text-(--text-primary)"
        >
          {open ? '⇤' : '⇥'}
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                isActive ? 'bg-[var(--terminal-green) text-(--text-on-accent)' : 'text-(--text-secondary) hover:bg-[var(--surface) hover:text-(--text-primary)'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {open ? <span>{link.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  )
}
