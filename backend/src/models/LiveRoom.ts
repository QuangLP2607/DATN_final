import { Schema, model, Types } from "mongoose";
import { ILiveRoom } from "../interfaces/liveRoom";

const LiveRoomSchema = new Schema<ILiveRoom>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
      index: true,
    },

    started_at: {
      type: Date,
      default: Date.now,
    },

    ended_at: {
      type: Date,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    last_seen_teacher: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Only ONE OPEN room per class
 */
LiveRoomSchema.index(
  { class_id: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "OPEN" },
  }
);

/**
 * Query active rooms fast
 */
LiveRoomSchema.index({ status: 1, createdAt: -1 });

export const LiveRoomModel = model<ILiveRoom>("LiveRoom", LiveRoomSchema);
