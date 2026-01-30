import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";

export default {
  // -------------------- get my enrollments (student) --------------------
  getMy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await Service.getMy(user.id);
      return Res.success(res, "Get my enrollments successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get enrollment by class --------------------
  getByClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.getByClass(req.validated.params.id);
      return Res.success(res, "Search enrollments successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- search enrollment by student --------------------
  searchByStudent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.searchByStudent(req.validated.params.id);
      return Res.success(res, "Search enrollments successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- enroll --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.create(req.validated.body);
      return Res.created(res, "Enrolled successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- unenroll (rare case) --------------------
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.remove(req.validated.params.id);
      return Res.success(res, "Unenrolled successfully");
    } catch (error) {
      next(error);
    }
  },
};
