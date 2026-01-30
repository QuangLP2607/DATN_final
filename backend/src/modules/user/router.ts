import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "../../middlewares/auth";
import { roleMiddleware } from "../../middlewares/role";
import { validateZod } from "../../middlewares/validateZod";
import { paramIdSchema } from "../../utils/zod";
import { ChangePasswordSchema } from "./dto/changePassword";
import { SearchUsersSchema } from "./dto/searchUsers";
import { UpdateProfileSchema } from "./dto/updateProfile";

const router = Router();

router.get("/me", authMiddleware, Controller.getProfile);

router.patch(
  "/me",
  authMiddleware,
  validateZod({ body: UpdateProfileSchema }),
  Controller.updateProfile
);

router.patch(
  "/me/password",
  authMiddleware,
  validateZod({ body: ChangePasswordSchema }),
  Controller.changePassword
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: paramIdSchema() }),
  Controller.getUserById
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ query: SearchUsersSchema }),
  Controller.searchUsers
);

export default router;
