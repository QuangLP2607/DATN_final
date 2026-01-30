import { z } from "zod";
import { objectIdSchema, mimeTypeSchema } from "../../../utils/zod";

export const UploadPurpose = [
  "lecture/video",
  "video/thumbnail",
  "quiz/thumbnail",
  "user/avatar",
  "chat/img",
  "chat/video",
  "chat/file",
] as const;

export const CreateUploadUrlSchema = z
  .object({
    domain_id: objectIdSchema,
    file_type: mimeTypeSchema,
    purpose: z.enum(UploadPurpose),
  })
  .strict();

export type CreateUploadUrlInput = z.infer<typeof CreateUploadUrlSchema>;
