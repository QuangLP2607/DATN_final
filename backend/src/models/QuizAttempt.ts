import { Schema, model } from "mongoose";
import { IQuizAttempt, IQuizAttemptAnswer } from "../interfaces/quizAttempt";

/* ================= Answer ================= */

const answerSchema = new Schema<IQuizAttemptAnswer>(
  {
    question_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    selectedIndex: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

/* ================= Quiz Attempt ================= */

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    answers: {
      type: [answerSchema],
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    attemptNumber: {
      type: Number,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

/* ================= Index ================= */

quizAttemptSchema.index({ quiz_id: 1, student_id: 1 });

/* ================= Model ================= */

export const QuizAttemptModel = model<IQuizAttempt>(
  "QuizAttempt",
  quizAttemptSchema,
  "quiz_attempts",
);
