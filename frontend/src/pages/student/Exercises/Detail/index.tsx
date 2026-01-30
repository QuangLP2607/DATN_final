import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import quizApi from "@/services/quizService";
import quizAttemptApi from "@/services/quizAttemptService";

import Loading from "@/components/ui/Loading";
import Alert, { type AlertData } from "@/components/commons/Alert";
import { PageBackButton } from "@/components/ui/PageBackButton";

import styles from "./ExerciseDetail.module.scss";

const cx = classNames.bind(styles);

/* ================= Types ================= */

interface StudentQuestion {
  id: string;
  content: string;
  options: string[];
}

interface StudentAnswer {
  questionId: string;
  selectedIndex: number | null;
}

interface QuizResult {
  score: number;
  total: number;
}

/* ================= Component ================= */

export default function QuizAttempt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  /* ================= Fetch ================= */

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const quiz = await quizApi.getDetail(id);

        setQuestions(
          quiz.questions.map((q) => ({
            id: q._id!,
            content: q.content,
            options: q.options,
          })),
        );

        setAnswers(
          quiz.questions.map((q) => ({
            questionId: q._id!,
            selectedIndex: null,
          })),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= Actions ================= */

  const selectAnswer = (index: number) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, selectedIndex: index } : a,
      ),
    );
  };

  const submitQuiz = async () => {
    if (answers.some((a) => a.selectedIndex === null)) {
      return setAlert({
        type: "warning",
        title: "Chưa hoàn thành",
        content: "Vẫn còn câu hỏi chưa trả lời",
        duration: 3000,
      });
    }

    setSubmitting(true);

    try {
      const res = await quizAttemptApi.submit(id!, {
        answers: answers.map((a) => ({
          question_id: a.questionId,
          selectedIndex: a.selectedIndex!,
        })),
      });

      setResult({
        score: res.score,
        total: res.totalQuestions,
      });
      setAttemptId(res.attemptId);

      setShowResult(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers((prev) => prev.map((a) => ({ ...a, selectedIndex: null })));
    setCurrentIndex(0);
    setShowResult(false);
  };

  /* ================= Render ================= */

  if (loading) return <Loading />;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className={cx("question-detail")}>
      <PageBackButton title="Làm bài quiz" />

      {/* ================= NAV ================= */}
      <div className={cx("question-detail__grid")}>
        {questions.map((_, i) => {
          const answered = answers[i].selectedIndex !== null;

          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cx(
                "question-detail__grid-item",
                answered ? "success-light" : "info-light",
                { active: i === currentIndex },
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* ================= CONTENT ================= */}
      <div className={cx("question-detail__content")}>
        <h4>Câu {currentIndex + 1}</h4>

        <textarea
          className={cx("question-input")}
          value={currentQuestion.content}
          readOnly
        />

        {/* OPTIONS */}
        <div className={cx("options")}>
          {currentQuestion.options.map((opt, i) => (
            <div key={i} className={cx("option-row")}>
              <button
                type="button"
                className={cx("radio-icon", {
                  active: currentAnswer.selectedIndex === i,
                })}
                onClick={() => selectAnswer(i)}
              >
                <Icon
                  icon={
                    currentAnswer.selectedIndex === i
                      ? "mdi:radiobox-marked"
                      : "mdi:radiobox-blank"
                  }
                />
              </button>

              <input className={cx("option-input")} value={opt} readOnly />
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className={cx("actions")}>
          <button
            className={cx("primary")}
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            Trước
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className={cx("primary")}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Tiếp
            </button>
          ) : (
            <button
              className={cx("primary")}
              disabled={submitting}
              onClick={submitQuiz}
            >
              {submitting ? "Đang nộp..." : "Nộp bài"}
            </button>
          )}
        </div>
      </div>

      {/* ================= RESULT MODAL ================= */}
      {showResult && result && (
        <div className={cx("result-overlay")}>
          <div className={cx("result-modal")}>
            <h3>🎉 Hoàn thành bài quiz</h3>

            <p className={cx("score")}>
              Bạn đúng <strong>{result.score}</strong> / {result.total} câu
            </p>

            <div className={cx("result-actions")}>
              <button
                className={cx("primary")}
                onClick={() => navigate(`/attempt/${attemptId}`)}
              >
                Xem kết quả
              </button>

              <button className={cx("outline")} onClick={resetQuiz}>
                Làm lại
              </button>
            </div>
          </div>
        </div>
      )}

      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
    </div>
  );
}
