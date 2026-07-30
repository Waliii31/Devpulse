import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  if (!process.env.MONGO_DB) {
    throw new Error('MONGO_DB environment variable is required')
  }

  try {
    await mongoose.connect(process.env.MONGO_DB)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
