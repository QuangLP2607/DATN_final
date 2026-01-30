import { Request, Response } from "express";
import logger from "../core/logger";
import { Res } from "../core/response";

const notFoundHandler = (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  logger.warn({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    time: timestamp,
  });

  return Res.badRequest(res, `API ${req.method} ${req.originalUrl} not found`);
};

export default notFoundHandler;
