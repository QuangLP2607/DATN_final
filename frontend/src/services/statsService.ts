import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

// ===== Types ================================================================
export type CourseStat = {
  name: string;
  student_count: number;
  class_count: number;
};

export type StudentLevelStat = {
  level: string;
  total: number;
};

export type TeacherStatusStat = {
  status: string;
  total: number;
};

export type ClassStatusStat = {
  status: string;
  total: number;
};

export type OverviewResponse = {
  courses: {
    total: number;
    details: CourseStat[];
  };
  students: {
    total: number;
    details: StudentLevelStat[];
  };
  teachers: {
    total: number;
    details: TeacherStatusStat[];
  };
  classes: {
    total: number;
    details: ClassStatusStat[];
  };
};

export type StudentEnrollmentMonth = {
  month: number;
  total: number;
};

export type StudentEnrollmentYear = {
  year: number;
  months: StudentEnrollmentMonth[];
};

export type StudentEnrollmentResponse = {
  stats: StudentEnrollmentYear[];
};

// ===== API ==================================================================
const authApi = {
  async getOverview(): Promise<OverviewResponse> {
    const res = await apiClient.get<ApiResponse<OverviewResponse>>(
      "stats/overview"
    );

    return res.data.data!;
  },

  async getStudentEnrollments(): Promise<StudentEnrollmentResponse> {
    const res = await apiClient.get<ApiResponse<StudentEnrollmentResponse>>(
      "stats/students-enrollment"
    );

    return res.data.data!;
  },
};

export default authApi;
