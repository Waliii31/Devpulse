import express from 'express'
import User from '../models/user.model.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Update user preferences (e.g., aiTonePreference)
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const { aiTonePreference } = req.body

    if (aiTonePreference && !['friendly', 'motivational', 'technical', 'recruiter'].includes(aiTonePreference)) {
      return res.status(400).json({ error: 'Invalid AI tone preference' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (aiTonePreference) {
      user.aiTonePreference = aiTonePreference
    }

    await user.save()

    res.json({
      success: true,
      user: {
        email: user.email,
        favoriteUsernames: user.favoriteUsernames,
        aiTonePreference: user.aiTonePreference,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
