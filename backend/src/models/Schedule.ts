import { Schema, model } from "mongoose";
import { ISchedule } from "../interfaces/schedule";

const scheduleSchema = new Schema<ISchedule>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    day_of_week: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },

    // minutes from 00:00
    start_time: {
      type: Number,
      required: true,
      min: 0,
      max: 1439,
    },

    end_time: {
      type: Number,
      required: true,
      min: 1,
      max: 1440,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 255,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate schedules
 * Same class + same day + same start_time
 */
scheduleSchema.index(
  { class_id: 1, day_of_week: 1, start_time: 1 },
  { unique: true }
);

/**
 * Validate start_time < end_time
 */
scheduleSchema.pre("validate", function (next) {
  if (this.start_time >= this.end_time) {
    return next(new Error("start_time must be less than end_time"));
  }
  next();
});

export const ScheduleModel = model<ISchedule>(
  "Schedule",
  scheduleSchema,
  "schedules"
);
