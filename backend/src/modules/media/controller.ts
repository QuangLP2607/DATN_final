import { Request, Response, NextFunction } from "express";
import Service from "./service";
import { Res } from "../../core/response";

export default {
  // -------------------- create upload url --------------------
  createUploadUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.createUploadUrl(req.validated.body);
      return Res.success(res, "Upload URL generated", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get view url --------------------
  getViewUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.getViewUrl(req.validated.params.id);
      return Res.success(res, "View URL generated", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get download url --------------------
  getDownloadUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.getDownloadUrl(req.validated.params.id);
      return Res.success(res, "Download URL generated", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.create(req.user!.id, req.validated.body);
      return Res.created(res, "Media created", result);
    } catch (err) {
      next(err);
    }
  },

  // -------------------- update --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.update(
        req.validated.params.id,
        req.validated.body
      );
      return Res.success(res, "Media updated", result);
    } catch (err) {
      next(err);
    }
  },

  // -------------------- delete --------------------
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.delete(req.validated.params.id);
      return Res.success(res, "Media deleted");
    } catch (err) {
      next(err);
    }
  },
};
