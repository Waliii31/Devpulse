import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { API_BASE_URL } from '../../hooks/useApi'
export function DashboardNavbar() {
  const { username = '' } = useParams()
  const navigate = useNavigate()

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim()
      if (value) {
        navigate(`/dashboard/${value}`)
      }
    }
  }

  const [isDark, setIsDark] = useState(true)
  const [aiTone, setAiTone] = useState('friendly')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loggedInUsername, setLoggedInUsername] = useState<string>('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (document.documentElement.classList.contains('light')) {
      setIsDark(false)
    } else {
      setIsDark(true)
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user && user.aiTonePreference) {
        setAiTone(user.aiTonePreference)
      }
      if (user && user.email) {
        setLoggedInUsername(user.email.split('@')[0])
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const queryClient = useQueryClient()

  const handleToneChange = async (newTone: string) => {
    setAiTone(newTone)
    setIsDropdownOpen(false)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ aiTonePreference: newTone })
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('user', JSON.stringify(data.user))
        queryClient.invalidateQueries({ queryKey: ['summary', username] })
      }
    } catch (err) {
      console.error('Failed to save tone preference', err)
    }
  }

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
    document.documentElement.classList.toggle('light')
  }

  return (
    <nav
      id="dashboard-navbar"
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 border-b"
      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Brand */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl font-bold text-(--terminal-green)">⌘</span>
        <span
          className="font-geist text-2xl font-bold tracking-tight"
          style={{ color: 'var(--terminal-white)' }}
        >

          DevPulse
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative flex items-center w-full">
          <span
            className="material-symbols-outlined absolute left-3"
            style={{ color: 'var(--text-secondary)', fontVariationSettings: "'FILL' 0" }}
          >
            search
          </span>
          <input
            id="search-username"
            type="text"
            placeholder="Search GitHub username..."
            defaultValue={username}
            onKeyDown={handleSearch}
            className="font-mono w-full rounded px-10 py-1.5 text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--surface-container-low)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--terminal-green)'
              e.currentTarget.style.boxShadow = '0 0 0 1px var(--terminal-green)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <div
            className="absolute right-3 flex items-center gap-1 rounded px-1.5 py-0.5"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <span className="font-mono text-xs">/</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)' }}>
        <div className="hidden md:flex items-center gap-2 mr-2 relative" ref={dropdownRef}>
          <span className="font-mono text-xs uppercase tracking-widest">AI Tone:</span>
          
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-transparent text-sm font-mono focus:outline-none rounded px-3 py-1.5 transition-colors"
            style={{
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-container-low)'
            }}
          >
            <span className="capitalize">{aiTone}</span>
            <span 
              className="material-symbols-outlined text-[16px] transition-transform duration-200" 
              style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              expand_more
            </span>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-40 rounded shadow-lg overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--surface-container)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {['friendly', 'motivational', 'technical', 'recruiter'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => handleToneChange(tone)}
                    className="w-full text-left px-4 py-2 font-mono text-sm transition-colors hover:bg-black/20"
                    style={{
                      color: aiTone === tone ? 'var(--terminal-green)' : 'var(--text-primary)',
                      backgroundColor: aiTone === tone ? 'var(--surface-container-high)' : 'transparent',
                    }}
                  >
                    <span className="capitalize">{tone}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded transition-colors"
          style={{ backgroundColor: 'transparent' }}
          title="Toggle Theme"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--terminal-green)'
            e.currentTarget.style.backgroundColor = 'var(--surface-container-high)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <div
          className="w-8 h-8 rounded-full overflow-hidden"
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          {loggedInUsername ? (
            <img 
              src={`https://github.com/${loggedInUsername}.png`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                // Fallback to initial if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs font-bold" style="background-color: var(--terminal-green); color: var(--text-on-accent)">${username?.charAt(0)?.toUpperCase() || 'U'}</div>`;
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--terminal-green)', color: 'var(--text-on-accent)' }}
            >
              {username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
