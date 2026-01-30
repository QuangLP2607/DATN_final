import { z } from "zod";
import { objectIdSchema } from "../../../utils/zod";

export const SaveSchema = z
  .object({
    class_id: objectIdSchema,
    video_id: objectIdSchema,
    thumbnail_id: objectIdSchema.optional(),
  })
  .strict();

export type SaveInput = z.infer<typeof SaveSchema>;
