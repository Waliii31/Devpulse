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

router.get('/github/url', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  const redirectUri = 'http://localhost:5174/auth/github/callback' // Update for production if needed
  
  if (!clientId) {
    return res.status(500).json({ error: 'GitHub OAuth is not configured' })
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`
  return res.json({ url })
})

router.post('/github/callback', async (req, res) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' })
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || 'Failed to authenticate with GitHub' })
    }

    const accessToken = tokenData.access_token

    // 2. Fetch user profile from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const userData = await userResponse.json()

    // 3. Fetch user emails from GitHub (as primary email might be hidden)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const emailsData = await emailsResponse.json()
    const primaryEmail = emailsData.find((e) => e.primary)?.email || emailsData[0]?.email

    if (!primaryEmail) {
      return res.status(400).json({ error: 'No email address found associated with this GitHub account' })
    }

    const normalizedEmail = primaryEmail.toLowerCase().trim()
    const githubId = userData.id.toString()

    // 4. Find or create user
    let user = await User.findOne({ email: normalizedEmail })

    if (user) {
      // User exists, just update githubId if not already set
      if (!user.githubId) {
        user.githubId = githubId
        await user.save()
      }
    } else {
      // Create new user (no passwordHash required)
      user = await User.create({
        email: normalizedEmail,
        githubId,
      })
    }

    const token = createToken(user)

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        favoriteUsernames: user.favoriteUsernames,
      },
    })
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return res.status(500).json({ error: 'Internal server error during authentication' })
  }
})

export default router
