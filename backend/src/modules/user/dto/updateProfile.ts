import { z } from "zod";
import { Role, IAdmin, IStudent, ITeacher } from "../../../interfaces/user";
import {
  objectIdSchema,
  stringSchema,
  usernameSchema,
  phoneSchema,
  isoDateSchema,
} from "../../../utils/zod";

export const UpdateProfileSchema = z
  .object({
    username: usernameSchema().optional(),
    full_name: stringSchema("Name").optional(),
    avatar_id: objectIdSchema.optional(),
    phone: phoneSchema.optional(),
    address: stringSchema("Address").optional(),
    japaneseLevel: z.enum(["Không", "N5", "N4", "N3", "N2", "N1"]).optional(),
    note: stringSchema("Note").optional(),
    dob: isoDateSchema.optional(),
  })
  .strict();

export type UpdateProfileInputMap = {
  ADMIN: Partial<IAdmin>;
  STUDENT: Partial<IStudent>;
  TEACHER: Partial<ITeacher>;
};

export type UpdateProfileInput<R extends Role> = UpdateProfileInputMap[R];
