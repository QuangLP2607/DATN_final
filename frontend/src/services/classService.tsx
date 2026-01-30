import type { Class, ClassStatus } from "@/interfaces/class";
import type { User } from "@/interfaces/user";
import type { Course } from "@/interfaces/course";
import type {
  ApiResponse,
  ListParams,
  PaginatedResponse,
} from "@/interfaces/common";
import apiClient from "./apiClient";

// ===== Types ================================================================
export interface SearchClassesParams extends ListParams {
  from?: string;
  to?: string;
  status?: ClassStatus;
}

export type ClassDetail = Class & {
  teachers?: Pick<User, "id" | "username">[];
  course?: Pick<Course, "id" | "name" | "code">;
};

export type CreateClassPayload = Pick<Class, "name" | "course_id">;

export type UpdateClassPayload = Partial<
  Pick<Class, "name" | "course_id" | "teacher_ids" | "start_date" | "end_date">
>;

export interface MyClassesResponse {
  classes: Class[];
}

// ===== API ================================================================
const classApi = {
  async search(
    params?: SearchClassesParams
  ): Promise<PaginatedResponse<"classes", ClassDetail[]>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResponse<"classes", ClassDetail[]>>
    >("class", { params });

    return res.data.data!;
  },

  async getMy(): Promise<MyClassesResponse> {
    const res = await apiClient.get<ApiResponse<MyClassesResponse>>("class/me");
    return res.data.data!;
  },

  async create(payload: CreateClassPayload): Promise<Class> {
    const res = await apiClient.post<ApiResponse<Class>>("class", payload);
    return res.data.data!;
  },

  async update(id: string, payload: UpdateClassPayload): Promise<Class> {
    const res = await apiClient.put<ApiResponse<Class>>(`class/${id}`, payload);
    return res.data.data!;
  },
};

export default classApi;
