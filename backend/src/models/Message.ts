import { Schema, model, Model } from "mongoose";
import { IMessage } from "../interfaces/message";

const messageSchema = new Schema<IMessage>(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender_role: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file"],
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    reply_to: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },

    deleted_at: Date,
    edited_at: Date,
  },
  { timestamps: true }
);

/**
 * Load messages in a conversation (newest first)
 */
messageSchema.index({ conversation_id: 1, createdAt: -1 });

export const MessageModel: Model<IMessage> = model<IMessage>(
  "Message",
  messageSchema
);
