import type { ApiResponse } from "@/interfaces/common";
import type { Enrollment } from "@/interfaces/enrollment";
import type { User } from "@/interfaces/user";
import type { Class } from "@/interfaces/class";
import type { Course } from "@/interfaces/course";
import apiClient from "./apiClient";

// ===== Types ================================================================
export type CreateEnrollmentPayload = Pick<
  Enrollment,
  "student_id" | "class_id"
>;

export interface SearchByStudentResponse
  extends Pick<Enrollment, "id" | "enrolled_at"> {
  class: Pick<Class, "id" | "name" | "status">;
  course: Pick<Course, "id" | "code" | "name">;
}

export interface SearchByClassResponse
  extends Pick<Enrollment, "id" | "enrolled_at"> {
  student: Pick<User, "id" | "username" | "full_name" | "email" | "phone">;
}

// ===== API ================================================================
const enrollmentApi = {
  async getMy(): Promise<Enrollment[]> {
    const res = await apiClient.get<ApiResponse<Enrollment[]>>(
      "/enrollment/me"
    );
    return res.data.data!;
  },

  async searchByClass(id: string): Promise<SearchByClassResponse[]> {
    const res = await apiClient.get<ApiResponse<SearchByClassResponse[]>>(
      `/enrollment/class/${id}`
    );
    return res.data.data!;
  },

  async searchByStudent(id: string): Promise<SearchByStudentResponse[]> {
    const res = await apiClient.get<ApiResponse<SearchByStudentResponse[]>>(
      `/enrollment/student/${id}`
    );
    return res.data.data!;
  },

  async create(payload: CreateEnrollmentPayload): Promise<{ id: string }> {
    const res = await apiClient.post<ApiResponse<{ id: string }>>(
      "/enrollment",
      payload
    );
    return res.data.data!;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/enrollment/${id}`);
  },
};

export default enrollmentApi;
