import express from 'express'
import History from '../models/history.model.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Get personal activity history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ date: 1 }) // Chronological order
      .limit(30) // Last 30 snapshots

    res.json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

export default router
