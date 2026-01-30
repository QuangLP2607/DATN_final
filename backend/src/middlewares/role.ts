import { Request, Response, NextFunction } from "express";
import { Res } from "../core/response";
import { Role } from "../interfaces/user";

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return Res.forbidden(
        res,
        "You do not have permission to access this resource"
      );
    }

    next();
  };
};
