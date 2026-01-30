export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Schedule {
  id?: string;
  class_id: string;
  day_of_week: DayOfWeek;
  start_time: number;
  end_time: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleVM extends Omit<Schedule, "class_id"> {
  class: {
    id: string;
    name: string;
  };
}
