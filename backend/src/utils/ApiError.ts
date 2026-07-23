/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: any[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors?: any[],
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Identifies known/operational errors vs system bugs

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
