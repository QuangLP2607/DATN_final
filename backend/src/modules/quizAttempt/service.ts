import { Types } from "mongoose";
import AppError from "../../core/AppError";
import { QuizModel } from "../../models/Quiz";
import { QuizAttemptModel } from "../../models/QuizAttempt";
import { normalizeMongo } from "../../utils/mongoNormalize";
import { SubmitQuizAttemptInput } from "./dto/submitQuizAttempt";

class QuizAttemptService {
  // -------------------- submit attempt --------------------
  static async submitAttempt(
    studentId: string,
    quizId: string,
    data: SubmitQuizAttemptInput,
  ) {
    const quiz = await QuizModel.findById(quizId).lean();
    if (!quiz) throw AppError.notFound("Quiz not found");

    if (quiz.status !== "published") {
      throw AppError.badRequest("Quiz is not available");
    }

    // ✅ NEW: đếm số lần làm quiz của student này
    const attemptCount = await QuizAttemptModel.countDocuments({
      quiz_id: quizId,
      student_id: studentId,
    });

    const questionMap = new Map(
      quiz.questions.map((q) => [q._id!.toString(), q]),
    );

    let score = 0;

    const answers = data.answers.map((ans) => {
      const question = questionMap.get(ans.question_id);
      if (!question) {
        throw AppError.badRequest("Invalid question");
      }

      const isCorrect = ans.selectedIndex === question.correctOptionIndex;
      if (isCorrect) score++;

      return {
        question_id: new Types.ObjectId(ans.question_id),
        selectedIndex: ans.selectedIndex,
        isCorrect,
      };
    });

    const attempt = await QuizAttemptModel.create({
      quiz_id: quizId,
      student_id: studentId,
      attemptNumber: attemptCount + 1,
      answers,
      score,
      totalQuestions: quiz.questions.length,
    });

    return {
      attemptId: attempt._id.toString(),
      score,
      totalQuestions: quiz.questions.length,
    };
  }

  // -------------------- get attempts by student --------------------
  static async getAttemptsByStudent(quizId: string, studentId: string) {
    const attempts = await QuizAttemptModel.find({
      quiz_id: quizId,
      student_id: studentId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return attempts.map(normalizeMongo);
  }

  // -------------------- get attempt detail --------------------
  static async getAttemptDetail(attemptId: string, studentId: string) {
    const attempt = await QuizAttemptModel.findOne({
      _id: attemptId,
      student_id: studentId,
    }).lean();

    if (!attempt) {
      throw new AppError("Attempt not found", 404);
    }

    const quiz = await QuizModel.findById(attempt.quiz_id)
      .select("questions")
      .lean();

    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    const questions = quiz.questions.map((q) => {
      const answer = attempt.answers.find(
        (a) => a.question_id.toString() === q._id!.toString(),
      );

      return {
        id: q._id,
        content: q.content,
        options: q.options,
        correctIndex: q.correctOptionIndex,
        selectedIndex: answer?.selectedIndex ?? null,
      };
    });

    return {
      score: attempt.score,
      total: questions.length,
      attemptNumber: attempt.attemptNumber,
      submittedAt: attempt.submittedAt,
      questions,
    };
  }
}

export default QuizAttemptService;
