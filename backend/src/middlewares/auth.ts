import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { Res } from "../core/response";
import { AuthUser } from "../interfaces/user";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & AuthUser;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return Res.unauthorized(res, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload & AuthUser;

    req.user = decoded;
    next();
  } catch {
    return Res.unauthorized(res, "Invalid token");
  }
}
