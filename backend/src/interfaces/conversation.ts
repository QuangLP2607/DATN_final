import { Types } from "mongoose";

export interface IConversation {
  id?: string;
  class_id: Types.ObjectId;
  member_ids: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
