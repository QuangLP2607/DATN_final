import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";

const router = Router();

router.get(
  "/overview",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  Controller.getOverview
);

router.get(
  "/students-enrollment",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  Controller.getStudentEnrollments
);

export default router;
