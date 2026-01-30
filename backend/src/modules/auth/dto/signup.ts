import { z } from "zod";
import { Roles, Role } from "../../../interfaces/user";
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "../../../utils/zod";

const roleEnum = z.enum(Object.values(Roles) as [Role, ...Role[]]);

export const SignupSchema = z
  .object({
    role: roleEnum,
    username: usernameSchema(),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export type SignupInput = z.infer<typeof SignupSchema>;
