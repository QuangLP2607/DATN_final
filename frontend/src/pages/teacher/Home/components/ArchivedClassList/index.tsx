import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ArchivedClassList.module.scss";
import type { Class } from "@/interfaces/class";
import { useClass } from "@/hooks/useClass";
import { useState } from "react";

const cx = classNames.bind(styles);

interface ArchivedClassListProps {
  classes: (Class & { student_count: number })[];
}

export default function ArchivedClassList({ classes }: ArchivedClassListProps) {
  const { setActiveClass } = useClass();
  const navigate = useNavigate();

  const now = Date.now();
  const [visibleCount, setVisibleCount] = useState(3);

  // ✅ Chỉ lấy lớp đã kết thúc
  const archivedClasses = classes.filter((cls) => {
    const end = new Date(cls.end_date).getTime();
    return !isNaN(end) && end < now;
  });

  if (archivedClasses.length === 0) return null;

  const handleViewClass = (cls: Class) => {
    setActiveClass(cls);
    localStorage.setItem("activeClassId", cls.id);
    navigate("/teaching/class");
  };

  const visibleClasses = archivedClasses.slice(0, visibleCount);
  const canLoadMore = visibleCount < archivedClasses.length;

  return (
    <section className={cx("card", "archived")}>
      <div className={cx("card__header")}>
        <h3>Lớp đã kết thúc</h3>
        <span className={cx("count")}>{archivedClasses.length} lớp</span>
      </div>

      <div className={cx("class-list")}>
        {visibleClasses.map((cls) => (
          <div key={cls.id} className={cx("class-item")}>
            <div className={cx("class-info")}>
              <div className={cx("info-left")}>
                <h4>{cls.name}</h4>
                <span className={cx("dates")}>
                  {new Date(cls.start_date).toLocaleDateString()} →{" "}
                  {new Date(cls.end_date).toLocaleDateString()}
                </span>
              </div>

              <div className={cx("info-right")}>
                <button
                  className={cx("btn", "ghost")}
                  onClick={() => handleViewClass(cls)}
                >
                  Xem lại lớp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canLoadMore && (
        <div className={cx("load-more")}>
          <button
            className={cx("load-more-btn")}
            onClick={() => setVisibleCount((prev) => prev + 3)}
          >
            Xem thêm
          </button>
        </div>
      )}
    </section>
  );
}
