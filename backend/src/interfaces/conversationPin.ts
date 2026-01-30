import { Types } from "mongoose";

export interface IConversationPin {
  id?: string;

  conversation_id: Types.ObjectId;
  message_id: Types.ObjectId;

  pinned_by: Types.ObjectId;
  pinned_at?: Date;
}
