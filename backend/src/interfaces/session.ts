import { Types } from "mongoose";

export interface ISession {
  id?: string;
  class_id: Types.ObjectId;
  schedule_id: Types.ObjectId;
  week_number: number;
  date: Date;

  // minutes from 00:00
  start_time: number;
  end_time: number;

  status: "upcoming" | "active" | "finished" | "cancelled";
  note?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
