import { useQuery } from "@tanstack/react-query";
import quizApi, { type QuizWithThumbnailUrl } from "@/services/quizService";
import type { PaginatedResponse } from "@/interfaces/common";
import type { QuizStatusWithAll } from "@/interfaces/quiz";
import type { GetQuizzesParams } from "@/services/quizService";

export interface UseQuizzesParams extends Omit<GetQuizzesParams, "status"> {
  status?: QuizStatusWithAll;
}

export function useQuizzesQuery(params: UseQuizzesParams) {
  const apiParams: GetQuizzesParams = { ...params };

  return useQuery<PaginatedResponse<"quizzes", QuizWithThumbnailUrl>>({
    queryKey: ["quizzes", apiParams],
    queryFn: () => quizApi.search(apiParams),
    placeholderData: (prev) => prev,
  });
}
