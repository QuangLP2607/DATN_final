import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SortFilter.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

interface SortFilterProps {
  sortBy: string;
  order: "asc" | "desc";
  onChange: (sortBy: string, order: "asc" | "desc") => void;
}

export default function SortFilter({
  sortBy,
  order,
  onChange,
}: SortFilterProps) {
  const [open, setOpen] = useState(false);

  const sortOptions = [
    { label: "Tên", value: "username" },
    { label: "Email", value: "email" },
    { label: "Ngày tạo", value: "createdAt" },
  ];

  const orderOptions: ("asc" | "desc")[] = ["asc", "desc"];

  return (
    <div className={cx("sort-filter")}>
      <button
        className={cx("sort-filter__button")}
        onClick={() => setOpen((v) => !v)}
      >
        Lọc: {sortOptions.find((o) => o.value === sortBy)?.label} -{" "}
        {order.toUpperCase()}
        <Icon icon="iconamoon:arrow-down-2-bold" className={cx({ open })} />
      </button>

      {open && (
        <div className={cx("sort-filter__menu")}>
          <div className={cx("sort-filter__group")}>
            <div className={cx("sort-filter__label")}>Sắp xếp theo</div>
            {sortOptions.map((o) => (
              <div
                key={o.value}
                className={cx("sort-filter__item", {
                  selected: o.value === sortBy,
                })}
                onClick={() => onChange(o.value, order)}
              >
                {o.label}
              </div>
            ))}
          </div>
          <div className={cx("sort-filter__group")}>
            <div className={cx("sort-filter__label")}>Thứ tự</div>
            {orderOptions.map((o) => (
              <div
                key={o}
                className={cx("sort-filter__item", { selected: o === order })}
                onClick={() => onChange(sortBy, o)}
              >
                {o.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
