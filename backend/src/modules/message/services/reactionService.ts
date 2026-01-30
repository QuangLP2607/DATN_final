import { Types } from "mongoose";
import { MessageReactionModel } from "../../../models/MessageReaction";

export default {
  reactMessage: async (message_id: string, user_id: string, emoji: string) => {
    await MessageReactionModel.updateOne(
      {
        message_id: new Types.ObjectId(message_id),
        user_id: new Types.ObjectId(user_id),
        emoji,
      },
      {
        $setOnInsert: {
          message_id: new Types.ObjectId(message_id),
          user_id: new Types.ObjectId(user_id),
          emoji,
        },
      },
      { upsert: true }
    );
  },

  removeReaction: async (
    message_id: string,
    user_id: string,
    emoji: string
  ) => {
    await MessageReactionModel.deleteOne({
      message_id: new Types.ObjectId(message_id),
      user_id: new Types.ObjectId(user_id),
      emoji,
    });
  },
};
