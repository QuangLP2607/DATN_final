import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { validateZod } from "../../middlewares/validateZod";
import { CreateUploadUrlSchema } from "./dto/createUploadUrl";
import { paramIdSchema } from "../../utils/zod";
import { CreateMediaSchema } from "./dto/create";
import { UpdateMediaSchema } from "./dto/update";

const router = Router();

router.post(
  "/upload-url",
  authMiddleware,
  validateZod({ body: CreateUploadUrlSchema }),
  Controller.createUploadUrl
);

router.get(
  "/:id/view-url",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.getViewUrl
);

router.get(
  "/:id/download-url",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.getDownloadUrl
);

router.post(
  "/",
  authMiddleware,
  validateZod({ body: CreateMediaSchema }),
  Controller.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({
    params: paramIdSchema(),
    body: UpdateMediaSchema,
  }),
  Controller.update
);

router.delete(
  "/:id",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.delete
);

export default router;
