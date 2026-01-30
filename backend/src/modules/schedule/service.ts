import AppError from "../../core/AppError";
import { ScheduleModel } from "../../models/Schedule";
import { ClassModel } from "../../models/Class";
import { normalizeMongoList } from "../../utils/mongoNormalize";
import {
  SearchScheduleInput,
  SearchScheduleResponse,
  ClassWithSchedules,
} from "./dto/searchSchedule";
import { CreateScheduleInput } from "./dto/createSchedule";
import { UpdateScheduleInput } from "./dto/updateSchedule";
import { Types } from "mongoose";

export default {
  // -------------------- search schedules --------------------
  search: async (
    query: SearchScheduleInput
  ): Promise<SearchScheduleResponse> => {
    const { class_id, from, to } = query;

    // ---------------- match class ----------------
    const classFilter: any = {};
    if (class_id) {
      if (Array.isArray(class_id)) {
        classFilter._id = { $in: class_id.map((id) => new Types.ObjectId(id)) };
      } else {
        classFilter._id = new Types.ObjectId(class_id);
      }
    }

    if (from) classFilter.end_date = { $gte: new Date(from) };
    if (to)
      classFilter.start_date = {
        ...classFilter.start_date,
        $lte: new Date(to),
      };

    // ---------------- fetch classes ----------------
    const classesRaw = await ClassModel.find(classFilter)
      .select("_id name")
      .lean();

    const classIds = classesRaw.map((c) => c._id);

    // ---------------- fetch schedules ----------------
    const schedulesRaw = await ScheduleModel.find({
      class_id: { $in: classIds },
    })
      .sort({ day_of_week: 1, start_time: 1 })
      .lean();

    // ---------------- normalize ----------------
    const classesNormalized = normalizeMongoList(classesRaw);
    const schedulesNormalized = normalizeMongoList(schedulesRaw);

    // ---------------- map to DTO ----------------
    const classes: ClassWithSchedules[] = classesNormalized.map((c) => ({
      id: c.id,
      name: c.name ?? "",
      schedules: schedulesNormalized.filter(
        (s) => s.class_id.toString() === c.id
      ),
    }));

    return { classes };
  },

  // -------------------- create schedule --------------------
  create: async (data: CreateScheduleInput) => {
    const { class_id, day_of_week, start_time, end_time } = data;

    if (end_time <= start_time) {
      throw AppError.badRequest("end_time must be after start_time");
    }

    const classExists = await ClassModel.exists({ _id: class_id });
    if (!classExists) {
      throw AppError.notFound("Class not found");
    }

    const overlap = await ScheduleModel.exists({
      class_id,
      day_of_week,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });

    if (overlap) {
      throw AppError.conflict("Schedule time overlaps with existing schedule");
    }

    const schedule = await ScheduleModel.create(data);

    return { id: schedule._id };
  },

  // -------------------- update schedule --------------------
  update: async (id: string, data: UpdateScheduleInput) => {
    if (
      data.start_time !== undefined &&
      data.end_time !== undefined &&
      data.end_time <= data.start_time
    ) {
      throw AppError.badRequest("end_time must be after start_time");
    }

    const schedule = await ScheduleModel.findById(id);
    if (!schedule) throw AppError.notFound("Schedule not found");

    Object.assign(schedule, data);
    await schedule.save();
  },

  // -------------------- delete schedule --------------------
  remove: async (id: string) => {
    const schedule = await ScheduleModel.findById(id);
    if (!schedule) throw AppError.notFound("Schedule not found");

    await schedule.deleteOne();
  },
};
