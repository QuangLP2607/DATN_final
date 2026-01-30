import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Classes.module.scss";
import CustomerTable, { type Column } from "@/components/commons/CustomTable";
import { PaginationControls } from "@/components/commons/PaginationControls";
import SearchBar from "@/components/commons/SearchBar";
// import ClassFormModal from "../components/ClassFormModal";
import { formatDateVN } from "@/utils/date";
import { useClassesQuery } from "@/hooks/queries/useClassesQuery";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import Loading from "@/components/ui/Loading";
import Alert, { type AlertData } from "@/components/commons/Alert";
import Filters from "../components/Filters";
import { Icon } from "@iconify/react";
import type { SearchClassesParams, ClassDetail } from "@/services/classService";

const cx = classNames.bind(styles);

export default function Classes() {
  const navigate = useNavigate();

  // ===== STATE =====
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  const [filters, setFilters] = useState<SearchClassesParams>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "name",
    order: "asc",
  });

  const [draftFilters, setDraftFilters] = useState<SearchClassesParams>({
    ...filters,
  });
  const [alert, setAlert] = useState<AlertData | null>(null);

  // ===== QUERY =====
  const { data, isLoading } = useClassesQuery({
    ...filters,
    search: debouncedSearch,
  });

  // ===== HANDLERS =====
  const updateDraftFilter = <K extends keyof SearchClassesParams>(
    key: K,
    value: SearchClassesParams[K],
  ) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: key === "page" || key === "limit" ? Number(value) : value,
    }));
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...draftFilters,
      page: 1,
    }));
  };

  const clearDraftFilters = () => {
    setDraftFilters({
      page: 1,
      limit: 10,
      search: "",
      sortBy: "name",
      order: "asc",
    });
  };

  // ===== TABLE COLUMNS =====
  const columns: Column<ClassDetail>[] = [
    {
      label: "#",
      width: 1,
      align: "center",
      render: (_row, idx) => (filters.page - 1) * filters.limit + idx + 1,
    },
    { label: "Lớp", width: 3, render: (row) => row.name },
    {
      label: "Mã KH",
      width: 2,
      align: "center",
      render: (row) => row.course?.code ?? "-",
    },
    {
      label: "Giảng viên",
      width: 3,
      render: (row) => row.teachers?.map((t) => t.username).join(", ") ?? "-",
    },
    {
      label: "Bắt đầu",
      width: 2,
      align: "center",
      render: (row) => formatDateVN(row.start_date),
    },
    {
      label: "Kết thúc",
      width: 2,
      align: "center",
      render: (row) => formatDateVN(row.end_date),
    },
    {
      label: "Trạng thái",
      width: 2,
      align: "center",
      render: (row) => (
        <div
          className={cx(
            "class-status",
            `class-status--${row.status.toLowerCase()}`,
          )}
        >
          {row.status}
        </div>
      ),
    },
    {
      label: "Hành động",
      width: 2,
      align: "center",
      render: (row) => (
        <div
          className={cx("class__table-actions")}
          role="group"
          aria-label="Hành động"
        >
          <button
            className={cx(
              "class__table-actions-btn",
              "class__table-actions-btn--view",
            )}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/class/${row.id}`);
            }}
            aria-label="Xem khóa học"
          >
            <Icon icon="mdi:eye-outline" />
          </button>
        </div>
      ),
    },
  ];

  // ===== RENDER =====
  return (
    <div className={cx("class")}>
      {alert && <Alert alert={alert} clearAlert={() => setAlert(null)} />}

      <div className={cx("class__header")}>
        <h2>Danh sách lớp học</h2>

        <div className={cx("class__header-actions")}>
          {/* -------- Search -------- */}
          <SearchBar
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            placeholder="Tìm theo tên, email, SĐT"
          />

          {/* -------- Filters -------- */}
          <Filters
            filters={draftFilters}
            onChange={updateDraftFilter}
            onClear={clearDraftFilters}
            onApply={applyFilters}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={cx("class__table")}>
            <CustomerTable columns={columns} data={data?.classes ?? []} />
          </div>

          <div className={cx("class__pagination")}>
            <PaginationControls
              currentPage={filters.page!}
              totalPages={data?.pagination.totalPages ?? 1}
              itemsPerPage={filters.limit!}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              onItemsPerPageChange={(limit) =>
                setFilters((prev) => ({ ...prev, limit, page: 1 }))
              }
            />
          </div>
        </>
      )}

      {/* <ClassFormModal
        open={openForm}
        classData={editingClass || undefined}
        onClose={() => setOpenForm(false)}
        setAlert={setAlert}
        onSuccess={() => {
          setFilters((prev) => ({ ...prev }));
        }}
      /> */}
    </div>
  );
}
