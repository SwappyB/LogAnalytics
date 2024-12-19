import Queue from 'bull'
import logger from '../utils/logger'

import { config } from '../configs'

const logQueue = new Queue('logQueue', config.env.REDIS_URI)

// Log queue events
logQueue.on('completed', (job) => {
  logger.info(`Job ${job.id} completed.`)
})

// Log queue errors
logQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`)
})

export default logQueue
