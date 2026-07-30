import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../store/themeSlice'
import type { RootState } from '../../store'

export function Navbar() {
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.theme.mode)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border-subtle) bg-(--surface)/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-xl text-(--terminal-green)">⌘</span>
          <span className="font-semibold text-(--text-primary)">DevPulse</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm text-(--text-secondary) transition hover:text-(--terminal-green)" href="#features">Features</a>
          <a className="text-sm text-(--text-secondary) transition hover:text-(--terminal-green)" href="#about">About</a>
          <a className="text-sm text-(--text-secondary) transition hover:text-(--terminal-green)" href="#pricing">Pricing</a>
          <a className="text-sm text-(--text-secondary) transition hover:text-(--terminal-green)" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded border border-(--border-subtle) bg-(--surface-elevated) px-3 py-2 text-sm text-(--text-primary) transition hover:border-(--terminal-green)"
          >
            {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="rounded bg-(--terminal-green) px-4 py-2 text-sm font-medium text-(--text-on-accent) transition hover:opacity-90">
            Sign In
          </button>
        </div>
      </div>
    </header>
  )
}
