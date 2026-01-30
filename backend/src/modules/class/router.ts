import { Router } from "express";
import Controller from "./controller";
import { validateZod } from "../../middlewares/validateZod";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { paramIdSchema } from "../../utils/zod";
import { SearchClassesSchema } from "./dto/searchClasses";
import { CreateClassSchema } from "./dto/createClass";
import { UpdateClassSchema } from "./dto/updateClass";
import { AddTeachersSchema } from "./dto/addTeacher";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validateZod({ query: SearchClassesSchema }),
  Controller.search
);

router.get("/me", authMiddleware, Controller.getMy);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ body: CreateClassSchema }),
  Controller.create
);

router.post(
  "/:id/teachers",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: paramIdSchema(), body: AddTeachersSchema }),
  Controller.addTeachers
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: paramIdSchema(), body: UpdateClassSchema }),
  Controller.update
);

export default router;
