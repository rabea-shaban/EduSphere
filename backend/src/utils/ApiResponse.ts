/**
 * Standard API Response structure.
 */
export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data?: T;

  constructor(statusCode: number, data?: T, message: string = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}
