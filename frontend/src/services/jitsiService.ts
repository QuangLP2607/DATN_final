import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

// ===== Types ================================================================
export interface CreateRoomInput {
  room_name: string;
  class_id: string;
}

export interface JitsiRoomResponse {
  roomId: string;
  token: string;
}

export interface ClassLiveStatus {
  isLive: boolean;
  roomId?: string;
  teacherOnline?: boolean;
}

// ===== API ================================================================
const jitsiApi = {
  async createRoom(payload: CreateRoomInput): Promise<JitsiRoomResponse> {
    const res = await apiClient.post<ApiResponse<JitsiRoomResponse>>(
      "/live-room/create",
      payload,
    );
    if (!res.data.data) throw new Error("No data returned");
    return res.data.data;
  },

  async joinRoom(id: string): Promise<JitsiRoomResponse> {
    const res = await apiClient.post<ApiResponse<JitsiRoomResponse>>(
      `/live-room/${id}/join`,
    );

    if (!res.data.data) throw new Error("No data returned");
    return res.data.data;
  },

  async leaveRoom(roomId: string): Promise<void> {
    await apiClient.post(`/live-room/${roomId}/leave`);
  },

  async pingRoom(roomId: string): Promise<void> {
    await apiClient.post(`/live-room/${roomId}/ping`);
  },

  async getClassLiveStatus(classId: string): Promise<ClassLiveStatus> {
    const res = await apiClient.get<ApiResponse<ClassLiveStatus>>(
      `/live-room/class/${classId}/status`,
    );
    if (!res.data.data) throw new Error("No data returned");
    return res.data.data;
  },
};

export default jitsiApi;
