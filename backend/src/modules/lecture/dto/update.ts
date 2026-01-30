import { z } from "zod";
import { objectIdSchema } from "../../../utils/zod";

export const UpdateSchema = z
  .object({
    video_id: objectIdSchema.optional(),
    thumbnail_id: objectIdSchema.optional(),
  })
  .strict();

export type UpdateInput = z.infer<typeof UpdateSchema>;
