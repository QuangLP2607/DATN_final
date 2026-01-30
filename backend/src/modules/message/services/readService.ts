import { Types } from "mongoose";
import { ConversationReadModel } from "../../../models/ConversationRead";

export default {
  markAsRead: async (
    conversation_id: string,
    user_id: string,
    last_read_message_id: string
  ) => {
    await ConversationReadModel.updateOne(
      {
        conversation_id: new Types.ObjectId(conversation_id),
        user_id: new Types.ObjectId(user_id),
      },
      {
        conversation_id: new Types.ObjectId(conversation_id),
        user_id: new Types.ObjectId(user_id),
        last_read_message_id: new Types.ObjectId(last_read_message_id),
        last_read_at: new Date(),
      },
      { upsert: true }
    );
  },
};
