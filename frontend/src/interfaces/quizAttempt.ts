export interface QuizAttemptAnswer {
  question_id: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  totalQuestions: number;
  answers: QuizAttemptAnswer[];
  createdAt: string;
}

export interface AttemptQuestion {
  id: string;
  content: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
}

export interface AttemptDetail {
  score: number;
  total: number;
  attemptNumber: number;
  submittedAt: string;
  questions: AttemptQuestion[];
}
