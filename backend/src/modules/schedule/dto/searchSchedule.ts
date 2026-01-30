import { z } from "zod";
import { objectIdSchema, isoDateSchema } from "../../../utils/zod";
import { ISchedule } from "../../../interfaces/schedule";
import { IClass } from "../../../interfaces/class";

export const SearchScheduleSchema = z
  .object({
    class_id: z.union([objectIdSchema, z.array(objectIdSchema)]).optional(),
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
  })
  .refine((d) => !d.from || !d.to || d.from <= d.to, {
    message: "`from` must be before or equal to `to`",
    path: ["to"],
  })
  .strict();

export type SearchScheduleInput = z.infer<typeof SearchScheduleSchema>;

export type ClassWithSchedules = Pick<IClass, "id" | "name"> & {
  schedules: ISchedule[];
};

export interface SearchScheduleResponse {
  classes: ClassWithSchedules[];
}
