import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";
import type { User, Role } from "@/interfaces/user";

// ===== Types ================================================================
export interface LoginPayload extends Pick<User, "email"> {
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: Role;
}

export interface SignupPayload
  extends Pick<User, "email" | "username" | "role"> {
  password: string;
}

export type SignupResponse = Pick<User, "id">;

// ===== API ==================================================================
const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );

    return res.data.data!;
  },

  async signup(payload: SignupPayload): Promise<SignupResponse> {
    const res = await apiClient.post<ApiResponse<SignupResponse>>(
      "/auth/signup",
      payload
    );

    return res.data.data!;
  },

  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    await apiClient.post("/auth/logout");
  },
};

export default authApi;
