import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import { LectureVideoService } from "./service";
import mediaService from "../../modules/media/service";

const service = new LectureVideoService(mediaService.delete);

export default {
  // -------------------- get media by class --------------------
  getByClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getByClass(
        req.validated.params.id,
        req.validated.query
      );
      return Res.success(res, "Media list fetched", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- save media --------------------
  save: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.save(req.validated.body);
      return Res.created(res, "Media saved", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update media --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.update(
        req.validated.params.id,
        req.validated.body
      );
      return Res.success(res, "Media updated", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- delete media --------------------
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.delete(req.validated.params.id);
      return Res.success(res, "Media deleted", result);
    } catch (error) {
      next(error);
    }
  },
};
