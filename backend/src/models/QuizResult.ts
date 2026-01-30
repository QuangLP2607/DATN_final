// import { Schema, model } from "mongoose";
// import { IQuizResult } from "../interfaces/quizResult";

// const quizResultSchema = new Schema<IQuizResult>(
//   {
//     quiz_id: {
//       type: Schema.Types.ObjectId,
//       ref: "Quiz",
//       required: true,
//     },

//     user_id: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     answers: {
//       type: [Number],
//       default: [],
//     },

//     correctCount: {
//       type: Number,
//       default: 0,
//     },

//     score: {
//       type: Number,
//       default: 0,
//     },

//     submittedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /**
//  * One quiz result per user per quiz
//  */
// quizResultSchema.index({ quiz_id: 1, user_id: 1 }, { unique: true });

// export const QuizResultModel = model<IQuizResult>(
//   "QuizResult",
//   quizResultSchema,
//   "quiz_results"
// );
