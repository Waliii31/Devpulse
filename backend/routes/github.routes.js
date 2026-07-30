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
    return res.json(cached)
  }

  try {
    const freshData = await fetchGitHubData(username)

    cached = await CachedUser.findOneAndUpdate(
      { username },
      { ...freshData, fetchedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.json(cached)
  } catch (error) {
    if (error.message.includes('404')) {
      return res.status(404).json({ error: 'GitHub user not found' })
    }

    return res.status(500).json({ error: error.message })
  }
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
