// Import the mongoose module
import mongoose from 'mongoose'
import { config } from '../configs'
import logger from '../utils/logger'

const { DB_URI, NODE_ENV } = config.env

const options: mongoose.ConnectOptions = {
  autoIndex: false
}

/**
 * Connect to the mongodb database
 * @returns mongoose connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  try {
    // Set Mongoose Debug Mode as `false` in production
    mongoose.set('debug', NODE_ENV === 'development')
    mongoose.set('strictQuery', false)

    await mongoose.connect(DB_URI, options)
    logger.info('Connected to MongoDB')

    // Get the default connection
    const db: mongoose.Connection = mongoose.connection
    return db
  } catch (error) {
    logger.error('MongoDB Connection Error: ', error)
    process.exit(1)
  }
}

export default connectDB
