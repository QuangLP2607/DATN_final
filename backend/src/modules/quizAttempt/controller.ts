import { Request, Response, NextFunction } from "express";
import { Res } from "../../core/response";
import QuizAttemptService from "./service";

export default {
  // -------------------- submit attempt --------------------
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.validated.params.quizId;
      const studentId = req.user!.id;

      const result = await QuizAttemptService.submitAttempt(
        studentId,
        quizId,
        req.validated.body,
      );

      return Res.success(res, "Quiz submitted successfully", result);
    } catch (err) {
      next(err);
    }
  },

  // -------------------- get attempts --------------------
  async getAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.validated.params.quizId;
      const studentId = req.user!.id;

      const result = await QuizAttemptService.getAttemptsByStudent(
        quizId,
        studentId,
      );

      return Res.success(res, "Quiz attempts fetched successfully", result);
    } catch (err) {
      next(err);
    }
  },

  // -------------------- get attempt detail --------------------
  async getAttemptDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const attemptId = req.validated.params.attemptId;
      const studentId = req.user!.id;

      const result = await QuizAttemptService.getAttemptDetail(
        attemptId,
        studentId,
      );

      return Res.success(res, "Quiz attempt detail fetched", result);
    } catch (err) {
      next(err);
    }
  },
};
