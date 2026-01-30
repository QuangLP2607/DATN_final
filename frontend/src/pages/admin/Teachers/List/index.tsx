import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Teachers.module.scss";
import CustomerTable, { type Column } from "@/components/commons/CustomTable";
import { PaginationControls } from "@/components/commons/PaginationControls";
import { formatDateVN } from "@/utils/date";
import SearchBar from "@/components/commons/SearchBar";
import Filters from "../components/Filters";
import Loading from "@/components/ui/Loading";
import { useTeachersQuery } from "@/hooks/queries/useTeachersQuery";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { GetUsersParams } from "@/services/userService";
import type { User } from "@/interfaces/user";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export default function Teachers() {
  const navigate = useNavigate();

  // ----------------- State -----------------
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  const [filters, setFilters] = useState<GetUsersParams>({
    role: "TEACHER",
    search: "",
    page: 1,
    limit: 10,
    sortBy: "username",
    order: "asc",
    japaneseLevel: undefined,
  });

  const [draftFilters, setDraftFilters] = useState<GetUsersParams>({
    ...filters,
  });

  // ----------------- Query -----------------
  const { data, isLoading } = useTeachersQuery({
    ...filters,
    search: debouncedSearch,
  });

  // ----------------- Handlers -----------------
  const updateDraftFilter = <K extends keyof GetUsersParams>(
    key: K,
    value: GetUsersParams[K]
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
      role: "STUDENT",
      search: "",
      page: 1,
      limit: 10,
      sortBy: "username",
      order: "asc",
      japaneseLevel: undefined,
    });
  };

  // ----------------- Table Columns -----------------
  const columns: Column<User>[] = [
    {
      label: "#",
      width: 1,
      align: "center",
      render: (_row, index) => (filters.page! - 1) * filters.limit! + index + 1,
    },
    { label: "Họ và tên", width: 3, render: (row) => row.username },
    {
      label: "Email",
      width: 3,
      className: cx("col-email"),
      render: (row) => row.email,
    },
    {
      label: "Số điện thoại",
      width: 2,
      align: "center",
      render: (row) => row.phone,
    },
    {
      label: "Ngày sinh",
      width: 2,
      align: "center",
      render: (row) => formatDateVN(row.dob!),
    },
    {
      label: "Trạng thái",
      width: 2,
      align: "center",
      render: (row) => (
        <div
          className={cx(
            "teacher-status",
            `teacher-status--${row.status!.toLowerCase()}`
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
        <div className={cx("row-actions")}>
          <button
            className={cx("row-action-button", "row-action-button--view")}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/teacher/${row.id}`);
            }}
          >
            <Icon icon="mdi:eye-outline" />
          </button>
        </div>
      ),
    },
  ];

  // ----------------- Render -----------------
  return (
    <div className={cx("teacher")}>
      <div className={cx("teacher__header")}>
        <h2>Danh sách học viên</h2>

        <div className={cx("teacher__header-actions")}>
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
          <div className={cx("teacher__table")}>
            <CustomerTable columns={columns} data={data?.users ?? []} />
          </div>

          <div className={cx("teacher__pagination-controls")}>
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
    </div>
  );
}
