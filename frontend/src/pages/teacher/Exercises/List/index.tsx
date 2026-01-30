import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Exercises.module.scss";
import { Icon } from "@iconify/react";

import { useClass } from "@/hooks/useClass";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useQuizzesQuery } from "@/hooks/queries/useQuizzesQuery";

import quizApi, {
  type QuizWithThumbnailUrl,
  type GetQuizzesParams,
} from "@/services/quizService";

import { PaginationControls } from "@/components/commons/PaginationControls";
import SearchBar from "@/components/commons/SearchBar";
import Filters from "../components/Filters";
import ExerciseEditModal from "../components/EditModal";

import Alert, {
  type AlertData,
  type AlertType,
} from "@/components/commons/Alert";
import ConfirmModal from "@/components/commons/ConfirmModal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const cx = classNames.bind(styles);

export type EditableQuiz = {
  id?: string;
  title: string;
  duration: number;
  totalScore: number;
  status: "draft" | "published" | "closed";
  class_id: string;
  thumbnail_id?: string | null;
  thumbnail_url?: string | null;
};

// ================= Utils =================

const FALLBACK_COLORS = [
  "#4A90E2",
  "#50E3C2",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FFA500",
  "#FF7043",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#90A4AE",
];

const getFallbackColor = (index: number) =>
  FALLBACK_COLORS[index % FALLBACK_COLORS.length];

const getInitials = (title: string) => {
  const words = title.trim().split(" ");
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return "0h00’";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${String(m).padStart(2, "0")}’`;
};

// ================= Component =================

export default function Quizzes() {
  const navigate = useNavigate();
  const { activeClass } = useClass();
  const classId = activeClass?.id;

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  const [filters, setFilters] = useState<GetQuizzesParams>({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "startDate",
    order: "desc",
    status: "all",
  });

  const [draftFilters, setDraftFilters] = useState<GetQuizzesParams>(filters);

  const [alert, setAlert] = useState<AlertData | null>(null);

  const [editingQuiz, setEditingQuiz] = useState<EditableQuiz | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizWithThumbnailUrl | null>(
    null,
  );

  const showAlert = (
    title: string | undefined,
    content: string,
    type: AlertType = "success",
    duration = 3000,
  ) => {
    setAlert(null);
    setTimeout(() => setAlert({ title, content, type, duration }), 10);
  };

  const { data, isLoading, refetch } = useQuizzesQuery({
    class_id: classId!,
    ...filters,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  if (!classId) return <p>Vui lòng chọn lớp</p>;

  const quizzes = data?.quizzes ?? [];

  // ================= Delete =================

  const openDeleteConfirm = (quiz: QuizWithThumbnailUrl) => {
    setSelectedQuiz(quiz);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    try {
      await quizApi.delete(selectedQuiz.id);
      showAlert("Thành công", "Đã xóa quiz");
      refetch();
    } catch {
      showAlert("Thất bại", "Xóa quiz thất bại", "error", 5000);
    } finally {
      setConfirmOpen(false);
      setSelectedQuiz(null);
    }
  };

  // ================= Edit =================

  const handleCloseEditModal = () => {
    setEditingQuiz(null);
    refetch();
  };

  const openEditQuiz = (quiz: QuizWithThumbnailUrl) => {
    setEditingQuiz({
      id: quiz.id,
      title: quiz.title,
      duration: quiz.duration ?? 1,
      totalScore: quiz.totalScore ?? 0,
      status: quiz.status ?? "draft",
      class_id: classId!,
      thumbnail_url: quiz.thumbnail_url ?? null,
    });
  };

  return (
    <div className={cx("exercises")}>
      {/* Header */}
      <div className={cx("exercises__header")}>
        <h2>Quizzes</h2>

        <div className={cx("toolbar")}>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search quiz..."
            className={cx("toolbar__search")}
          />

          <Filters
            filters={{ status: draftFilters.status || "all" }}
            onChange={(key, value) =>
              setDraftFilters((prev) => ({
                ...prev,
                [key]: value,
              }))
            }
            onClear={() =>
              setDraftFilters((prev) => ({
                ...prev,
                order: "desc",
              }))
            }
            onApply={() =>
              setFilters({
                ...filters,
                ...draftFilters,
                search: debouncedSearch,
                page: 1,
              })
            }
          />
        </div>

        <button
          className={cx("add-btn")}
          onClick={() =>
            setEditingQuiz({
              title: "",
              duration: 1,
              totalScore: 0,
              status: "draft",
              class_id: classId,
              thumbnail_url: null,
            })
          }
        >
          <Icon icon="tabler:plus" /> Thêm quiz
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <Loading />
      ) : quizzes.length === 0 ? (
        <Empty
          icon="mdi:clipboard-text-off"
          title="Chưa có bài tập nào"
          description="Thêm quiz để bắt đầu."
        />
      ) : (
        <div className={cx("exercises__content")}>
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className={cx("quiz-card")}
              onClick={() => navigate(`${quiz.id}`)}
            >
              <div className={cx("thumb")}>
                {quiz.thumbnail_url ? (
                  <img
                    src={quiz.thumbnail_url}
                    alt={quiz.title}
                    className={cx("thumb-img")}
                  />
                ) : (
                  <div
                    className={cx("thumb-fallback")}
                    style={{
                      backgroundColor: getFallbackColor(index),
                    }}
                  >
                    <span className={cx("thumb-text")}>
                      {getInitials(quiz.title)}
                    </span>
                  </div>
                )}
              </div>

              <div className={cx("status", quiz.status)}>{quiz.status}</div>

              <div className={cx("info")}>
                <div className={cx("info-left")}>
                  <h3 className={cx("title")}>{quiz.title}</h3>
                  <div className={cx("meta")}>
                    <p className={cx("meta-item")}>
                      <Icon icon="hugeicons:clock-01" />
                      {formatDuration(quiz.duration)}
                    </p>
                    <p className={cx("meta-item")}>
                      <Icon icon="hugeicons:task-done-01" />
                      {quiz.totalScore ?? 0} câu
                    </p>
                  </div>
                </div>

                <div className={cx("info-right")}>
                  <button
                    className={cx("btn")}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditQuiz(quiz);
                    }}
                  >
                    <Icon icon="tabler:edit" />
                  </button>

                  <button
                    className={cx("btn")}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirm(quiz);
                    }}
                  >
                    <Icon icon="mdi:trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className={cx("exercises__pagination")}>
        <PaginationControls
          currentPage={filters.page}
          totalPages={data?.pagination.totalPages || 1}
          itemsPerPage={filters.limit}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onItemsPerPageChange={(limit) =>
            setFilters((prev) => ({ ...prev, limit, page: 1 }))
          }
        />
      </div>

      {/* Edit Modal */}
      {editingQuiz && (
        <ExerciseEditModal
          quiz={editingQuiz}
          onUpdated={handleCloseEditModal}
          onClose={handleCloseEditModal}
        />
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        open={confirmOpen}
        title="Xóa quiz"
        message={`Bạn có chắc muốn xóa "${selectedQuiz?.title}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Alert */}
      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
    </div>
  );
}
