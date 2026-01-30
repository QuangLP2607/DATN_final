export interface Class {
  id: string;
  name: string;
  course_id: string;
  teacher_ids: string[];
  status: ClassStatus;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
}

export const ClassStatusList = ["upcoming", "active", "finished"] as const;

export type ClassStatus = (typeof ClassStatusList)[number];
