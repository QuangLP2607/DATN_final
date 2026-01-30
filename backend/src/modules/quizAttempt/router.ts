import { Router } from "express";
import Controller from "./controller";
import { validateZod } from "../../middlewares/validateZod";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { paramIdSchema } from "../../utils/zod";
import { SubmitQuizAttemptSchema } from "./dto/submitQuizAttempt";

const router = Router();

router.get(
  "/quiz/:quizId",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  validateZod({ params: paramIdSchema("quizId") }),
  Controller.getAttempts,
);

router.post(
  "/quiz/:quizId",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  validateZod({
    params: paramIdSchema("quizId"),
    body: SubmitQuizAttemptSchema,
  }),
  Controller.submit,
);

router.get(
  "/:attemptId",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  validateZod({ params: paramIdSchema("attemptId") }),
  Controller.getAttemptDetail,
);

export default router;
