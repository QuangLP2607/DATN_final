import { Types } from "mongoose";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ISchedule {
  id?: string;
  class_id: Types.ObjectId;
  day_of_week: DayOfWeek;
  start_time: number;
  end_time: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
