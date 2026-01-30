import type { ApiResponse } from "@/interfaces/common";
import type { Schedule } from "@/interfaces/schedule";
import type { Class } from "@/interfaces/class";
import apiClient from "./apiClient";

// ===== Types ================================================================
export interface CreateSchedulePayload
  extends Pick<Schedule, "day_of_week" | "start_time" | "end_time" | "note"> {
  class_id: string;
}

export type UpdateSchedulePayload = Pick<
  Schedule,
  "start_time" | "end_time" | "note"
>;

export interface GetScheduleQuery {
  class_id?: string | string[];
  from: string;
  to: string;
}

export interface ClassWithSchedules extends Pick<Class, "id" | "name"> {
  schedules: Pick<
    Schedule,
    "day_of_week" | "start_time" | "end_time" | "note"
  >[];
}

export interface GetScheduleResponse {
  classes: ClassWithSchedules[];
}

// ===== API ================================================================
const scheduleApi = {
  async search(payload?: GetScheduleQuery): Promise<ClassWithSchedules[]> {
    const res = await apiClient.post<ApiResponse<GetScheduleResponse>>(
      "/schedule",
      payload
    );

    return res.data.data!.classes;
  },

  async create(payload: CreateSchedulePayload): Promise<{ id: string }> {
    const res = await apiClient.post<ApiResponse<{ id: string }>>(
      "/schedule",
      payload
    );

    return res.data.data!;
  },

  async update(id: string, payload: UpdateSchedulePayload): Promise<void> {
    await apiClient.patch(`/schedule/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/schedule/${id}`);
  },
};

export default scheduleApi;
