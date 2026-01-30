import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const CreateCourseSchema = z
  .object({
    code: stringSchema("Code", 1, 20),
    name: stringSchema("Name", 3, 50),
    description: stringSchema("Description").optional(),
    status: z.enum(["active", "inactive"]),
  })
  .strict();

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
