import rateLimit from 'express-rate-limit'

/**
 * Rate limiter => 100 requests per user per minute
 */
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this UserID, please try again after a minute.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.userId
})

export default rateLimiter
