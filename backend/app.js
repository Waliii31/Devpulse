import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import githubRoutes from './routes/github.routes.js'
import newsRoutes from './routes/news.routes.js'
import summaryRoutes from './routes/summary.routes.js'
import favoritesRoutes from './routes/favorites.routes.js'
import userRoutes from './routes/user.routes.js'
import historyRoutes from './routes/history.routes.js'
import healthRoutes from './routes/health.routes.js'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/summary', summaryRoutes)
app.use('/api/users/favorites', favoritesRoutes)
app.use('/api/users', userRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/health', healthRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`)
  })
})