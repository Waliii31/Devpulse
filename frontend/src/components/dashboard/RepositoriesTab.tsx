import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { fetchJson } from '../../hooks/useApi'

type GitHubProfile = {
  username: string
  profile: {
    avatarUrl: string
    name: string
    bio: string
    followers: number
    publicRepos: number
  }
  repos: Array<{
    name: string
    description: string
    stars: number
    forks?: number
    language: string
    url: string
    visibility?: string
  }>
  activity: Array<{ date: string; count: number }>
  languages: Record<string, number>
  heatmap?: { grid: number[][]; total: number }
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    typescript: '#3178c6',
    javascript: '#f1e05a',
    python: '#3572A5',
    html: '#e34c26',
    css: '#563d7c',
    java: '#b07219',
    go: '#00ADD8',
    rust: '#dea584',
    ruby: '#701516',
    php: '#4F5D95',
    swift: '#F05138',
    kotlin: '#A97BFF',
    'c++': '#f34b7d',
    c: '#555555',
    shell: '#89e051',
  }
  return colors[lang?.toLowerCase() || ''] || 'var(--terminal-green)'
}

type SortOption = 'stars' | 'name' | 'language'

export function RepositoriesTab() {
  const { username = 'octocat' } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('stars')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['github-profile', username],
    queryFn: () => fetchJson<GitHubProfile>(`/github/${username}`),
  })

  const filteredRepos = useMemo(() => {
    let repos = profile?.repos ?? []

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q))
      )
    }

    return [...repos].sort((a, b) => {
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'language') return (a.language || '').localeCompare(b.language || '')
      return 0
    })
  }, [profile?.repos, searchQuery, sortBy])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--terminal-green)', borderTopColor: 'transparent' }}
          />
          <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading repositories...
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
        className="mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="font-geist text-2xl font-semibold"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
            >
              Repositories
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {profile?.repos.length ?? 0} public repositories
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search & Sort Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-3 mb-6 flex-wrap"
      >
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-secondary)', fontSize: '18px' }}
          >
            search
          </span>
          <input
            id="repo-search"
            type="text"
            placeholder="Find a repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-mono w-full rounded px-10 py-2 text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--surface-container-low)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--terminal-green)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {(['stars', 'name', 'language'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className="font-mono text-xs uppercase tracking-wider px-3 py-2 rounded transition-colors"
              style={{
                backgroundColor: sortBy === option ? 'var(--surface-container-high)' : 'transparent',
                color: sortBy === option ? 'var(--terminal-green)' : 'var(--text-secondary)',
                border: `1px solid ${sortBy === option ? 'var(--terminal-green)' : 'var(--border-subtle)'}`,
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Repository List */}
      <div className="space-y-3">
        {filteredRepos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bento-card p-12 text-center"
          >
            <span
              className="material-symbols-outlined mb-3"
              style={{ fontSize: '48px', color: 'var(--text-secondary)' }}
            >
              search_off
            </span>
            <p className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
              No repositories found matching "{searchQuery}"
            </p>
          </motion.div>
        ) : (
          filteredRepos.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.08 + i * 0.03 }}
              className="bento-card block p-5 cursor-pointer transition-colors group"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-secondary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="font-mono text-base font-bold truncate"
                      style={{ color: 'var(--terminal-green)' }}
                    >
                      {repo.name}
                    </h3>
                    <span
                      className="font-mono text-xs rounded px-1.5 py-0.5 flex-shrink-0"
                      style={{
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {repo.visibility || 'Public'}
                    </span>
                  </div>
                  <p
                    className="text-sm line-clamp-2 mb-3"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {repo.description || 'No description provided.'}
                  </p>
                  <div
                    className="flex items-center gap-5 font-mono text-xs"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        star
                      </span>
                      {formatCount(repo.stars)}
                    </span>
                    {repo.forks !== undefined && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          fork_right
                        </span>
                        {formatCount(repo.forks)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.a>
          ))
        )}
      </div>
    </div>
  )
}
