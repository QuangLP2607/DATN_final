import AppError from "../../core/AppError";
import { CourseModel } from "../../models/Course";
import { ClassModel } from "../../models/Class";
import {
  normalizeMongoList,
  normalizeMongoDoc,
} from "../../utils/mongoNormalize";
import {
  SearchCoursesInput,
  SearchCoursesResponse,
  CourseWithStats,
} from "./dto/searchCourses";
import { CreateCourseInput } from "./dto/createCourse";
import { UpdateCourseInput } from "./dto/updateCourse";

export default {
  // -------------------- search courses --------------------
  searchCourses: async (
    data: SearchCoursesInput
  ): Promise<SearchCoursesResponse> => {
    const { page, limit, sortBy, order, search } = data;

    const match: any = {};
    if (search?.trim()) {
      match.$or = [
        { code: { $regex: search.trim(), $options: "i" } },
        { name: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const result = await CourseModel.aggregate([
      { $match: match },

      {
        $lookup: {
          from: "classes",
          localField: "_id",
          foreignField: "course_id",
          as: "classes",
        },
      },

      {
        $addFields: {
          total_classes: { $size: "$classes" },
          active_classes: {
            $size: {
              $filter: {
                input: "$classes",
                as: "cls",
                cond: { $eq: ["$$cls.status", "active"] },
              },
            },
          },
        },
      },

      { $project: { classes: 0, __v: 0 } },

      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await CourseModel.countDocuments(match);

    return {
      courses: normalizeMongoList(result) as CourseWithStats[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // -------------------- get course by id --------------------
  getCourseById: async (id: string) => {
    const courseDoc = await CourseModel.findById(id);
    if (!courseDoc) throw AppError.notFound("Course not found");

    const classesDocs = await ClassModel.find({ course_id: courseDoc._id })
      .select("name start_date end_date status")
      .lean();

    const classList = classesDocs.map((cls) => ({
      id: cls._id.toString(),
      name: cls.name,
      start_date: cls.start_date,
      end_date: cls.end_date,
      status: cls.status,
    }));

    const course = normalizeMongoDoc(courseDoc);

    return {
      course: {
        ...course,
        total_classes: classList.length,
        active_classes: classList.filter((c) => c.status === "active").length,
      },
      classes: classList,
    };
  },

  // -------------------- create course --------------------
  createCourse: async (data: CreateCourseInput) => {
    const existing = await CourseModel.findOne({ code: data.code });
    if (existing) throw AppError.conflict("Course code already exists");
    const course = await CourseModel.create(data);
    return { id: course._id.toString() };
  },

  // -------------------- update course --------------------
  updateCourse: async (id: string, data: UpdateCourseInput) => {
    const course = await CourseModel.findById(id);
    if (!course) throw AppError.notFound("Course not found");
    Object.assign(course, data);
    await course.save();
  },
};
