import express from 'express'
import CachedNews from '../models/cachedNews.model.js'

const router = express.Router()
const HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json'
const DEVTO_ARTICLES = 'https://dev.to/api/articles?per_page=20'

const fetchJson = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`)
  }

  return response.json()
}

const fetchHackerNews = async () => {
  const topIds = await fetchJson(HN_TOP_STORIES)
  const ids = Array.isArray(topIds) ? topIds.slice(0, 20) : []

  const items = await Promise.all(
    ids.map(async (id) => {
      const item = await fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      return {
        title: item.title || 'Untitled',
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        points: item.score || 0,
        commentsCount: item.descendants || 0,
        author: item.by || 'unknown',
        publishedAt: item.time ? new Date(item.time * 1000) : new Date(),
        source: 'hn',
      }
    })
  )

  return items.filter(Boolean)
}

const fetchDevToNews = async () => {
  const articles = await fetchJson(DEVTO_ARTICLES)

  return articles.map((article) => ({
    title: article.title || 'Untitled',
    url: article.url,
    points: article.public_reactions_count || 0,
    commentsCount: article.comments_count || 0,
    author: article.user?.username || 'unknown',
    publishedAt: article.published_at ? new Date(article.published_at) : new Date(),
    source: 'devto',
  }))
}

const getSourceData = async (source) => {
  const cached = await CachedNews.findOne({ source })

  if (cached && !cached.isStale()) {
    return cached
  }

  const articles = source === 'hn' ? await fetchHackerNews() : await fetchDevToNews()
  const fetchedAt = new Date()

  const updated = await CachedNews.findOneAndUpdate(
    { source },
    { source, articles, fetchedAt },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  return updated
}

router.get('/', async (req, res) => {
  try {
    const [hnData, devtoData] = await Promise.all([getSourceData('hn'), getSourceData('devto')])
    const merged = [...(hnData.articles || []), ...(devtoData.articles || [])].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    )

    return res.json({ articles: merged })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default router
