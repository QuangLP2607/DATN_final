import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { validateZod } from "../../middlewares/validateZod";
import { paramIdSchema } from "../../utils/zod";
import { CreateEnrollmentSchema } from "./dto/createEnrollment";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  Controller.getMy
);

router.get(
  "/class/:id",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.getByClass
);

router.get(
  "/student/:id",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.searchByStudent
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ body: CreateEnrollmentSchema }),
  Controller.create
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: paramIdSchema() }),
  Controller.remove
);

export default router;
