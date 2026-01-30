import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Lectures.module.scss";
import { Icon } from "@iconify/react";
import { useUpload } from "@/hooks/useUpload";
import { useClass } from "@/hooks/useClass";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLecturesQuery } from "@/hooks/queries/useLecturesQuery";
import lectureVideoApi, {
  type LectureWithUrls,
  type GetLecturesParams,
} from "@/services/lectureService";
import { PaginationControls } from "@/components/commons/PaginationControls";
import SearchBar from "@/components/commons/SearchBar";
import EditModal from "../components/EditModal";
import Filters from "../components/Filters";
import Alert, {
  type AlertData,
  type AlertType,
} from "@/components/commons/Alert";
import ConfirmModal from "@/components/commons/ConfirmModal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

import { formatDate } from "@/utils/date";

const cx = classNames.bind(styles);

export default function Lectures() {
  const navigate = useNavigate();
  const { activeClass } = useClass();
  const classId = activeClass?.id;

  // ---------------- State ----------------
  const [editing, setEditing] = useState<LectureWithUrls | null>(null);
  const [isNewLecture, setIsNewLecture] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue, 300);
  const [filters, setFilters] = useState<GetLecturesParams>({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });
  const [draftFilters, setDraftFilters] = useState(filters);
  const [alert, setAlert] = useState<AlertData | null>(null);
  const { track } = useUpload();

  // -------- Confirm delete --------
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] =
    useState<LectureWithUrls | null>(null);

  // ---------------- Alert ----------------
  const showAlert = (
    title: string | undefined,
    content: string,
    type: AlertType = "success",
    duration = 3000,
  ) => {
    setAlert(null);
    setTimeout(() => setAlert({ title, content, type, duration }), 10);
  };

  // ---------------- React Query ----------------
  const { data, isLoading, refetch } = useLecturesQuery({
    classId: classId!,
    ...filters,
  });

  // ---------------- Sync search ----------------
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  // ---------------- Upload ----------------
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !classId) return;

    try {
      const lecture = await track({
        name: file.name,
        task: (onProgress) =>
          lectureVideoApi.uploadLectureVideo(file, classId, onProgress),
      });

      showAlert("Thành công", "Upload video thành công");

      setEditing(lecture);
      setIsNewLecture(true);

      refetch();
    } catch (err) {
      console.error(err);
      showAlert("Thất bại", "Upload video thất bại", "error", 5000);
    } finally {
      e.target.value = "";
    }
  };

  // ---------------- Delete ----------------
  const openDeleteConfirm = (lecture: LectureWithUrls) => {
    setSelectedLecture(lecture);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLecture) return;

    try {
      await lectureVideoApi.delete(selectedLecture.id);
      showAlert("Thành công", "Đã xóa bài giảng");
      refetch();
    } catch {
      showAlert("Thất bại", "Xóa bài giảng thất bại", "error", 5000);
    } finally {
      setConfirmOpen(false);
      setSelectedLecture(null);
    }
  };

  // ---------------- CENTRALIZED close modal ----------------
  const handleCloseEditModal = async (lecture: LectureWithUrls | null) => {
    if (isNewLecture && lecture && !lecture.thumbnail?.url) {
      try {
        await lectureVideoApi.generateAutoThumbnail(lecture);
        showAlert("Thành công", "Đã tạo thumbnail tự động");
      } catch {
        showAlert("Lỗi", "Tạo thumbnail tự động thất bại", "error", 5000);
      }
    }

    setEditing(null);
    setIsNewLecture(false);
    refetch();
  };

  if (!classId) return <p>Please select a class</p>;

  const lectures = data?.lectures || [];

  return (
    <div className={cx("lectures")}>
      {/* ======== Header ======== */}
      <div className={cx("lectures__header")}>
        <h2>Bài giảng</h2>
        {/* -------- Toolbar -------- */}
        <div className={cx("toolbar")}>
          {/* -------- Search -------- */}
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search video..."
            className={cx("toolbar__search")}
          />

          {/* -------- Filters -------- */}
          <Filters
            filters={{ order: draftFilters.order }}
            onChange={(key, value) =>
              setDraftFilters((prev) => ({ ...prev, [key]: value }))
            }
            onClear={() =>
              setDraftFilters((prev) => ({ ...prev, order: "desc" }))
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
        {/* -------- Upload -------- */}
        <label className={cx("upload-btn")}>
          <Icon icon="tabler:upload" />
          Upload video
          <input type="file" accept="video/*" hidden onChange={handleUpload} />
        </label>
      </div>

      {/* ======== Content ======== */}
      {isLoading ? (
        <Loading />
      ) : lectures.length === 0 ? (
        <Empty
          icon="mdi:video-off-outline"
          title="Chưa có bài giảng nào"
          description="Upload video để bắt đầu"
        />
      ) : (
        <div className={cx("lectures__content")}>
          {lectures.map((item) => (
            <div
              key={item.id}
              className={cx("card")}
              onClick={() =>
                navigate(`/teaching/class/lectures/${item.video.id}`)
              }
            >
              <div className={cx("thumb")}>
                {item.thumbnail?.url ? (
                  <img
                    className={cx("thumb-img")}
                    src={item.thumbnail.url}
                    alt={item.video.file_name}
                  />
                ) : (
                  <Empty icon="mdi:video-outline" />
                )}

                <div className={cx("thumb-overlay")}>
                  <span className={cx("thumb-overlay__bg")} />
                  <span className={cx("thumb-overlay__icon")}>
                    <Icon icon="gridicons:play" />
                  </span>
                </div>
              </div>

              <div
                className={cx("actions")}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setEditing(item)}>
                  <Icon icon="tabler:edit" />
                </button>
                <button onClick={() => openDeleteConfirm(item)}>
                  <Icon icon="tabler:trash" />
                </button>
              </div>

              <div className={cx("info")}>
                <p className={cx("name")}>{item.video.file_name}</p>
                <span className={cx("date")}>
                  {item.createdAt ? formatDate(item.createdAt) : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======== Pagination ======== */}
      <div className={cx("lectures__pagination")}>
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

      {/* ======== Edit Modal ======== */}
      {editing && (
        <EditModal
          lecture={editing}
          onUpdated={() => handleCloseEditModal(editing)}
          onClose={() => handleCloseEditModal(editing)}
          onError={(message) => showAlert("Thất bại", message, "error", 5000)}
        />
      )}

      {/* ======== Confirm Delete ======== */}
      <ConfirmModal
        open={confirmOpen}
        title="Xóa bài giảng"
        message={`Bạn có chắc muốn xóa "${selectedLecture?.video.file_name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}
    </div>
  );
}
