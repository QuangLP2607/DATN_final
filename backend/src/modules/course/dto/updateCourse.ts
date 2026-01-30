import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const UpdateCourseSchema = z
  .object({
    code: stringSchema("Code", 1, 20).optional(),
    name: stringSchema("Name", 3, 50).optional(),
    description: stringSchema("Description").optional(),
    status: z.enum(["active", "inactive"]).optional(),
  })
  .strict();

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
