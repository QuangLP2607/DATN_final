import { model, Schema } from "mongoose";
import { ICourse } from "../interfaces/course";

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

/**
 * Unique index on code
 * background: true → build index in background, không spam log
 */
courseSchema.index({ code: 1 }, { unique: true, background: true });

export const CourseModel = model<ICourse>("Course", courseSchema, "courses");
