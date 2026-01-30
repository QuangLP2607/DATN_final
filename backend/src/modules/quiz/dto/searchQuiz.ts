import { z } from "zod";
import {
  paginationQuerySchema,
  objectIdSchema,
  Pagination,
} from "../../../utils/zod";
import { IQuiz, QUIZ_STATUSES } from "../../../interfaces/quiz";

export const quizStatusEnum = z.enum(QUIZ_STATUSES);

export const SearchQuizSchema = paginationQuerySchema
  .extend({
    class_id: objectIdSchema.optional(),
    status: z.union([quizStatusEnum, z.literal("all")]).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .strict();

export type SearchQuizInput = z.infer<typeof SearchQuizSchema>;

export type QuizWithThumbnailUrl = Pick<
  IQuiz,
  | "id"
  | "title"
  | "description"
  | "duration"
  | "startDate"
  | "endDate"
  | "status"
> & {
  thumbnail_url: string;
};

export interface SearchQuizResponse {
  quizzes: QuizWithThumbnailUrl[];
  pagination: Pagination;
}
