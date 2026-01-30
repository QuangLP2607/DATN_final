import { z } from "zod";
import { objectIdSchema, timeStringSchema } from "../../../utils/zod";

export const CreateScheduleSchema = z
  .object({
    class_id: objectIdSchema,
    day_of_week: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    start_time: timeStringSchema,
    end_time: timeStringSchema,
    note: z.string().optional(),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "start_time must be less than end_time",
    path: ["start_time"],
  })
  .strict();

export type CreateScheduleInput = z.infer<typeof CreateScheduleSchema>;
