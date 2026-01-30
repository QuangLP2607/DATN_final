import { z } from "zod";
import { QUIZ_STATUSES } from "../../../interfaces/quiz";

export const UpdateQuizSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnail_id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.number().min(0).optional(),
  status: z.enum(QUIZ_STATUSES).optional(),
});

export type UpdateQuizInput = z.infer<typeof UpdateQuizSchema>;
