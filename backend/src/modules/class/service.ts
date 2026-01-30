import AppError from "../../core/AppError";
import { ClassModel } from "../../models/Class";
import { CourseModel } from "../../models/Course";
import { ConversationModel } from "../../models/Conversation";
import { EnrollmentModel } from "../../models/Enrollment";
import { AuthUser } from "../../interfaces/user";
import { normalizeMongoList } from "../../utils/mongoNormalize";
import {
  SearchClassesInput,
  SearchClassesResponse,
  ClassDetail,
} from "./dto/searchClasses";
import { CreateClassInput } from "./dto/createClass";
import { UpdateClassInput } from "./dto/updateClass";
import { AddTeachersInput } from "./dto/addTeacher";
import conversationService from "../../modules/conversation/services";
import { Types } from "mongoose";

export default {
  // -------------------- search classes (admin / teacher) --------------------
  search: async (data: SearchClassesInput): Promise<SearchClassesResponse> => {
    const { page, limit, sortBy, order, search, from, to, status } = data;

    const mongoQuery: Record<string, any> = {};

    if (search?.trim()) {
      mongoQuery.$or = [{ name: { $regex: search.trim(), $options: "i" } }];
    }

    if (from || to) {
      mongoQuery.start_date = {};
      mongoQuery.end_date = {};
      if (from) {
        mongoQuery.start_date.$gte = new Date(from);
        mongoQuery.end_date.$gte = new Date(from);
      }
      if (to) {
        mongoQuery.start_date.$lte = new Date(to);
        mongoQuery.end_date.$lte = new Date(to);
      }
    }

    if (status) mongoQuery.status = status;

    const skip = (page - 1) * limit;

    // fetch classes
    const [classesRaw, total] = await Promise.all([
      ClassModel.find(mongoQuery)
        .populate("teacher_ids", "username")
        .populate("course_id", "name code")
        .select("-__v")
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ClassModel.countDocuments(mongoQuery),
    ]);

    const classes: ClassDetail[] = normalizeMongoList(classesRaw).map((c) => ({
      ...c,
      teachers: (c.teacher_ids as any[] | undefined)?.map((t) => ({
        id: t._id.toString(),
        username: t.username,
      })),
      course: c.course_id
        ? {
            id: (c.course_id as any)._id.toString(),
            name: (c.course_id as any).name,
            code: (c.course_id as any).code,
          }
        : undefined,
    }));

    return {
      classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // -------------------- get my classes (TEACHER + STUDENT) --------------------
  getMy: async (user: AuthUser) => {
    let classesRaw: any[] = [];

    // ===== ADMIN =====
    if (user.role === "ADMIN") {
      classesRaw = await ClassModel.find().select("-__v").lean();
    }

    // ===== TEACHER =====
    if (user.role === "TEACHER") {
      classesRaw = await ClassModel.find({
        teacher_ids: user.id,
      })
        .select("-__v")
        .lean();
    }

    // ===== STUDENT =====
    if (user.role === "STUDENT") {
      const enrollments = await EnrollmentModel.find({
        student_id: user.id,
      }).select("class_id");

      const classIds = enrollments.map((e) => e.class_id);

      if (classIds.length === 0) {
        return { classes: [] };
      }

      classesRaw = await ClassModel.find({
        _id: { $in: classIds },
      }).lean();
    }

    const classes = normalizeMongoList(classesRaw);
    return { classes };
  },

  // -------------------- create class --------------------
  create: async (data: CreateClassInput) => {
    const course = await CourseModel.findById(data.course_id);
    if (!course) {
      throw AppError.notFound("Course not found");
    }

    const newClass = await ClassModel.create(data);

    await ConversationModel.create({ class_id: newClass._id });

    return { id: newClass._id.toString() };
  },

  // -------------------- update class --------------------
  update: async (id: string, data: UpdateClassInput) => {
    const c = await ClassModel.findById(id);
    if (!c) throw AppError.notFound("Class not found");
    conversationService.conversation.syncConversationMembers;
    Object.assign(c, data);
    await c.save();
  },

  // -------------------- add teachers --------------------
  addTeachers: async (classId: string, data: AddTeachersInput) => {
    const c = await ClassModel.findById(classId);
    if (!c) {
      throw AppError.notFound("Class not found");
    }

    const teacherIds = c.teacher_ids ?? [];

    const currentTeacherIds = teacherIds.map((id) => id.toString());

    const newTeacherIds = data.teacher_ids.filter(
      (id) => !currentTeacherIds.includes(id.toString())
    );

    if (newTeacherIds.length === 0) {
      return { added: 0 };
    }

    c.teacher_ids = [
      ...teacherIds,
      ...newTeacherIds.map((id) => new Types.ObjectId(id)),
    ];

    await c.save();

    await conversationService.conversation.syncConversationMembers(classId);

    return {
      added: newTeacherIds.length,
    };
  },
};
