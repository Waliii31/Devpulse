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

  const news = newsData?.articles.slice(0, 6) ?? []
  const topLanguages = profile ? Object.entries(profile.languages).slice(0, 4) : []

  if (profileLoading || newsLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-6 text-(--text-secondary)">
        Loading dashboard...
      </div>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-[28px] border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-[0_40px_80px_rgba(0,0,0,0.14)"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--surface) border border-(--border-subtle)">
                <img src={profile?.profile.avatarUrl} alt={profile?.profile.name} className="h-16 w-16 rounded-2xl" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-(--terminal-green)">Profile</p>
                <h2 className="mt-2 text-3xl font-semibold text-(--text-primary)">{profile?.profile.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-(--text-secondary)">{profile?.profile.bio || 'Developer profile'}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Followers', value: profile?.profile.followers ?? 0 },
                { label: 'Repos', value: profile?.profile.publicRepos ?? 0 },
                { label: 'Activity', value: profile?.activity.length ?? 0 },
              ].map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-(--border-subtle) bg-(--surface) p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-(--text-secondary)">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-(--text-primary)">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="rounded-[28px] border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-[0_40px_80px_rgba(0,0,0,0.14)"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-(--text-primary)">Top languages</h3>
            <span className="rounded-full bg-(--surface) px-3 py-1 text-xs uppercase tracking-[0.3em] text-(--text-secondary)">Active</span>
          </div>
          <div className="mt-6 space-y-4">
            {topLanguages.map(([language, count], index) => (
              <motion.div
                key={language}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between text-sm text-(--text-secondary)">
                  <span>{language}</span>
                  <span>{count} repos</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--surface)">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, count * 12)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-(--terminal-green)"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="rounded-[28px] border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-[0_40px_80px_rgba(0,0,0,0.14)"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-(--text-primary)">Recent repositories</h3>
              <p className="mt-2 text-sm text-(--text-secondary)">A quick list of your latest repositories and current stars.</p>
            </div>
            <button className="rounded-full border border-(--border-subtle) bg-(--surface) px-4 py-2 text-sm text-(--text-secondary) transition hover:border-(--terminal-green) hover:text-(--text-primary)">
              View all
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {profile?.repos.slice(0, 5).map((repo, index) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group block rounded-3xl border border-(--border-subtle) bg-(--surface) p-5 transition hover:border-(--terminal-green) hover:bg-(--surface-container-low)"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-semibold text-(--text-primary)">{repo.name}</h4>
                    <p className="mt-2 text-sm text-(--text-secondary)">{repo.description || 'No description provided.'}</p>
                  </div>
                  <span className="rounded-full bg-(--terminal-green)/10] px-3 py-1 text-sm text-(--terminal-green)">★ {repo.stars}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="rounded-[28px] border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-[0_40px_80px_rgba(0,0,0,0.14)"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-(--text-primary)">Developer news</h3>
            <span className="rounded-full bg-(--surface) px-3 py-1 text-xs uppercase tracking-[0.3em] text-(--text-secondary)">Live</span>
          </div>
          <div className="mt-6 space-y-3">
            {news.map((article, index) => (
              <motion.a
                key={article.title}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08 + index * 0.05 }}
                className="group block rounded-3xl border border-(--border-subtle) bg-(--surface) p-4 transition hover:border-(--terminal-green) hover:bg-(--surface-container-low)"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-(--terminal-green)">{article.source}</span>
                  <span className="text-xs text-(--text-secondary)">{article.author}</span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-(--text-primary)">{article.title}</h4>
                <p className="mt-2 text-xs text-(--text-secondary)">{article.points} points • {article.commentsCount} comments</p>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </section>
  )
}
