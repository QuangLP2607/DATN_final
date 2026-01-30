import { z } from "zod";
import { objectIdSchema } from "../../../utils/zod";

export const AddTeachersSchema = z
  .object({
    teacher_ids: z.array(objectIdSchema).min(1),
  })
  .strict();

export type AddTeachersInput = z.infer<typeof AddTeachersSchema>;
