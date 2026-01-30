import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import { Icon } from "@iconify/react";

import quizApi from "@/services/quizService";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Alert, { type AlertData } from "@/components/commons/Alert";
import { PageBackButton } from "@/components/ui/PageBackButton";

import styles from "./QuestionDetail.module.scss";
import type { Question, Quiz } from "@/interfaces/quiz";

const cx = classNames.bind(styles);

/* ================= Types ================= */

interface FEQuestion extends Question {
  touched: boolean;
}

type Status = "info" | "success" | "warning";

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<FEQuestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<AlertData | null>(null);

  /* ================= Fetch ================= */

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const data = await quizApi.getDetail(id);

        setQuiz(data);

        const mapped: FEQuestion[] =
          data.questions?.map((q) => ({
            ...q,
            content: q.content ?? "",
            options: q.options?.length ? q.options : ["", ""],
            correctOptionIndex: Number.isInteger(q.correctOptionIndex)
              ? q.correctOptionIndex
              : 0,
            touched: false,
          })) || [];

        setQuestions(mapped);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= Utils ================= */

  const updateCurrent = (data: Partial<FEQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === selectedIndex ? { ...q, ...data, touched: true } : q,
      ),
    );
  };

  const removeOption = (index: number) => {
    const next = current.options.filter((_, i) => i !== index);

    let nextCorrect = current.correctOptionIndex;

    if (index === current.correctOptionIndex) nextCorrect = 0;
    if (index < current.correctOptionIndex) nextCorrect--;

    updateCurrent({
      options: next,
      correctOptionIndex: nextCorrect,
    });
  };

  const isValidQuestion = (q: FEQuestion) => {
    if (!q.content.trim()) return false;
    if (q.options.some((o) => !o.trim())) return false;
    if (!Number.isInteger(q.correctOptionIndex)) return false;
    return true;
  };

  const getQuestionStatus = (q: FEQuestion): Status => {
    if (!q.touched) return "info";
    return isValidQuestion(q) ? "success" : "warning";
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        content: "",
        options: ["", ""],
        correctOptionIndex: 0,
        order: prev.length + 1,
        touched: false,
      },
    ]);

    setSelectedIndex(questions.length);
  };

  const deleteQuestion = () => {
    if (questions.length <= 1) return;

    setQuestions((prev) => prev.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(0);
  };

  /* ================= Save ================= */

  const saveQuestions = async () => {
    if (!id) return;

    if (questions.some((q) => !isValidQuestion(q))) {
      return setAlert({
        type: "warning",
        title: "Thiếu dữ liệu",
        content: "Vẫn còn câu hỏi chưa hợp lệ",
        duration: 3000,
      });
    }

    const payload = {
      questions: questions.map((q, index) => ({
        content: q.content,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        order: index + 1,
      })),
    };

    setSaving(true);

    try {
      await quizApi.updateQuestions(id, payload);

      setAlert({
        type: "success",
        title: "Đã lưu",
        content: "Cập nhật câu hỏi thành công",
      });

      setQuestions((prev) => prev.map((q) => ({ ...q, touched: false })));
    } finally {
      setSaving(false);
    }
  };

  /* ================= Render ================= */

  if (loading) return <Loading />;

  if (!questions.length)
    return (
      <div className={cx("question-detail")}>
        <PageBackButton />
        <Empty
          icon="mdi:help-circle-outline"
          title="Không có câu hỏi nào"
          description="Hãy thêm câu hỏi đầu tiên cho bài quiz"
          action={
            <button className={cx("primary")} onClick={addQuestion}>
              <Icon icon="tabler:plus" /> Thêm câu hỏi
            </button>
          }
        />
      </div>
    );

  const current = questions[selectedIndex];

  return (
    <div className={cx("question-detail")}>
      <PageBackButton title={quiz?.title ?? ""} />

      {/* GRID */}
      <div className={cx("question-detail__grid")}>
        {questions.map((q, i) => {
          const status = getQuestionStatus(q);

          return (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cx("question-detail__grid-item", `${status}-light`, {
                active: i === selectedIndex,
              })}
            >
              {i + 1}
            </div>
          );
        })}

        <button onClick={addQuestion} className={cx("grid-add")}>
          <Icon icon="tabler:plus" />
        </button>
      </div>

      {/* CONTENT */}
      <div className={cx("question-detail__content")}>
        <h4>Câu {selectedIndex + 1}</h4>

        <textarea
          className={cx("question-input")}
          value={current.content}
          placeholder="Nhập câu hỏi"
          onChange={(e) => updateCurrent({ content: e.target.value })}
        />

        <div className={cx("options")}>
          {current.options.map((opt, i) => (
            <div key={i} className={cx("option-row")}>
              <button
                type="button"
                className={cx("radio-icon", {
                  active: i === current.correctOptionIndex,
                })}
                onClick={() => updateCurrent({ correctOptionIndex: i })}
              >
                <Icon
                  icon={
                    i === current.correctOptionIndex
                      ? "mdi:radiobox-marked"
                      : "mdi:radiobox-blank"
                  }
                />
              </button>

              <input
                className={cx("option-input")}
                value={opt}
                placeholder={`Đáp án ${i + 1}`}
                onChange={(e) => {
                  const next = [...current.options];
                  next[i] = e.target.value;
                  updateCurrent({ options: next });
                }}
              />

              {current.options.length > 2 && (
                <button
                  className={cx("option-remove")}
                  type="button"
                  onClick={() => removeOption(i)}
                >
                  <Icon icon="mdi:close" />
                </button>
              )}
            </div>
          ))}

          <button
            className={cx("add-option")}
            onClick={() =>
              updateCurrent({
                options: [...current.options, ""],
              })
            }
          >
            <Icon icon="tabler:plus" /> Thêm đáp án
          </button>
        </div>

        <div className={cx("actions")}>
          <button onClick={deleteQuestion} className={cx("danger")}>
            Xóa
          </button>

          <button
            disabled={saving}
            onClick={saveQuestions}
            className={cx("primary")}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
    </div>
  );
}
