import { z } from "zod";
import { passwordSchema } from "../../../utils/zod";

export const ChangePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .strict();

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
