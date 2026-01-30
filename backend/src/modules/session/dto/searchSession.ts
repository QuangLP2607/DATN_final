import { z } from "zod";
import { objectIdSchema, timeStringSchema } from "../../../utils/zod";

export const SearchSessionSchema = z.object({
  class_id: objectIdSchema.optional(),
  from: timeStringSchema.optional(),
  to: timeStringSchema.optional(),
  status: z.enum(["upcoming", "active", "finished", "cancelled"]).optional(),
  week_number: z.number().int().min(1).optional(),
});

export type SearchSessionInput = z.infer<typeof SearchSessionSchema>;
