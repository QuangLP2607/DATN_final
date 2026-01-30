import classNames from "classnames/bind";
import { Icon } from "@iconify/react";
import styles from "./Pagination.module.scss";

const cx = classNames.bind(styles);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={cx("pagination", className)}>
      <button
        className={cx("pagination__btn", { disabled: currentPage === 1 })}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <Icon icon="mdi:chevron-left" />
      </button>

      <div className={cx("pagination__pages")}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                className={cx("pagination__page", {
                  active: currentPage === page,
                })}
                disabled={currentPage === page}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className={cx("pagination__ellipsis")}>
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <button
        className={cx("pagination__btn", {
          disabled: currentPage === totalPages,
        })}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <Icon icon="mdi:chevron-right" />
      </button>
    </div>
  );
}
