import express from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { validateZod } from "../../middlewares/validateZod";
import { roleMiddleware } from "../../middlewares/role";
import { CreateLiveRoomSchema } from "./dto/create";
import { paramIdSchema } from "../../utils/zod";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ body: CreateLiveRoomSchema }),
  Controller.createRoom,
);

router.post(
  "/:id/join",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.joinRoom,
);

router.post(
  "/:id/leave",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.leaveRoom,
);

router.post(
  "/:id/ping",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.pingRoom,
);

router.get(
  "/class/:id/status",
  authMiddleware,
  validateZod({ params: paramIdSchema("id") }),
  Controller.getClassLiveStatus,
);

export default router;
