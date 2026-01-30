import { Router } from "express";
import Controller from "./controller";
import { validateZod } from "../../middlewares/validateZod";
import { SignupSchema } from "./dto/signup";
import { LoginSchema } from "./dto/login";

const router = Router();

router.post("/signup", validateZod({ body: SignupSchema }), Controller.signup);

router.post("/login", validateZod({ body: LoginSchema }), Controller.login);

router.post("/logout", Controller.logout);

router.post("/refresh-token", Controller.refreshToken);

export default router;
