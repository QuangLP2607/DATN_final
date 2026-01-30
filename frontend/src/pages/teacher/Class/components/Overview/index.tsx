import classNames from "classnames/bind";
import styles from "./Overview.module.scss";
import type { Class } from "@/interfaces/class";

const cx = classNames.bind(styles);

interface Props {
  cls: Class & { student_count?: number };
  onStartClass: () => void;
}

export default function Overview({ cls, onStartClass }: Props) {
  const progress =
    Math.min(
      100,
      Math.max(
        0,
        ((Date.now() - new Date(cls.start_date).getTime()) /
          (new Date(cls.end_date).getTime() -
            new Date(cls.start_date).getTime())) *
          100
      )
    ) || 0;

  return (
    <section className={cx("card")}>
      <div className={cx("card__header")}>
        <h2>{cls.name}</h2>
      </div>

      <div className={cx("card__info")}>
        <div className={cx("row")}>
          <span>Lịch học:</span>
          <span>
            {new Date(cls.start_date).toLocaleDateString()} →{" "}
            {new Date(cls.end_date).toLocaleDateString()}
          </span>
        </div>

        <div className={cx("row")}>
          <span>Số học sinh:</span>
          <span>{cls.student_count ?? 0}</span>
        </div>

        <div className={cx("progress-wrapper")}>
          <div className={cx("progress-bar")}>
            <div
              className={cx("progress-bar__fill")}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={cx("progress-text")}>{Math.round(progress)}%</span>
        </div>

        <button className={cx("btn", "start")} onClick={onStartClass}>
          Bắt đầu buổi học
        </button>
      </div>
    </section>
  );
}
