import type {
  ApiResponse,
  ListParams,
  PaginatedResponse,
} from "@/interfaces/common";
import type { LectureVideo } from "@/interfaces/lectureVideo";
import type { Media } from "@/interfaces/media";

import apiClient from "./apiClient";
import mediaApi from "./mediaService";
import { generateVideoThumbnail } from "@/utils/generateVideoThumbnail";

// ===== Types ================================================================
export type GetLecturesParams = ListParams;

export interface CreatePayload {
  class_id: string;
  video_id: string;
  thumbnail_id?: string;
}

export type UpdatePayload = Partial<
  Pick<LectureVideo, "video_id" | "thumbnail_id">
>;

export interface LectureWithUrls extends Pick<
  LectureVideo,
  "id" | "class_id" | "createdAt" | "updatedAt"
> {
  video: Pick<Media, "id" | "file_name" | "file_type" | "file_size"> & {
    url?: string;
  };
  thumbnail?: Pick<Media, "id" | "file_name" | "file_type" | "file_size"> & {
    url?: string;
  };
}

export interface LectureRuntime extends LectureWithUrls {
  videoFile?: File;
}

// ===== API ================================================================
const lectureVideoApi = {
  /* ---------- basic ---------- */
  async create(payload: CreatePayload): Promise<LectureVideo> {
    const res = await apiClient.post<ApiResponse<LectureVideo>>(
      "lecture/save",
      payload,
    );
    return res.data.data!;
  },

  async getByClass(
    id: string,
    params: GetLecturesParams,
  ): Promise<PaginatedResponse<"lectures", LectureWithUrls>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResponse<"lectures", LectureWithUrls>>
    >(`lecture/class/${id}`, { params });

    return res.data.data!;
  },

  async update(id: string, payload: UpdatePayload): Promise<LectureVideo> {
    const res = await apiClient.patch<ApiResponse<LectureVideo>>(
      `lecture/${id}`,
      payload,
    );
    return res.data.data!;
  },

  async delete(id: string) {
    return apiClient.delete(`lecture/${id}`);
  },

  /* ---------- use cases ---------- */

  async uploadLectureVideo(
    file: File,
    classId: string,
    onProgress?: (p: number) => void,
    signal?: AbortSignal,
  ): Promise<LectureRuntime> {
    const video = await mediaApi.uploadMedia(
      file,
      {
        domain_id: classId,
        file_type: file.type,
        purpose: "lecture/video",
        onProgress,
      },
      signal,
    );

    const lecture = await this.create({
      class_id: classId,
      video_id: video.id,
    });

    return { ...lecture, video, videoFile: file };
  },

  // --------- generate thumbnail ----------
  async generateAutoThumbnail(
    lecture: LectureRuntime,
  ): Promise<LectureWithUrls> {
    if (lecture.thumbnail || !lecture.videoFile) return lecture;

    const thumbnailFile = await generateVideoThumbnail(lecture.videoFile, 10);

    const thumbnail = await mediaApi.uploadMedia(thumbnailFile, {
      domain_id: lecture.video.id,
      file_type: thumbnailFile.type,
      purpose: "video/thumbnail",
    });

    await this.update(lecture.id, {
      thumbnail_id: thumbnail.id,
    });

    return {
      ...lecture,
      thumbnail,
    };
  },
};

export default lectureVideoApi;
