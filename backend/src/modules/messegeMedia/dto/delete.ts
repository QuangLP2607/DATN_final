import { z } from "zod";

export const DeleteMessageMediaSchema = z
  .object({
    message_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    media_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  })
  .strict();

export type DeleteMessageMediaInput = z.infer<typeof DeleteMessageMediaSchema>;
