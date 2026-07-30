import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required')
  }

  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    return res.status(409).json({ error: 'Email is already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
  })

  const token = createToken(user)

  return res.status(201).json({
    token,
    user: {
      email: user.email,
      favoriteUsernames: user.favoriteUsernames,
    },
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash)

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = createToken(user)

  return res.json({
    token,
    user: {
      email: user.email,
      favoriteUsernames: user.favoriteUsernames,
    },
  })
})

router.get('/me', authMiddleware, async (req, res) => {
  return res.json({
    email: req.user.email,
    favoriteUsernames: req.user.favoriteUsernames,
  })
})

router.post('/logout', authMiddleware, (req, res) => {
  return res.json({ success: true })
})

export default router
