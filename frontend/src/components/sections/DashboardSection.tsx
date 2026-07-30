import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import { fetchJson } from '../../hooks/useApi'

type GitHubProfile = {
  username: string
  profile: {
    avatarUrl: string
    name: string
    bio: string
    followers: number
    publicRepos: number
    location?: string
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

type NewsItem = {
  title: string
  url: string
  points: number
  commentsCount: number
  author: string
  publishedAt: string
  source: string
}

type NewsResponse = {
  articles: NewsItem[]
}

// Removed useHeatmapData function

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return 'just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function DashboardSection() {
  const { username = 'octocat' } = useParams()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['github-profile', username],
    queryFn: () => fetchJson<GitHubProfile>(`/github/${username}`),
  })

  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ['developer-news'],
    queryFn: () => fetchJson<NewsResponse>('/news'),
  })

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['summary', username],
    queryFn: async () => {
      const res = await fetch(`/api/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username })
      })
      if (!res.ok) throw new Error('Failed to fetch summary')
      return res.json()
    }
  })

  const news = newsData?.articles.slice(0, 5) ?? []
  const topRepos = profile?.repos.slice(0, 3) ?? []
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (window.location.search.includes('tutorial=true')) {
      setShowTutorial(true)
    }
  }, [])
  const heatmap = profile?.heatmap || { grid: Array(52).fill(0).map(() => Array(7).fill(0)), total: 0 }

  // Calculate language percentages
  const languageStack = useMemo(() => {
    if (!profile?.languages) return []
    const entries = Object.entries(profile.languages)
    const totalRepos = entries.reduce((sum, [, count]) => sum + count, 0)
    return entries.slice(0, 3).map(([lang, count]) => ({
      name: lang,
      percentage: Math.round((count / totalRepos) * 100),
      color:
        lang?.toLowerCase() === 'typescript'
          ? '#3178c6'
          : lang?.toLowerCase() === 'javascript'
            ? '#f1e05a'
            : lang?.toLowerCase() === 'python'
              ? '#3572A5'
              : lang?.toLowerCase() === 'html'
                ? '#e34c26'
                : lang?.toLowerCase() === 'css'
                  ? '#563d7c'
                  : 'var(--terminal-green)',
    }))
  }, [profile?.languages])

  if (profileLoading || newsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--terminal-green)', borderTopColor: 'transparent' }}
          />
          <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading dashboard...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto p-6 relative">
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 mx-4 mt-4"
          >
            <div className="bg-gradient-to-r from-[var(--terminal-green)] to-[var(--cursor-amber)] p-1 rounded-xl shadow-2xl">
              <div className="bg-[var(--surface-container)] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--terminal-green)] opacity-10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[var(--cursor-amber)] opacity-10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex-1 z-10">
                  <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Welcome to DevPulse! 🎉</h3>
                  <p className="text-[var(--text-secondary)]">
                    You're currently viewing a demo profile. To track your own stats,
                    <strong className="text-[var(--text-primary)] mx-1">search for your GitHub username</strong>
                    in the top search bar!
                  </p>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="z-10 px-6 py-2 bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] text-[var(--text-primary)] rounded-lg transition-colors font-medium border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--terminal-green)] whitespace-nowrap"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Header ──────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-6 mb-8 pb-8"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="w-20 h-20 rounded overflow-hidden flex-shrink-0"
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          {profile?.profile.avatarUrl ? (
            <img
              src={profile.profile.avatarUrl}
              alt={profile.profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: 'var(--surface-container)', color: 'var(--terminal-green)' }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1
              className="font-geist text-3xl font-semibold m-0 p-0"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              {profile?.profile.name || username}
            </h1>
            {profile?.profile.bio && (
              <span
                className="font-mono text-xs rounded px-2 py-0.5"
                style={{
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--surface-container)',
                }}
              >
                {profile.profile.bio.length > 40
                  ? profile.profile.bio.substring(0, 40) + '...'
                  : profile.profile.bio}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-4 mt-1 flex-wrap"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                group
              </span>
              <span className="font-mono text-sm">
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCount(profile?.profile.followers ?? 0)}
                </span>{' '}
                followers
              </span>
            </div>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                star
              </span>
              <span className="font-mono text-sm">
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCount(
                    profile?.repos.reduce((sum, r) => sum + (r.stars || 0), 0) ?? 0
                  )}
                </span>{' '}
                stars
              </span>
            </div>
            {profile?.profile.location && (
              <>
                <span style={{ color: 'var(--border-subtle)' }}>|</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    location_on
                  </span>
                  <span className="font-mono text-sm">{profile.profile.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Bento Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Contributions Heatmap — 8 cols */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bento-card col-span-1 md:col-span-8 p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="font-geist text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Contributions
            </h2>
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              Last 365 days
            </span>
          </div>
          {/* Heatmap Grid */}
          <div className="flex-1 w-full overflow-x-auto overflow-y-hidden pb-2 custom-scrollbar">
            <div className="flex gap-1 min-w-max">
              {heatmap.grid.map((week: number[], colIdx: number) => (
                <div key={colIdx} className="flex flex-col gap-1">
                  {week.map((level: number, rowIdx: number) => (
                    <div
                      key={rowIdx}
                      className="heatmap-cell"
                      data-level={level || undefined}
                      title={level > 0 ? `${level * 3} contributions` : 'No contributions'}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex justify-between items-center mt-2 pt-2 font-mono text-[10px] uppercase tracking-widest"
            style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <span>{heatmap.total.toLocaleString()} total</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="heatmap-cell" style={{ width: 10, height: 10 }} />
              <div className="heatmap-cell" data-level="1" style={{ width: 10, height: 10 }} />
              <div className="heatmap-cell" data-level="2" style={{ width: 10, height: 10 }} />
              <div className="heatmap-cell" data-level="3" style={{ width: 10, height: 10 }} />
              <div className="heatmap-cell" data-level="4" style={{ width: 10, height: 10 }} />
              <span>More</span>
            </div>
          </div>
        </motion.div>

        {/* Dev News — 4 cols, spans 2 rows */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bento-card col-span-1 md:col-span-4 md:row-span-2 p-6 flex flex-col"
          style={{ maxHeight: '600px' }}
        >
          <div
            className="flex justify-between items-center mb-6 pb-2"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-geist text-base font-semibold flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '20px',
                  color: 'var(--terminal-green)',
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                rss_feed
              </span>
              Dev News
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {news.map((article, i) => (
              <div key={i}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group cursor-pointer block"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span
                      className="font-mono text-[10px] uppercase leading-none rounded px-1.5 py-0.5"
                      style={
                        article.source?.toLowerCase().includes('hn') ||
                          article.source?.toLowerCase().includes('hacker')
                          ? {
                            backgroundColor: 'rgba(255, 102, 0, 0.2)',
                            color: '#ff6600',
                            border: '1px solid rgba(255, 102, 0, 0.3)',
                          }
                          : {
                            backgroundColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(156, 163, 175, 0.3)',
                          }
                      }
                    >
                      {(article.source?.length || 0) > 6
                        ? article.source?.substring(0, 6)
                        : article.source}
                    </span>
                    <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {getTimeAgo(article.publishedAt)}
                    </span>
                  </div>
                  <h3
                    className="text-sm transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--terminal-green)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }}
                  >
                    {article.title}
                  </h3>
                  <div
                    className="flex items-center gap-3 mt-2 font-mono text-xs"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {article.points > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          arrow_upward
                        </span>
                        {article.points}
                      </span>
                    )}
                    {article.commentsCount > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          chat_bubble
                        </span>
                        {article.commentsCount}
                      </span>
                    )}
                  </div>
                </a>
                {i < news.length - 1 && (
                  <div className="w-full h-px mt-4" style={{ backgroundColor: 'var(--border-subtle)' }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Repositories — 4 cols */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="bento-card col-span-1 md:col-span-4 p-6"
        >
          <div
            className="flex justify-between items-center mb-4 pb-2"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-geist text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Top Repositories
            </h2>
          </div>
          <div className="space-y-3">
            {topRepos.map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.2 + i * 0.05 }}
                className="group block p-3 rounded cursor-pointer transition-colors"
                style={{
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--surface-container-low)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-sm font-bold" style={{ color: 'var(--terminal-green)' }}>
                    {repo.name}
                  </h3>
                  <span
                    className="font-mono text-xs rounded px-1.5 py-0.5"
                    style={{
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {repo.visibility || 'Public'}
                  </span>
                </div>
                <p
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {repo.description || 'No description provided.'}
                </p>
                <div
                  className="flex items-center gap-4 font-mono text-[11px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            repo.language?.toLowerCase() === 'typescript'
                              ? '#3178c6'
                              : repo.language?.toLowerCase() === 'javascript'
                                ? '#f1e05a'
                                : repo.language?.toLowerCase() === 'python'
                                  ? '#3572A5'
                                  : repo.language?.toLowerCase() === 'html'
                                    ? '#e34c26'
                                    : 'var(--terminal-green)',
                        }}
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
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Language Stack — 4 cols */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="bento-card col-span-1 md:col-span-4 p-6 flex flex-col"
        >
          <div
            className="flex justify-between items-center mb-6 pb-2"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-geist text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Language Stack
            </h2>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {languageStack.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.08 }}
              >
                <div className="flex justify-between font-mono text-sm mb-2">
                  <span
                    className="flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang.percentage}%</span>
                </div>
                <div
                  className="w-full h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--surface-container-highest)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        i === 0
                          ? 'var(--terminal-green)'
                          : i === 1
                            ? 'var(--terminal-green)'
                            : 'var(--cursor-amber)',
                      opacity: i === 1 ? 0.7 : 1,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Summary Terminal — Full width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="col-span-1 md:col-span-12 mt-4"
        >
          <div
            className="rounded p-4 pl-6 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-container-low)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '2px solid var(--cursor-amber)',
            }}
          >
            {/* Code texture background */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none font-mono text-[10px] leading-tight select-none overflow-hidden"
              style={{
                opacity: 0.03,
                color: 'var(--terminal-green)',
                whiteSpace: 'pre',
              }}
            >
              {`function analyze(data) { return data.map(x => x * 2); } const config = { env: 'prod', debug: false };
import { useMemo, useEffect, useState } from 'react'; export default function App() { return <div>Hello World</div>; }
if (status === 'active') { deploy(); } else { abort(); }`}
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <span
                className="material-symbols-outlined mt-1"
                style={{ color: 'var(--cursor-amber)', fontVariationSettings: "'FILL' 0" }}
              >
                terminal
              </span>
              <div className="flex-1">
                <div
                  className="font-mono text-[11px] tracking-widest uppercase mb-2 flex items-center gap-2"
                  style={{ color: 'var(--cursor-amber)' }}
                >
                  System.AI_Summary
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--cursor-amber)' }}
                  />
                </div>
                <p
                  className="font-mono text-sm leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {'> '}
                  {summaryLoading ? 'Analyzing developer activity...' : summaryData?.summary || 'No AI summary available.'}
                  <span className="blinking-cursor" />
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
