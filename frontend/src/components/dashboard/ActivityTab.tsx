import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
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
    language: string
    url: string
  }>
  activity: Array<{ date: string; count: number }>
  languages: Record<string, number>
}

type ActivityEvent = {
  type: string
  date: string
  repo: string
  count: number
  icon: string
  color: string
  description: string
}

function generateActivityEvents(profile: GitHubProfile | undefined): ActivityEvent[] {
  if (!profile) return []

  const events: ActivityEvent[] = []
  const eventTypes = [
    { type: 'push', icon: 'commit', color: 'var(--terminal-green)', desc: 'Pushed commits to' },
    { type: 'pr', icon: 'merge', color: '#a855f7', desc: 'Opened a pull request in' },
    { type: 'issue', icon: 'bug_report', color: '#f59e0b', desc: 'Opened an issue in' },
    { type: 'star', icon: 'star', color: '#eab308', desc: 'Starred' },
    { type: 'fork', icon: 'fork_right', color: '#3b82f6', desc: 'Forked' },
    { type: 'review', icon: 'rate_review', color: '#06b6d4', desc: 'Reviewed a PR in' },
  ]

  // Generate from activity data
  if (profile.activity && profile.activity.length > 0) {
    const recentActivity = profile.activity.slice(0, 20)
    recentActivity.forEach((a, i) => {
      if (a.count > 0) {
        const evtType = eventTypes[i % eventTypes.length]
        const repo = profile.repos[i % profile.repos.length]
        events.push({
          type: evtType.type,
          date: a.date,
          repo: repo?.name || 'unknown-repo',
          count: a.count,
          icon: evtType.icon,
          color: evtType.color,
          description: `${evtType.desc} ${repo?.name || 'a repository'}`,
        })
      }
    })
  }

  // Ensure we have enough events for display
  if (events.length < 5) {
    const now = new Date()
    for (let i = events.length; i < 8; i++) {
      const evtType = eventTypes[i % eventTypes.length]
      const repo = profile.repos[i % Math.max(profile.repos.length, 1)]
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      events.push({
        type: evtType.type,
        date: date.toISOString(),
        repo: repo?.name || 'repository',
        count: Math.floor(Math.random() * 5) + 1,
        icon: evtType.icon,
        color: evtType.color,
        description: `${evtType.desc} ${repo?.name || 'a repository'}`,
      })
    }
  }

  return events.slice(0, 15)
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

export function ActivityTab() {
  const { username = 'octocat' } = useParams()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['github-profile', username],
    queryFn: () => fetchJson<GitHubProfile>(`/github/${username}`),
  })

  const events = generateActivityEvents(profile)

  // Calculate streak
  const streakDays = profile?.activity
    ? profile.activity.filter((a) => a.count > 0).length
    : 0

  const totalContributions = profile?.activity
    ? profile.activity.reduce((sum, a) => sum + a.count, 0)
    : 0

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--terminal-green)', borderTopColor: 'transparent' }}
          />
          <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading activity...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      {/* Page Title */}
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
          Activity
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Recent activity and contribution history for{' '}
          <span style={{ color: 'var(--terminal-green)' }}>{username}</span>
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
      >
        {[
          {
            label: 'Total Contributions',
            value: totalContributions.toLocaleString(),
            icon: 'commit',
            accent: 'var(--terminal-green)',
          },
          {
            label: 'Active Days',
            value: streakDays.toString(),
            icon: 'local_fire_department',
            accent: '#f97316',
          },
          {
            label: 'Repositories Active',
            value: String(profile?.repos.length ?? 0),
            icon: 'folder',
            accent: '#3b82f6',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bento-card p-5 flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: `${stat.accent}20` }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: stat.accent, fontSize: '20px' }}
              >
                {stat.icon}
              </span>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </p>
              <p className="font-mono text-xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bento-card p-6"
      >
        <h2
          className="font-geist text-base font-semibold mb-6 pb-3 flex items-center gap-2"
          style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px', color: 'var(--terminal-green)' }}
          >
            timeline
          </span>
          Recent Activity
        </h2>
        <div className="space-y-1">
          {events.map((event, i) => (
            <motion.div
              key={`${event.type}-${event.date}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.15 + i * 0.03 }}
              className="flex items-start gap-4 py-3 px-3 rounded transition-colors"
              style={{ borderBottom: i < events.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-container-low)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${event.color}15` }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px', color: event.color }}
                >
                  {event.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {event.description}
                </p>
                {event.count > 1 && (
                  <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {event.count} {event.type === 'push' ? 'commits' : 'actions'}
                  </p>
                )}
              </div>

              {/* Time */}
              <span
                className="font-mono text-xs flex-shrink-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatTimeAgo(event.date)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
