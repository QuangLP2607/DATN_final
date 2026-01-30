import { Schema, model, Model } from "mongoose";
import { IMessageReaction } from "../interfaces/messageReaction";

const messageReactionSchema = new Schema<IMessageReaction>(
  {
    message_id: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emoji: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

/**
 * One user can react one emoji once per message
 */
messageReactionSchema.index(
  { message_id: 1, user_id: 1, emoji: 1 },
  { unique: true }
);

export const MessageReactionModel: Model<IMessageReaction> =
  model<IMessageReaction>("MessageReaction", messageReactionSchema);
