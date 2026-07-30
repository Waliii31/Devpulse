import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { API_BASE_URL } from '../../hooks/useApi'
interface Snapshot {
  followers: number
  publicRepos: number
  totalCommits: number
  topLanguage: string
}

interface HistoryEntry {
  _id: string
  date: string
  githubUsername: string
  snapshot: Snapshot
}

export function HistoryTab() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('You must be logged in to view history.')
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error('Failed to fetch history')
        }

        const data = await res.json()
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return <div className="p-8 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>Loading history...</div>
  }

  if (error) {
    return <div className="p-8 font-mono text-sm text-red-400">{error}</div>
  }

  if (history.length === 0) {
    return (
      <div className="p-8 font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
        No history available yet. Search your own username on the dashboard to start tracking!
      </div>
    )
  }

  // Find max values for scaling bars
  const maxCommits = Math.max(...history.map((h) => h.snapshot.totalCommits || 0), 1)
  const maxFollowers = Math.max(...history.map((h) => h.snapshot.followers || 0), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto flex flex-col gap-8"
    >
      <header>
        <h2 className="font-geist text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Personal Activity History</h2>
        <p className="font-mono text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Tracking snapshots of your profile over time.
        </p>
      </header>

      {/* Commits Chart */}
      <section className="bento-card p-6 flex flex-col gap-6">
        <h3 className="font-mono text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--text-primary)' }}>Total Commits Over Time</h3>
        <div className="flex items-end gap-2 h-40 mt-4">
          {history.map((entry) => {
            const height = ((entry.snapshot.totalCommits || 0) / maxCommits) * 100
            return (
              <div key={entry._id} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  className="w-full rounded-t transition-all duration-300"
                  style={{ height: `${height}%`, backgroundColor: 'var(--terminal-green)', opacity: 0.8 }}
                />
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                
                {/* Tooltip */}
                <div className="absolute -top-10 hidden group-hover:block bg-black px-2 py-1 rounded text-xs font-mono whitespace-nowrap z-10" style={{ color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                  {entry.snapshot.totalCommits} commits
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Followers Chart */}
      <section className="bento-card p-6 flex flex-col gap-6">
        <h3 className="font-mono text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--text-primary)' }}>Followers Over Time</h3>
        <div className="flex items-end gap-2 h-40 mt-4">
          {history.map((entry) => {
            const height = ((entry.snapshot.followers || 0) / maxFollowers) * 100
            return (
              <div key={entry._id} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  className="w-full rounded-t transition-all duration-300"
                  style={{ height: `${height}%`, backgroundColor: 'var(--primary)', opacity: 0.8 }}
                />
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                
                {/* Tooltip */}
                <div className="absolute -top-10 hidden group-hover:block bg-black px-2 py-1 rounded text-xs font-mono whitespace-nowrap z-10" style={{ color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                  {entry.snapshot.followers} followers
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Raw Data List */}
      <section className="bento-card p-6 flex flex-col gap-4">
        <h3 className="font-mono text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--text-primary)' }}>Data Snapshots</h3>
        <div className="flex flex-col gap-2">
          {history.slice().reverse().map(entry => (
            <div key={entry._id} className="flex justify-between items-center py-2 px-3 rounded" style={{ backgroundColor: 'var(--surface)' }}>
              <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(entry.date).toLocaleString()}</span>
              <div className="flex gap-4 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                <span>Commits: {entry.snapshot.totalCommits}</span>
                <span>Followers: {entry.snapshot.followers}</span>
                <span>Top Lang: {entry.snapshot.topLanguage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
