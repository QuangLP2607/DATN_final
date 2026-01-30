import { Types } from "mongoose";

export interface IMessageMedia {
  id?: string;
  message_id: Types.ObjectId;
  media_id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
