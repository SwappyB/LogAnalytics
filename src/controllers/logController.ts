import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler'
import * as logService from '../services/logService'

export const logRequest = asyncHandler(async (req: Request, res: Response) => {
  const { endpoint, method, userId } = req.body
  const log = await logService.createLog({ endpoint, method, userId })
  res.status(201).json(log)
})

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await logService.getSummary()
  res.json(summary)
})

export const getUserReport = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params
  const report = await logService.getUserReport(userId)
  res.json(report)
})

export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const report = await logService.getLogs(req.query)
  res.json(report)
})
