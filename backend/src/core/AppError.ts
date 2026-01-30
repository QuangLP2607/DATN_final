import ResponseCode from "../constants/responseCode";

export default class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: unknown;

  constructor(
    message: string,
    statusCode = ResponseCode.BAD_REQUEST.code,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(
    message = ResponseCode.BAD_REQUEST.defaultMessage,
    details?: unknown
  ) {
    return new AppError(message, ResponseCode.BAD_REQUEST.code, details);
  }

  static unauthorized(
    message = ResponseCode.UNAUTHORIZED.defaultMessage,
    details?: unknown
  ) {
    return new AppError(message, ResponseCode.UNAUTHORIZED.code, details);
  }

  static forbidden(
    message = ResponseCode.FORBIDDEN.defaultMessage,
    details?: unknown
  ) {
    return new AppError(message, ResponseCode.FORBIDDEN.code, details);
  }

  static notFound(
    message = ResponseCode.NOT_FOUND.defaultMessage,
    details?: unknown
  ) {
    return new AppError(message, ResponseCode.NOT_FOUND.code, details);
  }

  static conflict(
    message = ResponseCode.CONFLICT.defaultMessage,
    details?: unknown
  ) {
    return new AppError(message, ResponseCode.CONFLICT.code, details);
  }

  static serverError(
    message = ResponseCode.SERVER_ERROR.defaultMessage,
    details?: unknown
  ) {
    return new AppError(message, ResponseCode.SERVER_ERROR.code, details);
  }
}
