import { Response } from "express";
import ResponseCode from "../constants/responseCode";

type ResponseData<T> = {
  code: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: unknown;
};

const sendResponse = <T>(
  res: Response,
  { code, success, message, data, meta }: ResponseData<T>
): Response => {
  const body: Record<string, unknown> = {
    code,
    success,
    message,
    time: new Date().toISOString(),
  };

  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;

  return res.status(code).json(body);
};

const makeResponse =
  (code: number, successState: boolean, defaultMessage: string) =>
  <T>(res: Response, message = defaultMessage, data?: T, meta?: unknown) =>
    sendResponse<T>(res, { code, success: successState, message, data, meta });

// ===========================================
// Response object
// ===========================================
export const Res = {
  // 2xx
  success: makeResponse(
    ResponseCode.OK.code,
    true,
    ResponseCode.OK.defaultMessage
  ),
  created: makeResponse(
    ResponseCode.CREATED.code,
    true,
    ResponseCode.CREATED.defaultMessage
  ),
  accepted: makeResponse(
    ResponseCode.ACCEPTED.code,
    true,
    ResponseCode.ACCEPTED.defaultMessage
  ),
  noContent: (res: Response) => res.status(ResponseCode.NO_CONTENT.code).send(),

  // 4xx
  badRequest: makeResponse(
    ResponseCode.BAD_REQUEST.code,
    false,
    ResponseCode.BAD_REQUEST.defaultMessage
  ),
  unauthorized: makeResponse(
    ResponseCode.UNAUTHORIZED.code,
    false,
    ResponseCode.UNAUTHORIZED.defaultMessage
  ),
  forbidden: makeResponse(
    ResponseCode.FORBIDDEN.code,
    false,
    ResponseCode.FORBIDDEN.defaultMessage
  ),
  notFound: makeResponse(
    ResponseCode.NOT_FOUND.code,
    false,
    ResponseCode.NOT_FOUND.defaultMessage
  ),
  conflict: makeResponse(
    ResponseCode.CONFLICT.code,
    false,
    ResponseCode.CONFLICT.defaultMessage
  ),
  tooManyRequests: makeResponse(
    ResponseCode.TOO_MANY_REQUESTS.code,
    false,
    ResponseCode.TOO_MANY_REQUESTS.defaultMessage
  ),

  // 5xx
  serverError: makeResponse(
    ResponseCode.SERVER_ERROR.code,
    false,
    ResponseCode.SERVER_ERROR.defaultMessage
  ),
  serviceUnavailable: makeResponse(
    ResponseCode.SERVICE_UNAVAILABLE.code,
    false,
    ResponseCode.SERVICE_UNAVAILABLE.defaultMessage
  ),
};
