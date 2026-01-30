import { z } from "zod";
import {
  objectIdSchema,
  stringSchema,
  isoDateSchema,
  timeStringSchema,
} from "../../../utils/zod";

export const CreateQuizSchema = z
  .object({
    title: stringSchema("Title"),
    class_id: objectIdSchema,
    description: z.string().optional(),
    thumbnail_id: objectIdSchema.optional(),
    startDate: isoDateSchema.optional(),
    endDate: isoDateSchema.optional(),
    duration: timeStringSchema.optional(),
  })
  .strict();

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
