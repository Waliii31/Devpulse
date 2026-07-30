import { NavLink, useParams, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '' },
  { label: 'Repositories', icon: 'code', path: '/repos' },
  { label: 'Activity', icon: 'analytics', path: '/activity' },
  { label: 'My History', icon: 'history', path: '/history' },
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
      className="fixed left-0 top-16 hidden lg:flex flex-col"
      style={{
        width: '256px',
        height: 'calc(100vh - 64px)',
        backgroundColor: 'var(--surface-container-lowest)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Nav Links */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const to = `/dashboard/${username}${item.path}`

          return (
            <NavLink
              key={item.label}
              to={to}
              end={item.path === ''}
              className="flex items-center gap-3 px-3 py-2 rounded transition-all"
              style={({ isActive }) => ({
                color: isActive ? 'var(--terminal-green)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--surface-container-high)' : 'transparent',
                borderRight: isActive ? '2px solid var(--terminal-green)' : '2px solid transparent',
              })}
              onMouseEnter={(e) => {
                const link = e.currentTarget
                if (!link.classList.contains('active')) {
                  link.style.color = 'var(--on-surface)'
                  link.style.backgroundColor = 'var(--surface-container)'
                }
              }}
              onMouseLeave={(e) => {
                const link = e.currentTarget
                // NavLink re-renders will reset this, but for safety:
                const isActive = link.getAttribute('aria-current') === 'page'
                if (!isActive) {
                  link.style.color = 'var(--text-secondary)'
                  link.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span
                className="font-mono text-xs uppercase tracking-widest font-semibold"
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </div>

      {/* Bottom Section: Logout */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
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
