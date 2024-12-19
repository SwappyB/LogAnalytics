import { Router } from 'express'
import { logRequest, getSummary, getUserReport, getLogs } from '../controllers/logController'
import rateLimiter from '../middlewares/rateLimiter'

const router = Router()

// Create new log route
router.post('/logs', rateLimiter, logRequest)

// API Usage summary
router.get('/analytics/summary', getSummary)

// API User activity report
router.get('/analytics/user/:userId', getUserReport)

// Get log data
router.get('/logs', getLogs)

export default router
