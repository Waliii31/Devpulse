import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'

type PageShellProps = {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  const mode = useSelector((state: RootState) => state.theme.mode)

  useEffect(() => {
    document.documentElement.classList.toggle('light', mode === 'light')
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return <div className="min-h-screen bg-(--background) text-(--text-primary)">{children}</div>
}
