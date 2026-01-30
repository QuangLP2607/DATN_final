import { Request, Response, NextFunction } from "express";
import logger from "../core/logger";
import AppError from "../core/AppError";
import { Res } from "../core/response";
import ResponseCode from "../constants/responseCode";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const isAppError = err instanceof AppError;
  const statusCode: number = isAppError
    ? err.statusCode
    : ResponseCode.SERVER_ERROR.code;
  const message: string = isAppError
    ? err.message
    : ResponseCode.SERVER_ERROR.defaultMessage;
  const details = isAppError ? (err as AppError).details : undefined;

  // Logging: include details and stack for 5xx
  const logPayload: any = {
    method: req.method,
    url: req.originalUrl,
    message,
    details,
    time: timestamp,
  };

  if (statusCode >= 500) {
    logPayload.stack = err.stack;
    logger.error(logPayload);
  } else if (statusCode >= 400) {
    logger.warn(logPayload);
  } else {
    logger.info(logPayload);
  }

  // Use centralized response helpers (keeps JSON format consistent)
  switch (statusCode) {
    case ResponseCode.BAD_REQUEST.code:
      return Res.badRequest(res, message, details);
    case ResponseCode.UNAUTHORIZED.code:
      return Res.unauthorized(res, message, details);
    case ResponseCode.FORBIDDEN.code:
      return Res.forbidden(res, message, details);
    case ResponseCode.NOT_FOUND.code:
      return Res.notFound(res, message, details);
    case ResponseCode.CONFLICT.code:
      return Res.conflict(res, message, details);
    case ResponseCode.TOO_MANY_REQUESTS.code:
      return Res.tooManyRequests(res, message, details);
    case ResponseCode.SERVICE_UNAVAILABLE.code:
      return Res.serviceUnavailable(res, message, details);
    default:
      return Res.serverError(res, message, details);
  }
};

export default errorHandler;
