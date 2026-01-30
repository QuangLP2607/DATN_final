import AppError from "../../core/AppError";
import { LectureVideoModel } from "../../models/LectureVideo";
import { ClassModel } from "../../models/Class";
import { normalizeMongoDoc } from "../../utils/mongoNormalize";
import { fetchS3Url } from "../../utils/s3UrlCache";
import { SaveInput } from "./dto/create";
import { UpdateInput } from "./dto/update";
import { GetByClassInput, GetByClassResponse } from "./dto/getByClass";
import { Types } from "mongoose";

export class LectureVideoService {
  constructor(private deleteMedia: (id: string) => Promise<void>) {}

  // ==================== helpers ====================
  private async deleteIfChanged(
    oldId?: Types.ObjectId | null,
    newId?: Types.ObjectId | null,
  ) {
    if (!oldId) return;

    if (!newId || !oldId.equals(newId)) {
      await this.deleteMedia(oldId.toString());
    }
  }

  // ==================== get by class ====================
  async getByClass(
    classId: string,
    data: GetByClassInput,
  ): Promise<GetByClassResponse> {
    const { page, limit, sortBy, order, search } = data;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      { $match: { class_id: new Types.ObjectId(classId) } },

      {
        $lookup: {
          from: "media",
          localField: "video_id",
          foreignField: "_id",
          as: "video",
        },
      },
      { $unwind: "$video" },

      {
        $lookup: {
          from: "media",
          localField: "thumbnail_id",
          foreignField: "_id",
          as: "thumbnail",
        },
      },
      { $unwind: { path: "$thumbnail", preserveNullAndEmptyArrays: true } },
    ];

    if (search?.trim()) {
      pipeline.push({
        $match: {
          "video.file_name": { $regex: search.trim(), $options: "i" },
        },
      });
    }

    pipeline.push(
      { $sort: { [sortBy]: order === "asc" ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          id: { $toString: "$_id" },
          class_id: { $toString: "$class_id" },
          createdAt: 1,
          updatedAt: 1,

          video: {
            id: { $toString: "$video._id" },
            file_name: "$video.file_name",
            file_type: "$video.file_type",
            file_size: "$video.file_size",
            file_key: "$video.file_key",
          },

          thumbnail: {
            id: { $toString: "$thumbnail._id" },
            file_name: "$thumbnail.file_name",
            file_type: "$thumbnail.file_type",
            file_size: "$thumbnail.file_size",
            file_key: "$thumbnail.file_key",
          },
        },
      },
    );

    const lectures = await LectureVideoModel.aggregate(pipeline);
    const total = await LectureVideoModel.countDocuments({
      class_id: classId,
    });

    for (const lv of lectures) {
      if (lv.video.file_key) {
        lv.video.url = await fetchS3Url(lv.video.file_key);
      }

      if (lv.thumbnail?.file_key) {
        lv.thumbnail.url = await fetchS3Url(lv.thumbnail.file_key);
      }
    }

    return {
      lectures,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== create ====================
  async save(data: SaveInput) {
    const classExists = await ClassModel.exists({
      _id: data.class_id,
    });
    if (!classExists) throw AppError.notFound("Class not found");

    const lecture = await LectureVideoModel.create({
      class_id: new Types.ObjectId(data.class_id),
      video_id: new Types.ObjectId(data.video_id),
      thumbnail_id: data.thumbnail_id
        ? new Types.ObjectId(data.thumbnail_id)
        : undefined,
    });

    return normalizeMongoDoc(lecture);
  }

  // ==================== update ====================
  async update(id: string, data: UpdateInput) {
    const oldLecture = await LectureVideoModel.findById(id);
    if (!oldLecture) {
      throw AppError.notFound("Lecture video not found");
    }

    const updateData: any = {};

    const newVideoId =
      data.video_id !== undefined
        ? data.video_id
          ? new Types.ObjectId(data.video_id)
          : null
        : undefined;

    const newThumbnailId =
      data.thumbnail_id !== undefined
        ? data.thumbnail_id
          ? new Types.ObjectId(data.thumbnail_id)
          : null
        : undefined;

    if (newVideoId !== undefined) {
      updateData.video_id = newVideoId;
    }

    if (newThumbnailId !== undefined) {
      updateData.thumbnail_id = newThumbnailId;
    }

    const updated = await LectureVideoModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    return normalizeMongoDoc(updated!);
  }

  // ==================== delete ====================
  async delete(id: string) {
    const lecture = await LectureVideoModel.findById(id);
    if (!lecture) {
      throw AppError.notFound("Lecture video not found");
    }

    if (lecture.video_id) {
      await this.deleteMedia(lecture.video_id.toString());
    }

    if (lecture.thumbnail_id) {
      await this.deleteMedia(lecture.thumbnail_id.toString());
    }

    await lecture.deleteOne();
    return { id };
  }
}
