import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { validateZod } from "../../middlewares/validateZod";
import { paramIdSchema } from "../../utils/zod";
import { SaveSchema } from "./dto/create";
import { UpdateSchema } from "./dto/update";
import { GetByClassSchema } from "./dto/getByClass";
const router = Router();

router.get(
  "/class/:id",
  authMiddleware,
  validateZod({ params: paramIdSchema(), query: GetByClassSchema }),
  Controller.getByClass
);

router.post(
  "/save",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ body: SaveSchema }),
  Controller.save
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({
    params: paramIdSchema(),
    body: UpdateSchema,
  }),
  Controller.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ params: paramIdSchema() }),
  Controller.delete
);

export default router;
