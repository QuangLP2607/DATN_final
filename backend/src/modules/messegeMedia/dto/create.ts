import { z } from "zod";

export const CreateMessageMediaSchema = z
  .object({
    message_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    media_ids: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
  })
  .strict();

export type CreateMessageMediaInput = z.infer<typeof CreateMessageMediaSchema>;
