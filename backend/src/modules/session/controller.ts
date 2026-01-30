import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";

export default {
  // -------------------- search sessions --------------------
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessions = await Service.search(req.validated.query);
      return Res.success(res, "Get sessions successfully", sessions);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create session --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule_id = await Service.create(req.validated.body);
      return Res.created(res, "Session created successfully", schedule_id);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update session --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.update(req.validated.params.id, req.validated.body);
      return Res.success(res, "Session updated successfully");
    } catch (error) {
      next(error);
    }
  },
};
