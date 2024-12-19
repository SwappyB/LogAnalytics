import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../../src/middlewares/asyncHandler'

describe('Async Handler', () => {
  it('should call the next function with an error when an exception occurs', async () => {
    const mockHandler = jest.fn().mockRejectedValue(new Error('Test error'))
    const wrappedHandler = asyncHandler(mockHandler)

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn() as NextFunction

    await wrappedHandler(req, res, next)

    expect(next).toHaveBeenCalledWith(new Error('Test error'))
  })

  it('should call the handler normally when no exception occurs', async () => {
    const mockHandler = jest.fn().mockResolvedValue('Success')
    const wrappedHandler = asyncHandler(mockHandler)

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn() as NextFunction

    await wrappedHandler(req, res, next)

    expect(mockHandler).toHaveBeenCalledWith(req, res, next)
    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })
})
