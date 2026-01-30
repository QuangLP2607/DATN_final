import { Types } from "mongoose";

export interface IMessage {
  id?: string;

  conversation_id: Types.ObjectId;

  sender_id: Types.ObjectId;
  sender_role: "teacher" | "student";

  type: "text" | "image" | "file" | "deleted";
  content?: string;

  reply_to?: Types.ObjectId;

  is_deleted: boolean;
  deleted_at?: Date;
  edited_at?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
