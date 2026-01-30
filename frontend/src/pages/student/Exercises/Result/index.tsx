import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import type { ReactElement } from "react";

import quizAttemptApi from "@/services/quizAttemptService";
import type { AttemptDetail } from "@/services/quizAttemptService";

import Loading from "@/components/ui/Loading";
import { PageBackButton } from "@/components/ui/PageBackButton";

import styles from "./Result.module.scss";

const cx = classNames.bind(styles);

export default function StudentExerciseResult(): ReactElement {
  const { id: attemptId } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);

  useEffect(() => {
    if (!attemptId) return;

    (async () => {
      setLoading(true);
      try {
        const data = await quizAttemptApi.getAttemptDetail(attemptId);
        setAttempt(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [attemptId]);

  if (loading) return <Loading />;

  if (!attempt) {
    return (
      <div className={cx("result-page")}>
        <PageBackButton title="Kết quả bài quiz" />
        <p className={cx("empty")}>Không tìm thấy kết quả bài làm.</p>
      </div>
    );
  }

  return (
    <div className={cx("result-page")}>
      <PageBackButton title="Kết quả bài quiz" />

      <h3 className={cx("score")}>
        Điểm: {attempt.score} / {attempt.total}
      </h3>

      {attempt.questions.map((q, idx) => (
        <div key={q.id} className={cx("question")}>
          <h4>Câu {idx + 1}</h4>
          <p className={cx("content")}>{q.content}</p>

          <ul className={cx("options")}>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = i === q.selectedIndex;

              return (
                <li
                  key={i}
                  className={cx("option", {
                    correct: isCorrect,
                    wrong: isSelected && !isCorrect,
                  })}
                >
                  {opt}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
