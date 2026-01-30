import { Types } from "mongoose";

export interface IConversationRead {
  id?: string;
  conversation_id: Types.ObjectId;
  user_id: Types.ObjectId;

  last_read_message_id?: Types.ObjectId;

  last_read_at: Date;
}
