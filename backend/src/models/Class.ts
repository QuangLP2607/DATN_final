import { Schema, model } from "mongoose";
import { IClass } from "../interfaces/class";
import cron from "node-cron";

/* ================= Schema ================= */

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    teacher_ids: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    start_date: {
      type: Date,
    },

    end_date: {
      type: Date,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["upcoming", "active", "finished"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

/* ================= Utils ================= */

function computeStatus(
  start?: Date,
  end?: Date
): "upcoming" | "active" | "finished" {
  const now = new Date();

  if (!start || !end) return "upcoming";
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "finished";
}

/* ================= Hooks ================= */

// save
classSchema.pre("save", function (next) {
  if (this.isModified("start_date") || this.isModified("end_date")) {
    this.status = computeStatus(this.start_date, this.end_date);
  }
  next();
});

// findOneAndUpdate
classSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();
  const updateSet = update.$set || update;

  if (updateSet.start_date || updateSet.end_date) {
    const doc = await this.model.findOne(this.getQuery());

    const start = updateSet.start_date
      ? new Date(updateSet.start_date)
      : doc?.start_date;

    const end = updateSet.end_date
      ? new Date(updateSet.end_date)
      : doc?.end_date;

    update.$set = {
      ...updateSet,
      status: computeStatus(start, end),
    };

    this.setUpdate(update);
  }

  next();
});

/* ================= Model ================= */

export const ClassModel = model<IClass>("Class", classSchema, "classes");

/* ================= Cron (optional) ================= */

/**
 * Sync status mỗi ngày lúc 00:00
 * Dữ liệu nhỏ => an toàn, dễ maintain
 */
cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  await ClassModel.updateMany(
    {
      start_date: { $exists: true },
      end_date: { $exists: true },
    },
    [
      {
        $set: {
          status: {
            $cond: [
              { $lt: [now, "$start_date"] },
              "upcoming",
              {
                $cond: [
                  {
                    $and: [
                      { $gte: [now, "$start_date"] },
                      { $lte: [now, "$end_date"] },
                    ],
                  },
                  "active",
                  "finished",
                ],
              },
            ],
          },
        },
      },
    ]
  );

  console.log(`[${now.toISOString()}] Class statuses synced`);
});
