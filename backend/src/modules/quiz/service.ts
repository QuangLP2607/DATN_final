import AppError from "../../core/AppError";
import { QuizModel } from "../../models/Quiz";
import { ClassModel } from "../../models/Class";
import { MediaModel } from "../../models/Media";
import { normalizeMongo } from "../../utils/mongoNormalize";
import { Types } from "mongoose";
import { fetchS3Url } from "../../utils/s3UrlCache";
import {
  SearchQuizInput,
  SearchQuizResponse,
  QuizWithThumbnailUrl,
} from "./dto/searchQuiz";
import { CreateQuizInput } from "./dto/createQuiz";
import { UpdateQuizInput } from "./dto/updateQuiz";
import { CreateQuestionsInput } from "./dto/createQuestions";

export class QuizService {
  constructor(private deleteMedia: (id: string) => Promise<void>) {}

  // -------------------- search quiz --------------------
  async search(data: SearchQuizInput): Promise<SearchQuizResponse> {
    const {
      page,
      limit,
      sortBy = "startDate",
      order = "desc",
      search,
      status,
      class_id,
      from,
      to,
    } = data;

    const skip = (page - 1) * limit;
    const match: any = {};

    if (class_id) match.class_id = new Types.ObjectId(class_id);

    if (status && status !== "all") match.status = status;

    if (from || to) {
      match.startDate = {};
      if (from) match.startDate.$gte = new Date(from);
      if (to) match.startDate.$lte = new Date(to);
    }

    if (search?.trim()) {
      match.title = { $regex: search.trim(), $options: "i" };
    }

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: "media",
          localField: "thumbnail_id",
          foreignField: "_id",
          as: "thumbnail",
        },
      },
      {
        $unwind: {
          path: "$thumbnail",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { [sortBy]: order === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          duration: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          totalScore: 1,
          thumbnail_key: "$thumbnail.file_key",
        },
      },
    ];

    const quizzesRaw = await QuizModel.aggregate(pipeline);
    const total = await QuizModel.countDocuments(match);

    const quizzes: QuizWithThumbnailUrl[] = await Promise.all(
      quizzesRaw.map(async (q) => ({
        id: q._id.toString(),
        title: q.title,
        description: q.description,
        duration: q.duration,
        startDate: q.startDate,
        endDate: q.endDate,
        status: q.status,
        totalScore: q.totalScore,
        thumbnail_url: q.thumbnail_key ? await fetchS3Url(q.thumbnail_key) : "",
      })),
    );

    return {
      quizzes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // -------------------- get quiz detail --------------------
  async getDetail(id: string) {
    const quiz = await QuizModel.findById(id).lean();
    if (!quiz) throw AppError.notFound("Quiz not found");

    return normalizeMongo(quiz);
  }

  // -------------------- create quiz --------------------
  async create(data: CreateQuizInput) {
    const classExists = await ClassModel.exists({ _id: data.class_id });
    if (!classExists) throw AppError.badRequest("Class not found");

    if (data.thumbnail_id) {
      const thumbExists = await MediaModel.exists({ _id: data.thumbnail_id });
      if (!thumbExists) throw AppError.badRequest("Thumbnail not found");
    }

    const quiz = await QuizModel.create(data);
    return normalizeMongo(quiz.toObject());
  }

  // -------------------- update quiz --------------------
  async update(id: string, data: UpdateQuizInput) {
    const quiz = await QuizModel.findById(id);
    if (!quiz) throw AppError.notFound("Quiz not found");

    if (quiz.status === "closed") {
      throw AppError.badRequest("Closed quiz cannot be updated");
    }

    if (data.thumbnail_id) {
      const thumbExists = await MediaModel.exists({ _id: data.thumbnail_id });
      if (!thumbExists) throw AppError.badRequest("Thumbnail not found");
    }

    const allowedFields: (keyof UpdateQuizInput)[] = [
      "title",
      "description",
      "thumbnail_id",
      "duration",
      "status",
      "startDate",
      "endDate",
    ];

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        (quiz as any)[key] =
          key === "startDate" || key === "endDate"
            ? new Date(data[key] as string)
            : data[key];
      }
    }

    await quiz.save();
    return normalizeMongo(quiz.toObject());
  }

  // -------------------- update questions (overwrite all) --------------------
  async updateQuestions(id: string, data: CreateQuestionsInput) {
    const quiz = await QuizModel.findById(id);
    if (!quiz) throw AppError.notFound("Quiz not found");

    quiz.questions = data.questions.map((q, idx) => ({
      ...q,
      order: idx + 1,
    }));

    await quiz.save();
    return { totalQuestions: quiz.questions.length };
  }

  // -------------------- delete quiz --------------------
  async delete(id: string) {
    const quiz = await QuizModel.findById(id);
    if (!quiz) throw AppError.notFound("Quiz not found");

    if (quiz.thumbnail_id) {
      await this.deleteMedia(quiz.thumbnail_id.toString());
    }

    await quiz.deleteOne();
  }
}
