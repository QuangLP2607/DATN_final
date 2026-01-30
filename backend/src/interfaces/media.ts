import { Types } from "mongoose";

export interface IMedia {
  _id: string;
  id?: Types.ObjectId;
  file_name: string;
  file_key: string;
  file_type: string;
  file_size?: number;
  uploaded_by?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
