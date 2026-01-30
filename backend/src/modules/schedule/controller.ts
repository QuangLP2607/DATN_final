import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";

export default {
  // -------------------- search schedules --------------------
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.search(req.validated.body);
      return Res.success(res, "Get schedules successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create schedule --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.create(req.validated.body);
      return Res.created(res, "Schedule created successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update schedule --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.update(req.validated.params.id, req.validated.body);
      return Res.success(res, "Schedule updated successfully");
    } catch (error) {
      next(error);
    }
  },

  // -------------------- delete schedule --------------------
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.remove(req.validated.params.id);
      return Res.success(res, "Schedule deleted successfully");
    } catch (error) {
      next(error);
    }
  },
};
