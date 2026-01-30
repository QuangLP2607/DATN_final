import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import Service from "./service";

export default {
  // -------------------- get overview --------------------
  getOverview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.getOverview();
      return Res.success(res, "Overview fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get student enrollments by year/month --------------------
  getStudentEnrollments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await Service.getStudentEnrollments();
      return Res.success(
        res,
        "Student enrollment statistics by year and month fetched successfully",
        data
      );
    } catch (error) {
      next(error);
    }
  },
};
