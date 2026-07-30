import mongoose from 'mongoose'

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  githubUsername: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  snapshot: {
    followers: Number,
    publicRepos: Number,
    totalCommits: Number,
    topLanguage: String,
  }
})

// Index to easily query a user's history over time
HistorySchema.index({ user: 1, date: -1 })

const History = mongoose.model('History', HistorySchema)
export default History
