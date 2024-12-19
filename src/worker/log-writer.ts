import logQueue from '../services/queueService'
import ApiLog from '../models/ApiLog'
import logger from '../utils/logger'

const BATCH_SIZE = 100
const logsBuffer: any[] = []

/**
 * Initiate the worker process for the bull queue to process and write logs in batches
 */
export const workerInstantiator = () => {
  // Function to process logs in batches
  const processLogs = async () => {
    if (logsBuffer.length === 0) return

    const logsToInsert = logsBuffer.splice(0, BATCH_SIZE)

    try {
      await ApiLog.insertMany(logsToInsert, { ordered: false })
      logger.info(`Inserted ${logsToInsert.length} logs into MongoDB.`)
    } catch (error) {
      if (error instanceof Error) logger.error(`Error inserting logs: ${error.message}`)
    }
  }

  // Start the worker
  logQueue.process(async (job) => {
    try {
      logsBuffer.push(job.data)

      console.log(logsBuffer, BATCH_SIZE)

      // Process logs when buffer reaches batch size
      if (logsBuffer.length >= BATCH_SIZE) {
        await processLogs()
      }
    } catch (error) {
      if (error instanceof Error) logger.error(`Error processing job: ${error.message}`)
      throw error
    }
  })

  // Periodic flushing for leftover logs
  setInterval(async () => {
    if (logsBuffer.length > 0) {
      await processLogs()
    }
  }, 5000)

  logger.info('Worker is running.')
}
