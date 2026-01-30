export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export const CourseStatusList = ["active", "inactive"] as const;

export type CourseStatus = (typeof CourseStatusList)[number];
