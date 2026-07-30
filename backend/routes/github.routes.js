import express from 'express'
import CachedUser from '../models/cachedUser.model.js'

const router = express.Router()
const BASE_URL = 'https://api.github.com'

const createGitHubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: createGitHubHeaders() })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GitHub API error ${response.status}: ${errorText}`)
  }

  return response.json()
}

const normalizeUsername = (value) => value.trim().toLowerCase()

const buildLanguages = (repos) => {
  return repos.reduce((totals, repo) => {
    if (!repo.language) {
      return totals
    }

    totals[repo.language] = (totals[repo.language] || 0) + 1
    return totals
  }, {})
}

const buildActivity = (events) => {
  const counts = events.reduce((map, event) => {
    const date = new Date(event.created_at).toISOString().slice(0, 10)
    map[date] = (map[date] || 0) + 1
    return map
  }, {})

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

const fetchGitHubData = async (username) => {
  const profile = await fetchJson(`${BASE_URL}/users/${username}`)
  const repos = await fetchJson(`${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`)
  const events = await fetchJson(`${BASE_URL}/users/${username}/events/public?per_page=100`)

  let heatmap = { grid: Array(52).fill(0).map(() => Array(7).fill(0)), total: 0 }
  try {
    const vercelRes = await fetch(`https://github-contributions.vercel.app/api/v1/${username}`)
    if (vercelRes.ok) {
      const vercelData = await vercelRes.json()
      if (vercelData.contributions && vercelData.years) {
        const today = new Date().toISOString().slice(0, 10)
        let startIndex = vercelData.contributions.findIndex((c) => c.date <= today)
        if (startIndex === -1) startIndex = 0

        const lastYear = vercelData.contributions.slice(startIndex, startIndex + 364)
        lastYear.reverse()

        const grid = []
        for (let i = 0; i < lastYear.length; i += 7) {
          const weekChunk = lastYear.slice(i, i + 7)
          grid.push(weekChunk.map((day) => parseInt(day.intensity, 10) || 0))
        }

        const total = vercelData.years.reduce((sum, y) => sum + y.total, 0)
        heatmap = { grid, total }
      }
    }
  } catch (err) {
    console.error('Failed to fetch heatmap API:', err)
  }

  return {
    username,
    profile: {
      avatarUrl: profile.avatar_url,
      name: profile.name || profile.login,
      bio: profile.bio || '',
      followers: profile.followers || 0,
      publicRepos: profile.public_repos || 0,
    },
    repos: repos.map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      language: repo.language || 'Unknown',
      url: repo.html_url,
    })),
    activity: buildActivity(events),
    languages: buildLanguages(repos),
    heatmap,
    fetchedAt: new Date(),
  }
}

router.get('/:username', async (req, res) => {
  const username = normalizeUsername(req.params.username)

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }

  let cached = await CachedUser.findOne({ username })

  if (cached && !cached.isStale()) {
    // If we have cached data, we can still record a snapshot
  } else {
    try {
      const freshData = await fetchGitHubData(username)
      cached = await CachedUser.findOneAndUpdate(
        { username },
        { ...freshData, fetchedAt: new Date() },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    } catch (error) {
      if (error.message.includes('404')) {
        return res.status(404).json({ error: 'GitHub user not found' })
      }
      return res.status(500).json({ error: error.message })
    }
  }

  // --- Snapshot Logic ---
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const jwt = await import('jsonwebtoken')
      const User = (await import('../models/user.model.js')).default
      const History = (await import('../models/history.model.js')).default

      const decoded = jwt.default.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)
      
      // Check if this is the user's own profile (rough heuristic based on email prefix or githubId)
      const userEmailPrefix = user.email.split('@')[0].toLowerCase()
      if (user && (userEmailPrefix === username || req.query.isSelf === 'true')) {
        // Find top language
        const topLanguage = Object.entries(cached.languages || {})
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'

        // Check if we already snapped today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const existingSnapshot = await History.findOne({
          user: user._id,
          date: { $gte: today }
        })

        if (!existingSnapshot) {
          await History.create({
            user: user._id,
            githubUsername: username,
            snapshot: {
              followers: cached.profile?.followers || 0,
              publicRepos: cached.profile?.publicRepos || 0,
              totalCommits: cached.activity?.reduce((acc, curr) => acc + curr.count, 0) || 0,
              topLanguage,
            }
          })
        }
      }
    }
  } catch (err) {
    // Silently ignore auth/snapshot errors to not block the main response
    console.error('Snapshot error:', err)
  }

  return res.json(cached)
})

router.delete('/:username', async (req, res) => {
  const username = normalizeUsername(req.params.username)

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }

  const deleted = await CachedUser.findOneAndDelete({ username })

  if (!deleted) {
    return res.status(404).json({ error: 'Cached user not found' })
  }

  return res.json({ success: true })
})

export default router
