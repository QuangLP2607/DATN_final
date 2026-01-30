import type { Schedule } from "@/interfaces/schedule";
import classNames from "classnames/bind";
import styles from "./TodaySummary.module.scss";

const cx = classNames.bind(styles);

interface Props {
  today: number;
  schedules: Schedule[];
}

export default function TodaySummary({ schedules }: Props) {
  const totalClasses = schedules.length;

  const totalMinutes = schedules.reduce(
    (sum, s) => sum + (s.end_time - s.start_time),
    0
  );

  return (
    <section className={cx("card")}>
      <h2>Hôm nay</h2>

      <div className={cx("stats")}>
        <div>
          <strong>{totalClasses}</strong>
          <span>Lớp học</span>
        </div>

        <div>
          <strong>{(totalMinutes / 60).toFixed(1)}</strong>
          <span>Giờ dạy</span>
        </div>
      </div>

      {totalClasses === 0 && (
        <p className={cx("empty")}>🎉 Hôm nay bạn không có lớp nào</p>
      )}
    </section>
  );
}
