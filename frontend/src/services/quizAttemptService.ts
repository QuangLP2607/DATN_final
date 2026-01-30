import type { ApiResponse } from "@/interfaces/common";
import type { QuizAttempt } from "@/interfaces/quizAttempt";
import apiClient from "./apiClient";

// ================= Types =================

export interface SubmitQuizAttemptPayload {
  answers: {
    question_id: string;
    selectedIndex: number;
  }[];
}

export interface GetQuizAttemptsParams {
  page?: number;
  limit?: number;
}

export interface SubmitQuizAttemptResponse {
  attemptId: string;
  score: number;
  total: number;
  totalQuestions: number;
}

/** ===== Attempt Detail ===== */

export interface AttemptQuestion {
  id: string;
  content: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
}

export interface AttemptDetail {
  score: number;
  total: number;
  attemptNumber: number;
  submittedAt: string;
  questions: AttemptQuestion[];
}

export interface GetAttemptDetailResponse {
  attempt: AttemptDetail;
}

// ================= API ===================

const quizAttemptApi = {
  async getAttempts(quizId: string, params?: GetQuizAttemptsParams) {
    const res = await apiClient.get<
      ApiResponse<{ attempts: QuizAttempt[]; total: number }>
    >(`attempt/quiz/${quizId}`, { params });

    return res.data.data!;
  },

  async submit(
    quizId: string,
    payload: SubmitQuizAttemptPayload,
  ): Promise<SubmitQuizAttemptResponse> {
    const res = await apiClient.post<ApiResponse<SubmitQuizAttemptResponse>>(
      `attempt/quiz/${quizId}`,
      payload,
    );

    return res.data.data!;
  },

  async getAttemptDetail(attemptId: string): Promise<AttemptDetail> {
    const res = await apiClient.get<ApiResponse<AttemptDetail>>(
      `attempt/${attemptId}`,
    );

    // backend trả THẲNG AttemptDetail
    return res.data.data!;
  },
};

export default quizAttemptApi;
