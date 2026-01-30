import { Schema, model, Model } from "mongoose";
import { IConversation } from "../interfaces/conversation";

const conversationSchema = new Schema<IConversation>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    member_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],
  },
  { timestamps: true }
);

conversationSchema.index({ class_id: 1 }, { unique: true, background: true });

export const ConversationModel: Model<IConversation> = model<IConversation>(
  "Conversation",
  conversationSchema
);
