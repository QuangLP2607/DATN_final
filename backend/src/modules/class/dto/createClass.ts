import { z } from "zod";
import { objectIdSchema, stringSchema } from "../../../utils/zod";

export const CreateClassSchema = z
  .object({
    course_id: objectIdSchema,
    name: stringSchema("Name", 3, 50),
    description: stringSchema("Description").optional(),
  })
  .strict();

export type CreateClassInput = z.infer<typeof CreateClassSchema>;
