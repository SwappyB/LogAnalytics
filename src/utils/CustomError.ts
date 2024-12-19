export class CustomError extends Error {
  public statusCode: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode || 500

    // Ensures the stack trace reflects the correct class
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}

export const createError = (message: string, statusCode: number) => {
  return new CustomError(message, statusCode)
}
