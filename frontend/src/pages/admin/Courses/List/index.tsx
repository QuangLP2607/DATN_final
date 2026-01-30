import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Courses.module.scss";
import CustomerTable, { type Column } from "@/components/commons/CustomTable";
import { PaginationControls } from "@/components/commons/PaginationControls";
import CourseFormModal from "../components/CourseFormModal";
import { formatDateVN } from "@/utils/date";
import courseApi, { type SearchCourseResponse } from "@/services/courseService";
import Loading from "@/components/ui/Loading";
import Alert, { type AlertData } from "@/components/commons/Alert";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export default function Courses() {
  const navigate = useNavigate();

  // ===== STATE =====
  const [courses, setCourses] = useState<SearchCourseResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertData | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] =
    useState<SearchCourseResponse | null>(null);

  // ===== FETCH COURSES =====
  const fetchCourses = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await courseApi.search({
          page: currentPage,
          limit,
        });
        setCourses(res.courses || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (error: unknown) {
        console.error(error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [currentPage, limit],
  );

  useEffect(() => {
    fetchCourses(true);
  }, [fetchCourses]);

  // ===== TABLE COLUMNS =====
  const columns: Column<SearchCourseResponse>[] = [
    {
      label: "#",
      width: 1,
      align: "center",
      render: (_row, index) => (currentPage - 1) * limit + index + 1,
    },
    { label: "Mã KH", width: 2, render: (row) => row.code },
    { label: "Tên khóa học", width: 3, render: (row) => row.name },
    {
      label: "Lớp đang dạy",
      width: 2,
      align: "center",
      render: (row) => row.active_classes,
    },
    {
      label: "Số lớp đã mở",
      width: 2,
      align: "center",
      render: (row) => row.total_classes,
    },
    {
      label: "Trạng thái",
      width: 2,
      align: "center",
      render: (row) => (
        <div
          className={cx(
            "course-status",
            `course-status--${row.status.toLowerCase()}`,
          )}
        >
          {row.status}
        </div>
      ),
    },
    {
      label: "Ngày tạo",
      width: 2,
      align: "right",
      render: (row) => formatDateVN(row.createdAt),
    },
    {
      label: "Hành động",
      width: 2,
      align: "center",
      render: (row) => (
        <div
          className={cx("course__table-actions")}
          role="group"
          aria-label="Hành động"
        >
          <button
            className={cx(
              "course__table-actions-btn",
              "course__table-actions-btn--view",
            )}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/course/${row.id}`);
            }}
            aria-label="Xem khóa học"
          >
            <Icon icon="mdi:eye-outline" />
          </button>

          <button
            className={cx(
              "course__table-actions-btn",
              "course__table-actions-btn--edit",
            )}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditingCourse(row);
              setOpenForm(true);
            }}
            aria-label="Sửa khóa học"
          >
            <Icon icon="mdi:pencil-outline" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={cx("course")}>
      {/* ===== ALERT ===== */}
      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}

      {/* ===== HEADER ===== */}
      <div className={cx("course__header")}>
        <h2>Danh sách khóa học</h2>
        <div className={cx("course__header-actions")}>
          <button
            className={cx("add-btn")}
            onClick={() => {
              setEditingCourse(null);
              setOpenForm(true);
            }}
          >
            <Icon icon="material-symbols:add-2-rounded" /> Thêm khóa học
          </button>
        </div>
      </div>

      {/* ===== TABLE OR LOADING ===== */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={cx("course__table")}>
            <CustomerTable columns={columns} data={courses} />
          </div>

          <div className={cx("course__pagination")}>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={limit}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchCourses(false);
              }}
              onItemsPerPageChange={(value) => {
                setLimit(value);
                setCurrentPage(1);
                fetchCourses(false);
              }}
            />
          </div>
        </>
      )}

      {/* ===== MODAL ===== */}
      <CourseFormModal
        open={openForm}
        course={editingCourse || undefined}
        onClose={() => setOpenForm(false)}
        setAlert={setAlert}
        onSuccess={() => fetchCourses(false)}
      />
    </div>
  );
}
