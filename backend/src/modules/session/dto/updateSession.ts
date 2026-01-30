import { z } from "zod";
import {
  stringSchema,
  timeStringSchema,
  isoDateSchema,
} from "../../../utils/zod";

export const UpdateSessionSchema = z
  .object({
    date: isoDateSchema,
    start_time: timeStringSchema,
    end_time: timeStringSchema,
    status: z.enum(["upcoming", "active", "finished", "cancelled"]).optional(),
    note: stringSchema("Note"),
  })
  .strict();

export type UpdateSessionInput = z.infer<typeof UpdateSessionSchema>;
