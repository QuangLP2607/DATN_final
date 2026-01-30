import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const CreateMediaSchema = z
  .object({
    file_key: stringSchema("File key"),
    file_name: stringSchema("File name"),
  })
  .strict();

export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
