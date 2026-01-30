import { Types } from "mongoose";

export interface IEnrollment {
  id?: string;
  class_id: Types.ObjectId;
  student_id: Types.ObjectId;
  enrolled_at: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
