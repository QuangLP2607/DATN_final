import { Schema, model, Model } from "mongoose";
import { IConversationPin } from "../interfaces/conversationPin";

const conversationPinSchema = new Schema<IConversationPin>(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    message_id: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      index: true,
    },

    pinned_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

conversationPinSchema.index(
  { conversation_id: 1, message_id: 1 },
  { unique: true, background: true }
);

export const ConversationPinModel: Model<IConversationPin> =
  model<IConversationPin>("ConversationPin", conversationPinSchema);
