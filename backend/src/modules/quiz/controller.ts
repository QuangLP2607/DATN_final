import { Request, Response, NextFunction } from "express";
import { QuizService } from "./service";
import { Res } from "../../core/response";
import mediaService from "../../modules/media/service";

const service = new QuizService(mediaService.delete);

export default {
  // -------------------- search quiz --------------------
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.search(req.validated.query);
      return Res.success(res, "Quizzes fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get quiz detail --------------------
  getDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quiz = await service.getDetail(req.validated.params.id);
      return Res.success(res, "Quiz detail fetched successfully", quiz);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create quiz --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.create(req.validated.body);
      return Res.success(res, "Quiz created successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- add questions --------------------
  updateQuestions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.updateQuestions(
        req.validated.params.id,
        req.validated.body,
      );
      return Res.success(res, "Questions updated successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update quiz --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.update(
        req.validated.params.id,
        req.validated.body,
      );
      return Res.success(res, "Quiz updated successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- delete quiz --------------------
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.delete(req.validated.params.id);
      return Res.success(res, "Quiz deleted");
    } catch (err) {
      next(err);
    }
  },
};
