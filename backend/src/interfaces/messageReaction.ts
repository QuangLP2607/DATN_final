import { Types } from "mongoose";

export interface IMessageReaction {
  id?: string;

  message_id: Types.ObjectId;
  user_id: Types.ObjectId;

  emoji: string;

  createdAt?: Date;
}
