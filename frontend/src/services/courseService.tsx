import apiClient from "./apiClient";
import type {
  ApiResponse,
  ListParams,
  PaginatedResponse,
} from "@/interfaces/common";
import type { Course } from "@/interfaces/course";
import type { Class } from "@/interfaces/class";

// ===== Types ================================================================
export interface SearchCourseResponse extends Course {
  total_classes: number;
  active_classes: number;
}

export type CreateCoursePayload = Pick<Course, "code" | "name" | "status">;

export type UpdateCoursePayload = Partial<
  Pick<Course, "code" | "name" | "status">
>;

export interface getByIdResponse {
  course: SearchCourseResponse;
  classes: (Pick<
    Class,
    "id" | "name" | "start_date" | "end_date" | "status"
  > & {
    teachers?: { id: string; name: string; email?: string }[];
  })[];
}

// ===== API ================================================================
const courseApi = {
  async create(payload: CreateCoursePayload): Promise<Course> {
    const res = await apiClient.post<ApiResponse<Course>>("course", payload);
    return res.data.data!;
  },

  async search(
    params?: ListParams
  ): Promise<PaginatedResponse<"courses", SearchCourseResponse>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResponse<"courses", SearchCourseResponse>>
    >("course", { params });
    return res.data.data!;
  },

  async getById(id: string): Promise<getByIdResponse> {
    const res = await apiClient.get<ApiResponse<getByIdResponse>>(
      `course/${id}`
    );
    return res.data.data!;
  },

  async update(id: string, payload: UpdateCoursePayload): Promise<Course> {
    const res = await apiClient.put<ApiResponse<Course>>(
      `course/${id}`,
      payload
    );
    return res.data.data!;
  },

  async delete(id: string): Promise<null> {
    const res = await apiClient.delete<ApiResponse<null>>(`course/${id}`);
    return res.data.data!;
  },
};

export default courseApi;
