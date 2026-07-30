import express from 'express'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  const { username } = req.body

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'GitHub username is required' })
  }

  const normalized = username.trim().toLowerCase()

  if (!normalized) {
    return res.status(400).json({ error: 'GitHub username is required' })
  }

  if (!req.user.favoriteUsernames.includes(normalized)) {
    req.user.favoriteUsernames.push(normalized)
    await req.user.save()
  }

  return res.status(200).json({ favoriteUsernames: req.user.favoriteUsernames })
})

router.get('/', authMiddleware, async (req, res) => {
  return res.json({ favoriteUsernames: req.user.favoriteUsernames })
})

router.delete('/:username', authMiddleware, async (req, res) => {
  const username = req.params.username?.trim().toLowerCase()

  if (!username) {
    return res.status(400).json({ error: 'GitHub username is required' })
  }

  req.user.favoriteUsernames = req.user.favoriteUsernames.filter((item) => item !== username)
  await req.user.save()

  return res.json({ favoriteUsernames: req.user.favoriteUsernames })
})

export default router
