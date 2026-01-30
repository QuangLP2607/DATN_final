import { Schema, model, Model } from "mongoose";
import { IMessageMedia } from "../interfaces/messageMedia";

const messageMediaSchema = new Schema<IMessageMedia>(
  {
    message_id: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      index: true,
    },

    media_id: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

messageMediaSchema.index({ message_id: 1, media_id: 1 }, { unique: true });

export const MessageMediaModel: Model<IMessageMedia> = model<IMessageMedia>(
  "MessageMedia",
  messageMediaSchema
);
