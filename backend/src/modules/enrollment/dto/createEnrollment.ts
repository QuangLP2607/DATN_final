import { z } from "zod";
import { objectIdSchema } from "../../../utils/zod";

export const CreateEnrollmentSchema = z
  .object({
    class_id: objectIdSchema,
    student_id: objectIdSchema,
  })
  .strict();

export type CreateEnrollmentInput = z.infer<typeof CreateEnrollmentSchema>;
