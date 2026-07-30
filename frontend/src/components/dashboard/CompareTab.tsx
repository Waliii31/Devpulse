import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

interface GitHubStats {
  username: string
  profile: {
    name: string
    bio: string
    followers: number
    publicRepos: number
    avatarUrl: string
  }
  activity: { date: string; count: number }[]
  languages: Record<string, number>
}

export function CompareTab() {
  const [usernames, setUsernames] = useState<string[]>(['', '', ''])

  const handleUsernameChange = (index: number, value: string) => {
    const newUsernames = [...usernames]
    newUsernames[index] = value
    setUsernames(newUsernames)
  }

  const validUsernames = usernames.filter(u => u.trim() !== '')

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['compare', validUsernames],
    queryFn: async () => {
      if (validUsernames.length === 0) return []
      const promises = validUsernames.map(async (user) => {
        const res = await fetch(`/api/github/${user}`)
        if (!res.ok) return null
        return res.json() as Promise<GitHubStats>
      })
      const results = await Promise.all(promises)
      return results.filter((r): r is GitHubStats => r !== null)
    },
    enabled: validUsernames.length > 0,
  })

  // Colors for each profile
  const colors = ['var(--primary)', 'var(--cursor-amber)', '#3b82f6']

  const maxCommits = Math.max(1, ...profiles.map(p => 
    p.activity.reduce((acc, curr) => acc + curr.count, 0)
  ))
  const maxRepos = Math.max(1, ...profiles.map(p => p.profile.publicRepos))
  const maxFollowers = Math.max(1, ...profiles.map(p => p.profile.followers))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-6xl mx-auto flex flex-col gap-8"
    >
      <header>
        <h2 className="font-geist text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Compare Profiles</h2>
        <p className="font-mono text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Enter up to 3 GitHub usernames to compare their activity side-by-side.
        </p>
      </header>

      {/* Inputs */}
      <section className="flex gap-4">
        {usernames.map((username, index) => (
          <div key={index} className="flex-1 relative">
            <input
              type="text"
              placeholder={`Username ${index + 1}`}
              value={username}
              onChange={(e) => handleUsernameChange(index, e.target.value)}
              className="w-full bg-transparent font-mono text-sm px-4 py-2 rounded focus:outline-none transition-colors"
              style={{
                border: `1px solid ${colors[index]}`,
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface-container-low)'
              }}
            />
          </div>
        ))}
      </section>

      {isLoading && <div className="font-mono text-sm text-center py-10" style={{ color: 'var(--text-secondary)' }}>Fetching data...</div>}

      {!isLoading && profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Key Metrics Chart */}
          <div className="bento-card p-6 flex flex-col gap-4 col-span-1 md:col-span-3">
            <h3 className="font-mono text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--text-primary)' }}>Metrics Comparison</h3>
            <div className="grid grid-cols-3 gap-8 mt-4">
              
              {/* Total Commits Bar */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs text-center" style={{ color: 'var(--text-secondary)' }}>Total Commits</span>
                <div className="flex items-end justify-center gap-2 h-40">
                  {profiles.map((p, i) => {
                    const commits = p.activity.reduce((acc, curr) => acc + curr.count, 0)
                    const height = (commits / maxCommits) * 100
                    return (
                      <div key={p.username} className="w-12 rounded-t relative group flex justify-center" style={{ height: `${height}%`, minHeight: '4px', backgroundColor: colors[i] }}>
                        <span className="absolute -top-6 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                          {commits}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Repos Bar */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs text-center" style={{ color: 'var(--text-secondary)' }}>Public Repos</span>
                <div className="flex items-end justify-center gap-2 h-40">
                  {profiles.map((p, i) => {
                    const height = (p.profile.publicRepos / maxRepos) * 100
                    return (
                      <div key={p.username} className="w-12 rounded-t relative group flex justify-center" style={{ height: `${height}%`, minHeight: '4px', backgroundColor: colors[i] }}>
                        <span className="absolute -top-6 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                          {p.profile.publicRepos}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Followers Bar */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs text-center" style={{ color: 'var(--text-secondary)' }}>Followers</span>
                <div className="flex items-end justify-center gap-2 h-40">
                  {profiles.map((p, i) => {
                    const height = (p.profile.followers / maxFollowers) * 100
                    return (
                      <div key={p.username} className="w-12 rounded-t relative group flex justify-center" style={{ height: `${height}%`, minHeight: '4px', backgroundColor: colors[i] }}>
                        <span className="absolute -top-6 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                          {p.profile.followers}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              {profiles.map((p, i) => (
                <div key={p.username} className="flex items-center gap-2 font-mono text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }}></div>
                  <span style={{ color: 'var(--text-primary)' }}>{p.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Cards */}
          {profiles.map((p, i) => (
            <div key={p.username} className="bento-card p-6 flex flex-col gap-4" style={{ borderTop: `4px solid ${colors[i]}` }}>
              <div className="flex items-center gap-4">
                <img src={p.profile.avatarUrl} alt={p.username} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-geist font-semibold" style={{ color: 'var(--text-primary)' }}>{p.profile.name || p.username}</h4>
                  <a href={`https://github.com/${p.username}`} target="_blank" rel="noreferrer" className="font-mono text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    @{p.username}
                  </a>
                </div>
              </div>
              <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                {p.profile.bio || 'No bio'}
              </p>
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-primary)' }}>Top Language</span>
                <span className="font-mono text-sm" style={{ color: colors[i] }}>
                  {Object.entries(p.languages || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'}
                </span>
              </div>
            </div>
          ))}

        </div>
      )}
    </motion.div>
  )
}
