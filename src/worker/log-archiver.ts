import ApiLog from '../models/ApiLog'
import ApiLogArchive from '../models/ApiLogArchive'
import logger from '../utils/logger'

/**
 * Remove logs older than 30 days and move them to ApiLogArcheive Collection
 */
export const LogArchiver = async () => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - 30)

  const session = await ApiLog.startSession()
  try {
    const oldLogs = await ApiLog.find({ timestamp: { $lt: cutoffDate } }).session(session)

    await ApiLogArchive.insertMany(oldLogs, { session })
    await ApiLog.deleteMany({ timestamp: { $lt: cutoffDate } }).session(session)

    await session.commitTransaction()
    logger.info(`${oldLogs.length} logs archieved successfully`)
  } catch (error) {
    await session.abortTransaction()
    logger.error(`Something went wrong with log archiever ${error instanceof Error ? error.message : error}`)
  }
}
