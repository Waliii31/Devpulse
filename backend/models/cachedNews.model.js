import mongoose from "mongoose";

const CachedNewsSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ["hn", "devto"],
    required: true,
    unique: true,
  },
  articles: [
    {
      title: String,
      url: String,
      points: Number,
      commentsCount: Number,
      author: String,
      publishedAt: Date,
    },
  ],
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if cache is older than maxAgeMs (default 30 minutes)
CachedNewsSchema.methods.isStale = function (maxAgeMs = 30 * 60 * 1000) {
  return Date.now() - this.fetchedAt.getTime() > maxAgeMs;
};

const CachedNews = mongoose.model("CachedNews", CachedNewsSchema);

export default CachedNews;
