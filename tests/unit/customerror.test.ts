import { CustomError } from '../../src/utils/CustomError'

describe('CustomError', () => {
  it('should create an error with the provided message and status code', () => {
    const error = new CustomError('Test error message', 400)

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Test error message')
    expect(error.statusCode).toBe(400)
  })

  it('should default to status code 500 if not provided', () => {
    const error = new CustomError('Test error message')

    expect(error.statusCode).toBe(500)
  })
})
