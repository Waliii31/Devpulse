import express from 'express'
import CachedUser from '../models/cachedUser.model.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const router = express.Router()
const GROQ_URL = 'https://api.groq.com/v1/generation'

const buildPrompt = (cachedUser, tone) => {
  const topLanguages = Object.entries(cachedUser.languages || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([language, count]) => `${language}: ${count}`)
    .join(', ') || 'No languages available'

  const repoCount = cachedUser.repos?.length || 0
  const activitySummary = cachedUser.activity?.length
    ? `${cachedUser.activity.length} recent activity entries, with latest event on ${cachedUser.activity[cachedUser.activity.length - 1].date}`
    : 'No recent activity data available'

  let toneInstruction = 'friendly but professional tone'
  if (tone === 'motivational') toneInstruction = 'highly motivational, encouraging, and uplifting tone'
  if (tone === 'technical') toneInstruction = 'blunt, highly technical, and analytical tone focusing on engineering metrics'
  if (tone === 'recruiter') toneInstruction = 'recruiter-friendly tone, highlighting employable skills and consistency'

  return `Write a 2-3 sentence summary of this GitHub user in a ${toneInstruction}. Keep it concise.

Profile:
- Name: ${cachedUser.profile.name}
- Bio: ${cachedUser.profile.bio || 'No bio provided'}
- Followers: ${cachedUser.profile.followers}
- Public repos: ${cachedUser.profile.publicRepos}

Top languages:
${topLanguages}

Repos fetched: ${repoCount}
Recent activity: ${activitySummary}

Focus on the user profile, main repository/language strengths, and the kind of contribution pattern the activity suggests.`
}

const callGroq = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192', // updating to a reliable groq model ID
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Groq API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

router.post('/', async (req, res) => {
  const { username, stats } = req.body

  if (!username && !stats) {
    return res.status(400).json({ error: 'Username or stats object is required' })
  }

  try {
    let tonePreference = 'friendly'

    // Optional auth check to get tone preference
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (user && user.aiTonePreference) {
          tonePreference = user.aiTonePreference
        }
      } catch (err) {
        // Ignore auth errors for this route, just fallback to default tone
      }
    }

    let cachedUser = stats

    if (!cachedUser) {
      const normalized = username.trim().toLowerCase()
      const stored = await CachedUser.findOne({ username: normalized })

      if (!stored) {
        return res.status(404).json({ error: 'Cached GitHub data not found. Fetch /api/github/:username first.' })
      }

      cachedUser = stored
    }

    const prompt = buildPrompt(cachedUser, tonePreference)
    const summary = await callGroq(prompt)

    return res.json({ summary })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default router
