import { Types } from "mongoose";

/* ================= Answer ================= */

export interface IQuizAttemptAnswer {
  question_id: Types.ObjectId;
  selectedIndex: number;
}

/* ================= Quiz Attempt ================= */

export interface IQuizAttempt {
  quiz_id: Types.ObjectId;
  student_id: Types.ObjectId;

  answers: IQuizAttemptAnswer[];

  score: number;

  attemptNumber: number; // lần làm thứ mấy
  submittedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
