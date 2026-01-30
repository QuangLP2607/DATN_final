import type { JapaneseLevel, UserStatus, User, Role } from "@/interfaces/user";
import type {
  ApiResponse,
  ListParams,
  PaginatedResponse,
} from "@/interfaces/common";
import apiClient from "./apiClient";

// ===== Types ================================================================
export interface GetUsersParams extends ListParams {
  status?: UserStatus;
  japaneseLevel?: JapaneseLevel;
  role?: Role;
}

export type UpdateProfilePayload = Partial<
  Pick<
    User,
    "full_name" | "avatar_id" | "dob" | "phone" | "address" | "japaneseLevel"
  >
>;

interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// ===== API ================================================================
const userApi = {
  async getProfile(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>("user/me");
    return res.data.data!;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const res = await apiClient.patch<ApiResponse<null>>("user/me", payload);
    return res.data;
  },

  async updatePassword(payload: UpdatePasswordPayload) {
    const res = await apiClient.patch<ApiResponse<null>>(
      "user/me/password",
      payload
    );
    return res.data;
  },

  async search(
    params: GetUsersParams
  ): Promise<PaginatedResponse<"users", User>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResponse<"users", User>>
    >("user", { params });

    return res.data.data!;
  },

  async getById(id: string): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>(`user/${id}`);
    return res.data.data!;
  },
};

export default userApi;
