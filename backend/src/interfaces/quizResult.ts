import { Types } from "mongoose";

export interface IQuizResult {
  id?: string;
  quiz_id: Types.ObjectId;
  user_id: Types.ObjectId;
  answers: number[];
  correctCount?: number;
  score?: number;
  submittedAt?: Date;
}
