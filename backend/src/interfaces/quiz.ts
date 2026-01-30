import { Types } from "mongoose";

export const QUIZ_STATUSES = ["draft", "published", "closed"] as const;

export type QuizStatus = (typeof QUIZ_STATUSES)[number];

export interface IQuestion {
  _id?: Types.ObjectId;
  content: string;
  options: string[];
  correctOptionIndex: number;
  order: number;
}

export interface IQuiz {
  id?: string;
  title: string;
  class_id: Types.ObjectId;
  thumbnail_id?: Types.ObjectId;
  description?: string;
  questions: IQuestion[];
  totalScore?: number;
  duration: number;
  status: QuizStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
