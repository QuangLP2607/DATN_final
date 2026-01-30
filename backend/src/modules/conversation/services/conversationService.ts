import AppError from "../../../core/AppError";
import { ConversationModel } from "../../../models/Conversation";
import { ClassModel } from "../../../models/Class";
import { EnrollmentModel } from "../../../models/Enrollment";
import { MediaModel } from "../../../models/Media";
import { fetchS3Url } from "../../../utils/s3UrlCache";
import { JoinClassResponse } from "../dto/joinClass";
import { Types } from "mongoose";

export default {
  // -------------------- sync conversation members --------------------
  syncConversationMembers: async (classId: string) => {
    const convo = await ConversationModel.findOne({
      class_id: new Types.ObjectId(classId),
    });
    if (!convo) return;

    const classData = await ClassModel.findById(classId).lean();
    if (!classData) return;

    const enrollments = await EnrollmentModel.find({
      class_id: classId,
    }).lean();
    const teacherIds = classData.teacher_ids ?? [];
    const studentIds = enrollments.map((e) => e.student_id);

    const memberIds = [
      ...new Set([...teacherIds, ...studentIds].map((id) => id.toString())),
    ].map((id) => new Types.ObjectId(id));

    convo.member_ids = memberIds;
    await convo.save();
  },

  // -------------------- join class --------------------
  joinClass: async (classId: string): Promise<JoinClassResponse> => {
    const convo = await ConversationModel.findOne({
      class_id: classId,
    }).populate("member_ids", "email username avatar_id");

    if (!convo) {
      throw AppError.notFound("Conversation not found");
    }

    const members = await Promise.all(
      (convo.member_ids as any[]).map(async (member) => {
        let avatar_url = "";
        if (member.avatar_id) {
          const media = await MediaModel.findById(member.avatar_id);
          if (media?.file_key) {
            avatar_url = await fetchS3Url(media.file_key);
          }
        }
        return {
          id: member._id.toString(),
          email: member.email,
          username: member.username,
          avatar_url,
        };
      })
    );

    return { id: convo._id.toString(), members };
  },
};
