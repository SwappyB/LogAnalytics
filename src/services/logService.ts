import ApiLog from '../models/ApiLog'
import logQueue from './queueService'
import { CreateLogDTO } from '../types'

/**
 * Add the new log to the bull queue, to be added to the database later
 * @param data endpoint, method, userId, timestamp => data needed to create a new log
 * @returns success message
 */
export const createLog = async (data: CreateLogDTO) => {
  const { endpoint, method, userId, timestamp } = data

  if (!endpoint || !method || !userId) {
    return { error: 'Missing required fields' }
  }

  const log = { endpoint, method, userId, timestamp: timestamp || new Date() }

  // Add log to the Bull queue to be added in batches later
  await logQueue.add(log, { removeOnComplete: true, removeOnFail: true })

  return { message: 'Log queued for processing' }
}

/**
 * Summary of all the API usage, all the endpoints and the number of requests made
 * @returns An array of all the endpoint with total requests to that endpoint and most accessed endpoint
 */
export const getSummary = async () => {
  const result = await ApiLog.aggregate([{ $group: { _id: '$endpoint', totalRequests: { $sum: 1 } } }, { $sort: { totalRequests: -1 } }])
  const mostAccessed = result[0]?._id || null
  return { totalRequestsPerEndpoint: result, mostAccessed }
}

/**
 * Give the API usage summary for respective user.
 * @param userId User's id for which the summary is to be created
 * @returns total requests by the user and all the endpoints with request count
 */
export const getUserReport = async (userId: string) => {
  const result = await ApiLog.aggregate([
    { $match: { userId } },
    { $group: { _id: '$endpoint', requestCount: { $sum: 1 } } },
    {
      $project: {
        _id: 0,
        endpoint: '$_id',
        totalRequests: '$requestCount'
      }
    }
  ])
  const totalRequests = result.reduce((sum, r) => sum + r.totalRequests, 0)
  return { totalRequests, endpoints: result }
}

/**
 * Use filtering and pagination to give the logs as per the query
 * @param query query containing endpoint, userid, page, limit, and a startdate and enddate for the API logs
 * @returns return the number of logs matching the filtering criteria as well as the page number and limit
 */
export const getLogs = async (query: any) => {
  const { startDate, endDate, endpoint, userId, page = 1, limit = 10 } = query
  let filters: any = {}
  if (startDate && endDate) filters.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) }
  if (endpoint) filters.endpoint = endpoint
  if (userId) filters.userId = userId

  const logs = await ApiLog.aggregate([
    { $match: filters },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    {
      $project: {
        id: '$_id',
        endpoint: '$endpoint',
        method: '$method',
        userId: '$userId',
        timestamp: '$timestamp',
        _id: 0
      }
    }
  ])
  return logs
}
