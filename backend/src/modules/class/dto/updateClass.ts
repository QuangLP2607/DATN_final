import { z } from "zod";
import {
  objectIdSchema,
  stringSchema,
  isoDateSchema,
} from "../../../utils/zod";

export const UpdateClassSchema = z
  .object({
    name: stringSchema("Name", 3, 50).optional(),
    course_id: objectIdSchema.optional(),
    description: stringSchema("Description").optional(),
    start_date: isoDateSchema.optional(),
    end_date: isoDateSchema.optional(),
  })
  .strict();

export type UpdateClassInput = z.infer<typeof UpdateClassSchema>;
