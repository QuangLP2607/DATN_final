import type { Media } from "./media";

export interface LectureVideo {
  id: string;
  class_id: string;
  video_id: string;
  thumbnail_id?: string;
  createdAt?: string;
  updatedAt?: string;
  video: Media;
  thumbnail?: Media;
}
