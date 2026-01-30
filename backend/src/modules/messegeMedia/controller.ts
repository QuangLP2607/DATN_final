import { Request, Response, NextFunction } from "express";
import Service from "./service";
import { Res } from "../../core/response";

export default {
  // -------------------- create --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.create(req.validated.body);
      return Res.created(res, "Message media created", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- delete --------------------
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.delete(req.validated.params);
      return Res.success(res, "Message media deleted", result);
    } catch (error) {
      next(error);
    }
  },
};
