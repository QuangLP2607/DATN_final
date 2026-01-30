import { Schema, model } from "mongoose";
import { ILectureVideo } from "../interfaces/lectureVideo";

const lectureVideoSchema = new Schema<ILectureVideo>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },

    thumbnail_id: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate video in same class
 */
lectureVideoSchema.index({ class_id: 1, video_id: 1 }, { unique: true });

/**
 * Fast query class videos (newest first)
 */
lectureVideoSchema.index({ class_id: 1, createdAt: -1 });

export const LectureVideoModel = model<ILectureVideo>(
  "LectureVideo",
  lectureVideoSchema
);
