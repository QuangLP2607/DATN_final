import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const UpdateMediaSchema = z
  .object({
    file_name: stringSchema("File name").optional(),
  })
  .strict();

export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;
