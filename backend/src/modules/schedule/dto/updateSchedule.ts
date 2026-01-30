import { z } from "zod";
import { timeStringSchema } from "../../../utils/zod";

export const UpdateScheduleSchema = z
  .object({
    day_of_week: z
      .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
      .optional(),
    start_time: timeStringSchema.optional(),
    end_time: timeStringSchema.optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) =>
      data.start_time === undefined ||
      data.end_time === undefined ||
      data.start_time < data.end_time,
    {
      message: "start_time must be less than end_time",
    }
  )
  .strict();

export type UpdateScheduleInput = z.infer<typeof UpdateScheduleSchema>;
