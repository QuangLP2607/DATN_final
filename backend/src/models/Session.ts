import { Schema, model } from "mongoose";
import { ISession } from "../interfaces/session";

const sessionSchema = new Schema<ISession>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    schedule_id: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },

    week_number: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

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

    status: {
      type: String,
      enum: ["upcoming", "active", "finished", "cancelled"],
      default: "upcoming",
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
 * Unique session per class per day per start_time
 */
sessionSchema.index({ class_id: 1, date: 1, start_time: 1 }, { unique: true });

/**
 * Validate time range
 */
sessionSchema.pre("validate", function (next) {
  if (this.start_time >= this.end_time) {
    return next(new Error("start_time must be less than end_time"));
  }
  next();
});

/**
 * Auto update status by date & time
 */
sessionSchema.pre("save", function (next) {
  if (this.status === "cancelled") return next();

  const now = new Date();

  const sessionStart = new Date(this.date);
  sessionStart.setHours(0, this.start_time, 0, 0);

  const sessionEnd = new Date(this.date);
  sessionEnd.setHours(0, this.end_time, 0, 0);

  if (now < sessionStart) this.status = "upcoming";
  else if (now <= sessionEnd) this.status = "active";
  else this.status = "finished";

  next();
});

export const SessionModel = model<ISession>(
  "Session",
  sessionSchema,
  "sessions"
);
