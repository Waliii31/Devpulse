import mongoose from "mongoose";

const CachedUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  profile: {
    avatarUrl: String,
    name: String,
    bio: String,
    followers: Number,
    publicRepos: Number,
  },
  repos: [
    {
      name: String,
      description: String,
      stars: Number,
      language: String,
      url: String,
    },
  ],
  activity: [
    {
      date: String,
      count: Number,
    },
  ],
  languages: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  heatmap: {
    grid: [[Number]],
    total: Number,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if cache is older than maxAgeMs (default 1 hour)
CachedUserSchema.methods.isStale = function (maxAgeMs = 60 * 60 * 1000) {
  return Date.now() - this.fetchedAt.getTime() > maxAgeMs;
};

const CachedUser = mongoose.model("CachedUser", CachedUserSchema);

export default CachedUser;
