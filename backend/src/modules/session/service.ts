import AppError from "../../core/AppError";
import { SessionModel } from "../../models/Session";
import { ClassModel } from "../../models/Class";
import { ScheduleModel } from "../../models/Schedule";
import { SearchSessionInput } from "./dto/searchSession";
import { CreateSessionInput } from "./dto/createSession";
import { UpdateSessionInput } from "./dto/updateSession";

export default {
  // -------------------- search sessions --------------------
  search: async (query: SearchSessionInput) => {
    const mongoQuery: Record<string, any> = {};

    if (query.class_id) {
      mongoQuery.class_id = query.class_id;
    }

    if (query.status) {
      mongoQuery.status = query.status;
    }

    if (query.week_number) {
      mongoQuery.week_number = query.week_number;
    }

    if (query.from || query.to) {
      mongoQuery.date = {};
      if (query.from) mongoQuery.date.$gte = new Date(query.from);
      if (query.to) mongoQuery.date.$lte = new Date(query.to);
    }

    return SessionModel.find(mongoQuery)
      .sort({ date: 1, start_time: 1 })
      .lean();
  },

  // -------------------- create session --------------------
  create: async (data: CreateSessionInput) => {
    if (data.end_time <= data.start_time) {
      throw AppError.badRequest("end_time must be after start_time");
    }

    const schedule = await ScheduleModel.findById(data.schedule_id);
    if (!schedule) {
      throw AppError.notFound("Schedule not found");
    }

    const session = await SessionModel.create({
      ...data,
      class_id: schedule.class_id,
    });

    return { id: session._id };
  },

  // -------------------- update session --------------------
  update: async (id: string, data: UpdateSessionInput) => {
    const session = await SessionModel.findById(id);
    if (!session) throw AppError.notFound("Session not found");

    if (
      data.start_time !== undefined &&
      data.end_time !== undefined &&
      data.end_time <= data.start_time
    ) {
      throw AppError.badRequest("end_time must be after start_time");
    }

    Object.assign(session, data);
    await session.save();
  },

  // -------------------- delete session --------------------
  remove: async (id: string) => {
    const deleted = await SessionModel.findByIdAndDelete(id);
    if (!deleted) throw AppError.notFound("Session not found");
  },
};
