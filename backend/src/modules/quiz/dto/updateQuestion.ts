import { z } from "zod";

export const UpdateQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        content: z.string().min(1),
        options: z.array(z.string().min(1)).min(2),
        correctOptionIndex: z.number().min(0),
        order: z.number().min(0),
      })
    )
    .min(1),
});

export type UpdateQuestionsInput = z.infer<typeof UpdateQuestionsSchema>;
