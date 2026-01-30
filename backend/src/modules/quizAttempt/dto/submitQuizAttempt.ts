import { z } from "zod";
import { objectIdSchema } from "../../../utils/zod";

export const SubmitQuizAttemptSchema = z
  .object({
    answers: z
      .array(
        z
          .object({
            question_id: objectIdSchema,
            selectedIndex: z.number().int().min(0),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export type SubmitQuizAttemptInput = z.infer<typeof SubmitQuizAttemptSchema>;
