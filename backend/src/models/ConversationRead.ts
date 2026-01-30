import { Schema, model, Model } from "mongoose";
import { IConversationRead } from "../interfaces/conversationRead";

const conversationReadSchema = new Schema<IConversationRead>(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    last_read_message_id: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    last_read_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: false }
);

conversationReadSchema.index(
  { conversation_id: 1, user_id: 1 },
  { unique: true, background: true }
);

export const ConversationReadModel: Model<IConversationRead> =
  model<IConversationRead>("ConversationRead", conversationReadSchema);
