import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/CustomError'
import { config } from '../configs'

/**
 * An error handler function that returns appropriate status code and message when unhandled errors are encountered.
 * @param err - An error instance
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Next function to pass control to the next middleware.
 */
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  // Hide error message in production
  if (config.env.NODE_ENV.toLowerCase() === 'production') message = 'Something went wrong'
  res.status(statusCode).json({ success: false, message })
}

export default errorHandler
