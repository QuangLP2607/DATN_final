import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";

export default {
  // -------------------- search classes --------------------
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.search(req.validated.query);
      return Res.success(res, "Classes fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get my classes --------------------
  getMy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await Service.getMy(user);
      return Res.success(res, "My classes retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create class --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.create(req.validated.body);
      return Res.success(res, "Class created successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create class --------------------
  addTeachers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.addTeachers(
        req.validated.params.id,
        req.validated.body
      );

      return Res.success(res, "Add teachers successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update classes --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.update(req.validated.params.id, req.validated.body);
      return Res.success(res, "Class updated successfully");
    } catch (error) {
      next(error);
    }
  },
};
