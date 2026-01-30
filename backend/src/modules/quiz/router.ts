import { Router } from "express";
import Controller from "./controller";
import { validateZod } from "../../middlewares/validateZod";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { paramIdSchema } from "../../utils/zod";
import { SearchQuizSchema } from "./dto/searchQuiz";
import { CreateQuizSchema } from "./dto/createQuiz";
import { CreateQuestionsSchema } from "./dto/createQuestions";
import { UpdateQuizSchema } from "./dto/updateQuiz";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validateZod({ query: SearchQuizSchema }),
  Controller.search,
);

router.get(
  "/:id",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.getDetail,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  validateZod({ body: CreateQuizSchema }),
  Controller.create,
);

router.put(
  "/:id/questions",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  validateZod({ params: paramIdSchema(), body: CreateQuestionsSchema }),
  Controller.updateQuestions,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  validateZod({
    params: paramIdSchema(),
    body: UpdateQuizSchema,
  }),
  Controller.update,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  validateZod({ params: paramIdSchema() }),
  Controller.delete,
);

export default router;
