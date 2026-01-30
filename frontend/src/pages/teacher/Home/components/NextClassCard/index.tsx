import type { Schedule } from "@/interfaces/schedule";
import classNames from "classnames/bind";
import styles from "./NextClassCard.module.scss";

const cx = classNames.bind(styles);

interface Props {
  schedules: Schedule[];
}

export default function NextClassCard({ schedules }: Props) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const nextClass = schedules.find((s) => s.start_time > nowMinutes);

  if (!nextClass) return null;

  const minutesLeft = nextClass.start_time - nowMinutes;

  return (
    <section className={cx("next-class-card", "next-class-card--highlight")}>
      <h3 className={cx("next-class-card__title")}>Lớp sắp tới</h3>

      <strong className={cx("next-class-card__class-name")}>
        {nextClass.class_id?.name}
      </strong>

      <p className={cx("next-class-card__time-left")}>
        Bắt đầu sau <b>{minutesLeft}</b> phút
      </p>

      <span className={cx("next-class-card__start-time")}>
        {Math.floor(nextClass.start_time / 60)
          .toString()
          .padStart(2, "0")}
        :{(nextClass.start_time % 60).toString().padStart(2, "0")}
      </span>
    </section>
  );
}
