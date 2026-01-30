import { Schema, model } from "mongoose";
import { IEnrollment } from "../interfaces/enrollment";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    student_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    enrolled_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * Unique enrollment per student per class
 * background: true → index build không spam log
 */
enrollmentSchema.index(
  { class_id: 1, student_id: 1 },
  { unique: true, background: true }
);

export const EnrollmentModel = model<IEnrollment>(
  "Enrollment",
  enrollmentSchema,
  "enrollments"
);
