import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

type FavoritesResponse = {
  favoriteUsernames: string[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function removeFavorite(username: string): Promise<FavoritesResponse> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE_URL}/favorites/${username}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error('Failed to remove favorite')
  return res.json()
}

export function FavoritesTab() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const token = localStorage.getItem('token')

  const {
    data: favData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error('Failed to fetch favorites')
      return res.json() as Promise<FavoritesResponse>
    },
    enabled: !!token,
  })

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const favorites = favData?.favoriteUsernames ?? []

  if (!token) {
    return (
      <div className="max-w-[1440px] mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card p-16 text-center flex flex-col items-center"
        >
          <span
            className="material-symbols-outlined mb-4"
            style={{ fontSize: '64px', color: 'var(--text-secondary)', opacity: 0.4 }}
          >
            lock
          </span>
          <h2
            className="font-geist text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Sign in to view favorites
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            You need to be logged in to save and view your favorite developers.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="font-mono text-sm px-6 py-2.5 rounded transition-colors"
            style={{
              backgroundColor: 'var(--terminal-green)',
              color: 'var(--text-on-accent)',
              border: 'none',
            }}
          >
            Sign In
          </button>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--terminal-green)', borderTopColor: 'transparent' }}
          />
          <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading favorites...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1
          className="font-geist text-2xl font-semibold"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          Favorites
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your saved developer profiles — {favorites.length} total
        </p>
      </motion.div>

      {/* Favorites List or Empty State */}
      {isError || favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bento-card p-16 text-center flex flex-col items-center"
        >
          <span
            className="material-symbols-outlined mb-4"
            style={{ fontSize: '64px', color: 'var(--text-secondary)', opacity: 0.3 }}
          >
            star_border
          </span>
          <h2
            className="font-geist text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            No favorites yet
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Search for GitHub users and add them to your favorites to quickly access their profiles later.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {favorites.map((fav, i) => (
            <motion.div
              key={fav}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
              className="bento-card p-5 flex items-center justify-between gap-3 group transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-secondary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <div
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                onClick={() => navigate(`/dashboard/${fav}`)}
              >
                {/* Avatar placeholder */}
                <div
                  className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    backgroundColor: 'var(--terminal-green)',
                    color: 'var(--text-on-accent)',
                  }}
                >
                  {fav.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3
                    className="font-mono text-sm font-bold truncate"
                    style={{ color: 'var(--terminal-green)' }}
                  >
                    {fav}
                  </h3>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    GitHub User
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/dashboard/${fav}`)}
                  className="flex items-center justify-center w-8 h-8 rounded transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--terminal-green)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-container-high)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  title="View profile"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    open_in_new
                  </span>
                </button>
                <button
                  onClick={() => removeMutation.mutate(fav)}
                  className="flex items-center justify-center w-8 h-8 rounded transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444'
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  title="Remove from favorites"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    delete
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
