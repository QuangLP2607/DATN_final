import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Exercises.module.scss";
import { Icon } from "@iconify/react";

import { useClass } from "@/hooks/useClass";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useQuizzesQuery } from "@/hooks/queries/useQuizzesQuery";

import { PaginationControls } from "@/components/commons/PaginationControls";
import SearchBar from "@/components/commons/SearchBar";
import Filters from "../components/Filters";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

import type { GetQuizzesParams } from "@/services/quizService";

const cx = classNames.bind(styles);

/* ---------- Utils ---------- */
const FALLBACK_COLORS = [
  "#4A90E2",
  "#50E3C2",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FFA500",
  "#FF7043",
  "#F06292",
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
    status: "published",
  });

  const [draftFilters, setDraftFilters] = useState({
    status: "all" as "all" | "published" | "closed" | "draft",
  });

  const { data, isLoading } = useQuizzesQuery({
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

  const quizzes = data?.quizzes || [];

  return (
    <div className={cx("exercises")}>
      {/* Header */}
      <div className={cx("exercises__header")}>
        <h2>Bài tập</h2>

        <div className={cx("exercises__header-toolbar")}>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Tìm bài tập..."
          />

          <Filters
            filters={{ status: draftFilters.status }}
            onChange={(key, value) =>
              setDraftFilters((prev) => ({ ...prev, [key]: value }))
            }
            onClear={() => setDraftFilters({ status: "all" })}
            onApply={() =>
              setFilters((prev) => ({
                ...prev,
                ...draftFilters,
                page: 1,
              }))
            }
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Loading />
      ) : quizzes.length === 0 ? (
        <Empty
          icon="mdi:clipboard-text-off"
          title="Chưa có bài tập"
          description="Hiện tại chưa có bài tập nào"
        />
      ) : (
        <div className={cx("exercises__content")}>
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className={cx("quiz-card")}
              onClick={() => navigate(`/exercises/${quiz.id}`)}
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
                    style={{ backgroundColor: getFallbackColor(index) }}
                  >
                    <span className={cx("thumb-text")}>
                      {getInitials(quiz.title)}
                    </span>
                  </div>
                )}
              </div>

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
                  <Icon icon="mdi:chevron-right" />
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
    </div>
  );
}
