import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { validateZod } from "../../middlewares/validateZod";
import { paramIdSchema } from "../../utils/zod";
import { SearchCoursesSchema } from "./dto/searchCourses";
import { CreateCourseSchema } from "./dto/createCourse";
import { UpdateCourseSchema } from "./dto/updateCourse";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validateZod({ query: SearchCoursesSchema }),
  Controller.searchCourses
);

router.get(
  "/:id",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.getCourseById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ body: CreateCourseSchema }),
  Controller.createCourse
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: paramIdSchema(), body: UpdateCourseSchema }),
  Controller.updateCourse
);

export default router;
