const ResponseCode = {
  // ---- 2xx Success ----
  OK: { code: 200, defaultMessage: "OK" },
  CREATED: { code: 201, defaultMessage: "Created successfully" },
  ACCEPTED: { code: 202, defaultMessage: "Accepted" },
  NO_CONTENT: { code: 204, defaultMessage: "No Content" },

  // ---- 4xx Client Errors ----
  BAD_REQUEST: { code: 400, defaultMessage: "Bad Request" },
  UNAUTHORIZED: { code: 401, defaultMessage: "Unauthorized" },
  PAYMENT_REQUIRED: { code: 402, defaultMessage: "Payment Required" },
  FORBIDDEN: { code: 403, defaultMessage: "Forbidden" },
  NOT_FOUND: { code: 404, defaultMessage: "Not Found" },
  METHOD_NOT_ALLOWED: { code: 405, defaultMessage: "Method Not Allowed" },
  NOT_ACCEPTABLE: { code: 406, defaultMessage: "Not Acceptable" },
  REQUEST_TIMEOUT: { code: 408, defaultMessage: "Request Timeout" },
  CONFLICT: { code: 409, defaultMessage: "Conflict" },
  GONE: { code: 410, defaultMessage: "Gone" },
  PAYLOAD_TOO_LARGE: { code: 413, defaultMessage: "Payload Too Large" },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 415,
    defaultMessage: "Unsupported Media Type",
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    defaultMessage: "Unprocessable Entity",
  },
  TOO_MANY_REQUESTS: { code: 429, defaultMessage: "Too Many Requests" },

  // ---- 5xx Server Errors ----
  SERVER_ERROR: { code: 500, defaultMessage: "Internal Server Error" },
  NOT_IMPLEMENTED: { code: 501, defaultMessage: "Not Implemented" },
  BAD_GATEWAY: { code: 502, defaultMessage: "Bad Gateway" },
  SERVICE_UNAVAILABLE: { code: 503, defaultMessage: "Service Unavailable" },
  GATEWAY_TIMEOUT: { code: 504, defaultMessage: "Gateway Timeout" },
};

export default ResponseCode;
