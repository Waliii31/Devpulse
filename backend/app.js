import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import githubRoutes from './routes/github.routes.js'
import newsRoutes from './routes/news.routes.js'
import summaryRoutes from './routes/summary.routes.js'
import favoritesRoutes from './routes/favorites.routes.js'
import healthRoutes from './routes/health.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/summary', summaryRoutes)
app.use('/api/users/favorites', favoritesRoutes)
app.use('/api/health', healthRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`)
  })
})