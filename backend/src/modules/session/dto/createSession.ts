import { z } from "zod";
import {
  objectIdSchema,
  stringSchema,
  timeStringSchema,
  isoDateSchema,
} from "../../../utils/zod";

export const CreateSessionSchema = z.object({
  schedule_id: objectIdSchema,
  week_number: z.number().int().min(1),
  date: isoDateSchema,
  start_time: timeStringSchema,
  end_time: timeStringSchema,
  note: stringSchema("Note"),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
