import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: false, // Optional for OAuth users
  },
  githubId: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Only enforce uniqueness if the field exists
  },
  favoriteUsernames: {
    type: [String],
    default: [],
  },
  aiTonePreference: {
    type: String,
    enum: ['friendly', 'motivational', 'technical', 'recruiter'],
    default: 'friendly',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
