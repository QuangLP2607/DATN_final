import classNames from "classnames/bind";
import styles from "./WeekMini.module.scss";
import type { ScheduleVM } from "@/interfaces/schedule";

const cx = classNames.bind(styles);

interface WeekMiniProps {
  today: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  weekSchedules: Record<number, ScheduleVM[]>;
}

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function WeekMini({
  today,
  selectedDay,
  setSelectedDay,
  weekSchedules,
}: WeekMiniProps) {
  const schedules = weekSchedules[selectedDay] || [];

  return (
    <section className={cx("card")}>
      <div className={cx("card__header")}>
        <h2>Lịch tuần này</h2>
      </div>

      <div className={cx("week")}>
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            onClick={() => setSelectedDay(i)}
            className={cx("week__day", {
              today: i === today,
              active: i === selectedDay,
              hasClass: !!weekSchedules[i]?.length,
            })}
          >
            <span>{label}</span>
            {weekSchedules[i]?.length && <span className={cx("dot")} />}
          </div>
        ))}
      </div>

      <div className={cx("schedule-list")}>
        {schedules.length === 0 ? (
          <p className={cx("no-schedule")}>Không có lớp học trong ngày này</p>
        ) : (
          schedules.map((s) => (
            <div key={s.id} className={cx("schedule-item")}>
              <h4>{s.class.name}</h4>

              <span>
                {Math.floor(s.start_time / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(s.start_time % 60).toString().padStart(2, "0")} →{" "}
                {Math.floor(s.end_time / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(s.end_time % 60).toString().padStart(2, "0")}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
