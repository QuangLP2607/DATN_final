import { Types } from "mongoose";

export interface ILectureVideo {
  id?: Types.ObjectId;
  class_id: Types.ObjectId;
  video_id: Types.ObjectId;
  thumbnail_id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
