import type {
  ApiResponse,
  ListParams,
  PaginatedResponse,
} from "@/interfaces/common";
import type { Quiz, Question, QuizStatusWithAll } from "@/interfaces/quiz";
import apiClient from "./apiClient";

// ===== Types ================================================================
export interface GetQuizzesParams extends ListParams {
  class_id?: string;
  status?: QuizStatusWithAll;
  from?: Date;
  to?: Date;
}

export type CreateQuizPayload = Pick<
  Quiz,
  | "title"
  | "class_id"
  | "description"
  | "thumbnail_id"
  | "startDate"
  | "endDate"
  | "duration"
>;

export type UpdateQuizPayload = Pick<
  Quiz,
  | "title"
  | "description"
  | "thumbnail_id"
  | "startDate"
  | "endDate"
  | "duration"
  | "status"
>;

export interface UpdateQuestionsPayload {
  questions: Question[];
}

export type QuizWithThumbnailUrl = Pick<
  Quiz,
  | "id"
  | "title"
  | "description"
  | "duration"
  | "startDate"
  | "endDate"
  | "totalScore"
  | "status"
> & {
  thumbnail_url: string;
};

// ===== API =================================================================
const quizApi = {
  async search(
    params?: GetQuizzesParams,
  ): Promise<PaginatedResponse<"quizzes", QuizWithThumbnailUrl>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResponse<"quizzes", QuizWithThumbnailUrl>>
    >("quiz", { params });

    return res.data.data!;
  },

  async getDetail(id: string): Promise<Quiz> {
    const res = await apiClient.get<ApiResponse<Quiz>>(`quiz/${id}`);
    return res.data.data!;
  },

  async create(payload: CreateQuizPayload): Promise<Quiz> {
    const res = await apiClient.post<ApiResponse<Quiz>>("quiz", payload);
    return res.data.data!;
  },

  async update(id: string, payload: UpdateQuizPayload): Promise<Quiz> {
    const res = await apiClient.patch<ApiResponse<Quiz>>(`quiz/${id}`, payload);
    return res.data.data!;
  },

  async updateQuestions(
    id: string,
    payload: UpdateQuestionsPayload,
  ): Promise<{ totalQuestions: number }> {
    const res = await apiClient.put<ApiResponse<{ totalQuestions: number }>>(
      `quiz/${id}/questions`,
      payload,
    );
    return res.data.data!;
  },

  async delete(id: string) {
    return apiClient.delete(`quiz/${id}`);
  },
};

export default quizApi;
