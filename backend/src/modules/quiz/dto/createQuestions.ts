import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const CreateQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        content: stringSchema("Content"),
        options: z.array(stringSchema("ptions")).min(2),
        correctOptionIndex: z.number().min(0),
      }),
    )
    .min(1),
});

export type CreateQuestionsInput = z.infer<typeof CreateQuestionsSchema>;
