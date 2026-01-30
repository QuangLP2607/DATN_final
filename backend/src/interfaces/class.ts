import { Types } from "mongoose";

export const ClassStatuses = ["upcoming", "active", "finished"] as const;
export type ClassStatus = (typeof ClassStatuses)[number];

export interface IClass {
  id?: string;
  name: string;
  course_id: Types.ObjectId;
  teacher_ids: Types.ObjectId[];
  start_date?: Date;
  end_date?: Date;
  status?: ClassStatus;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
