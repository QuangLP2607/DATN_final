import { z } from "zod";
import { paginationQuerySchema, Pagination } from "../../../utils/zod";
import { IMedia } from "../../../interfaces/media";
import { ILectureVideo } from "../../../interfaces/lectureVideo";

export const GetByClassSchema = paginationQuerySchema
  .extend({
    sortBy: z.enum(["name", "code", "createdAt"]).default("name"),
  })
  .strict();

export type GetByClassInput = z.infer<typeof GetByClassSchema>;

export interface LectureWithUrls
  extends Pick<ILectureVideo, "id" | "class_id" | "createdAt" | "updatedAt"> {
  video: Pick<IMedia, "id" | "file_name" | "file_type" | "file_size"> & {
    url?: string;
  };
  thumbnail?: Pick<IMedia, "id" | "file_name" | "file_type" | "file_size"> & {
    url?: string;
  };
}

export interface GetByClassResponse {
  lectures: LectureWithUrls[];
  pagination: Pagination;
}
