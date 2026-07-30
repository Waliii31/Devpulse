import { NavLink, useParams, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '' },
  { label: 'Repositories', icon: 'code', path: '/repos' },
  { label: 'Activity', icon: 'analytics', path: '/activity' },
  { label: 'Compare', icon: 'compare_arrows', path: '/compare' },
]

export function Sidebar() {
  const { username = 'octocat' } = useParams()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside
      id="dashboard-sidebar"
      className="fixed bottom-0 left-0 w-full h-16 lg:top-16 lg:h-[calc(100vh-64px)] lg:w-[256px] flex flex-row lg:flex-col bg-[var(--surface-container-lowest)] border-t lg:border-t-0 lg:border-r border-[var(--border-subtle)] z-40"
    >
      {/* Nav Links */}
      <div className="flex-1 flex flex-row lg:flex-col items-center lg:items-stretch justify-around lg:justify-start lg:py-4 lg:px-3 lg:gap-1">
        {navItems.map((item) => {
          const to = `/dashboard/${username}${item.path}`

          return (
            <NavLink
              key={item.label}
              to={to}
              end={item.path === ''}
              className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3 px-2 lg:px-3 py-2 rounded transition-all w-full"
              style={({ isActive }) => ({
                color: isActive ? 'var(--terminal-green)' : 'var(--text-secondary)',
                backgroundColor: isActive ? (window.innerWidth >= 1024 ? 'var(--surface-container-high)' : 'transparent') : 'transparent',
                borderRight: isActive && window.innerWidth >= 1024 ? '2px solid var(--terminal-green)' : '2px solid transparent',
              })}
              onMouseEnter={(e) => {
                const link = e.currentTarget
                if (window.innerWidth >= 1024 && !link.classList.contains('active')) {
                  link.style.color = 'var(--on-surface)'
                  link.style.backgroundColor = 'var(--surface-container)'
                }
              }}
              onMouseLeave={(e) => {
                const link = e.currentTarget
                if (window.innerWidth >= 1024) {
                  const isActive = link.getAttribute('aria-current') === 'page'
                  if (!isActive) {
                    link.style.color = 'var(--text-secondary)'
                    link.style.backgroundColor = 'transparent'
                  }
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span
                className="font-mono text-[10px] lg:text-xs uppercase tracking-widest font-semibold"
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </div>

      {/* Bottom Section: Logout */}
      <div className="hidden lg:block px-4 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          id="logout-button"
          onClick={handleLogout}
          className="w-full py-2 rounded flex items-center justify-center gap-2 transition-colors font-mono text-sm"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0" }}
          >
            logout
          </span>
          Logout
        </button>
        <div className="mt-3 text-center">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: 'var(--text-secondary)' }}
          >
            v1.0.4-stable
          </span>
        </div>
      </div>
    </aside>
  )
}
