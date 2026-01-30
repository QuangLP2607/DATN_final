import AppError from "../../core/AppError";
import { EnrollmentModel } from "../../models/Enrollment";
import { ClassModel } from "../../models/Class";
import { StudentModel } from "../../models/User";
import { normalizeMongoList } from "../../utils/mongoNormalize";
import { GetByClassResponse } from "./dto/getByClass";
import { CreateEnrollmentInput } from "./dto/createEnrollment";
import { Types } from "mongoose";
import conversationService from "../../modules/conversation/services";

export default {
  // -------------------- get my enrollments (student) --------------------
  getMy: async (studentId: string) => {
    const enrollments = await EnrollmentModel.find({
      student_id: new Types.ObjectId(studentId),
    }).lean();

    return normalizeMongoList(enrollments);
  },

  // -------------------- get enrollment by class --------------------
  getByClass: async (classId: string): Promise<GetByClassResponse> => {
    const cls = await ClassModel.findById(classId).lean();
    if (!cls) throw AppError.notFound("Class not found");

    const enrollments = await EnrollmentModel.find({ class_id: cls._id })
      .populate({
        path: "student_id",
        select: "username full_name email phone",
        model: StudentModel,
      })
      .lean();

    const result = enrollments.map((e: any) => ({
      id: e._id.toString(),
      student: {
        id: e.student_id?._id.toString(),
        username: e.student_id?.username,
        full_name: e.student_id?.full_name,
        email: e.student_id?.email,
        phone: e.student_id?.phone,
      },
      enrolled_at: e.enrolled_at,
    }));

    return result;
  },

  // -------------------- search enrollment by student --------------------
  searchByStudent: async (studentId: string) => {
    const student = await StudentModel.findById(studentId).lean();
    if (!student) throw AppError.notFound("Student not found");

    const enrollments = await EnrollmentModel.find({ student_id: student._id })
      .populate({
        path: "class_id",
        select: "name course_id status",
        populate: { path: "course_id", select: "code name" },
      })
      .lean();

    const result = enrollments.map((e: any) => ({
      id: e._id.toString(),
      class: {
        id: e.class_id?._id.toString(),
        name: e.class_id?.name || "",
        status: e.class_id?.status || "",
      },
      course: {
        id: e.class_id?.course_id?._id.toString(),
        code: e.class_id?.course_id?.code || "",
        name: e.class_id?.course_id?.name || "",
      },
      enrolled_at: e.enrolled_at,
    }));

    return result;
  },

  // -------------------- enroll student --------------------
  create: async (data: CreateEnrollmentInput) => {
    const [classExists, studentExists] = await Promise.all([
      ClassModel.exists({ _id: data.class_id }),
      StudentModel.exists({ _id: data.student_id }),
    ]);

    if (!classExists) throw AppError.notFound("Class not found");
    if (!studentExists) throw AppError.notFound("Student not found");

    try {
      const enrollment = await EnrollmentModel.create({
        class_id: data.class_id,
        student_id: data.student_id,
        enrolled_at: new Date(),
      });

      // Sync conversation members
      await conversationService.conversation.syncConversationMembers(
        data.class_id.toString()
      );

      return { id: enrollment._id.toString() };
    } catch (err: any) {
      if (err.code === 11000) {
        throw AppError.badRequest("Student already enrolled in this class");
      }
      throw err;
    }
  },

  // -------------------- unenroll student --------------------
  remove: async (id: string) => {
    const enrollment = await EnrollmentModel.findByIdAndDelete(id);
    if (!enrollment) throw AppError.notFound("Enrollment not found");
  },
};
