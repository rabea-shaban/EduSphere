/**
 * Custom error class for standardized API errors.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: any[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errorCode: string = "ERROR",
    details?: any[],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "بيانات المدخلات غير صحيحة", details?: any[]) {
    super(422, message, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "يرجى تسجيل الدخول للوصول لهذه الخدمة") {
    super(401, message, "UNAUTHENTICATED");
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء") {
    super(403, message, "UNAUTHORIZED");
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "المورد المطلوب غير موجود") {
    super(404, message, "NOT_FOUND");
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "توجد مواجهة أو بيانات مكررة بالخادم") {
    super(409, message, "CONFLICT");
  }
}
