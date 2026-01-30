import { Types } from "mongoose";

export interface ILiveRoom {
  id?: string;
  name: string;
  class_id: Types.ObjectId;
  created_by: Types.ObjectId;
  status: "OPEN" | "CLOSED";
  started_at: Date;
  ended_at?: Date;
  participants: Types.ObjectId[];
  last_seen_teacher?: Date;
}
