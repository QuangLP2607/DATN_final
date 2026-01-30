import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";
import { CreateMessageMediaSchema } from "./dto/create";
import { DeleteMessageMediaSchema } from "./dto/delete";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateZod({ body: CreateMessageMediaSchema }),
  Controller.create
);

router.delete(
  "/:message_id/:media_id",
  authMiddleware,
  validateZod({ params: DeleteMessageMediaSchema }),
  Controller.delete
);

export default router;
