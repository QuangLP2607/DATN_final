import type { ApiResponse } from "@/interfaces/common";
import type { Media } from "@/interfaces/media";
import apiClient from "./apiClient";

/* ===================== Types ===================== */
export const UPLOAD_PURPOSES = [
  "lecture/video",
  "video/thumbnail",
  "quiz/thumbnail",
  "user/avatar",
  "chat/img",
  "chat/video",
  "chat/file",
] as const;

export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

export interface UploadUrlPayload extends Pick<Media, "file_type"> {
  domain_id: string;
  purpose: UploadPurpose;
  onProgress?: (percent: number) => void;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fields: Record<string, string>;
  fileKey: string;
}

export interface DownloadUrlResponse {
  url: string;
}

export type CreateMediaPayload = Pick<Media, "file_key" | "file_name">;

export type UpdateMediaPayload = Pick<Media, "file_name">;

/* ===================== INTERNAL ===================== */

async function uploadMediaInternal(
  file: File,
  payload: UploadUrlPayload,
  signal?: AbortSignal,
): Promise<Media> {
  const { uploadUrl, fields, fileKey } = await mediaApi.getUploadUrl(payload);

  await mediaApi.uploadFileToS3(
    file,
    uploadUrl,
    fields,
    payload.onProgress,
    signal,
  );

  const media = await mediaApi.create({
    file_key: fileKey,
    file_name: file.name,
  });

  return mediaApi.getViewUrl(media.id);
}

/* ===================== API ===================== */
const mediaApi = {
  async getUploadUrl(payload: UploadUrlPayload): Promise<UploadUrlResponse> {
    const res = await apiClient.post<ApiResponse<UploadUrlResponse>>(
      "media/upload-url",
      payload,
    );
    return res.data.data!;
  },

  async uploadFileToS3(
    file: File,
    uploadUrl: string,
    fields: Record<string, string>,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("file", file);

      signal?.addEventListener("abort", () => {
        xhr.abort();
        reject(new DOMException("Aborted", "AbortError"));
      });

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress?.(percent);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error("Upload thất bại"));
      };

      xhr.onerror = () => reject(new Error("Upload thất bại"));

      xhr.open("POST", uploadUrl);
      xhr.send(formData);
    });
  },

  async getViewUrl(id: string): Promise<Media> {
    const res = await apiClient.get<ApiResponse<Media>>(`media/${id}/view-url`);
    return res.data.data!;
  },

  async getDownloadUrl(id: string): Promise<string> {
    const res = await apiClient.get<ApiResponse<DownloadUrlResponse>>(
      `media/${id}/download-url`,
    );
    return res.data.data!.url;
  },

  async create(payload: CreateMediaPayload): Promise<Media> {
    const res = await apiClient.post<ApiResponse<Media>>("media", payload);
    return res.data.data!;
  },

  async update(id: string, payload: UpdateMediaPayload): Promise<Media> {
    const res = await apiClient.patch<ApiResponse<Media>>(
      `media/${id}`,
      payload,
    );
    return res.data.data!;
  },

  async delete(id: string) {
    return apiClient.delete(`media/${id}`);
  },

  /* ---------- public ---------- */

  async uploadMedia(
    file: File,
    payload: UploadUrlPayload,
    signal?: AbortSignal,
  ): Promise<Media> {
    return uploadMediaInternal(file, payload, signal);
  },

  async replaceMedia(
    oldMediaId: string | null,
    file: File,
    payload: UploadUrlPayload,
    signal?: AbortSignal,
  ): Promise<Media> {
    const media = await uploadMediaInternal(file, payload, signal);

    if (oldMediaId) await this.delete(oldMediaId);

    return media;
  },
};

export default mediaApi;
