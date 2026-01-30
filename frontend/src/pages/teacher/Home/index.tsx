import { useEffect, useMemo, useState } from "react";
import { useClass } from "@/hooks/useClass";
import scheduleApi, { type GetScheduleQuery } from "@/services/scheduleService";
import enrollmentApi from "@/services/enrollmentService";
import WeekMini from "./components/WeekMini";
import ClassList from "./components/ClassList";
// import NextClassCard from "./components/NextClassCard";
import ArchivedClassList from "./components/ArchivedClassList";
import type { Class } from "@/interfaces/class";
import type { ScheduleVM } from "@/interfaces/schedule";

import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default function Home() {
  const { classes } = useClass();

  const [classesWithCount, setClassesWithCount] = useState<
    (Class & { student_count: number })[]
  >([]);

  const [schedules, setSchedules] = useState<ScheduleVM[]>([]);

  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);

  /* ================= Enrollments ================= */

  useEffect(() => {
    if (!classes?.length) return;

    Promise.all(
      classes.map(async (cls) => {
        const students = await enrollmentApi.searchByClass(cls.id);
        return { ...cls, student_count: students.length };
      }),
    ).then(setClassesWithCount);
  }, [classes]);

  /* ================= Schedules ================= */

  useEffect(() => {
    if (!classes?.length) return;

    const fetchSchedules = async () => {
      const today = new Date();

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const query: GetScheduleQuery = {
        from: startOfWeek.toISOString().split("T")[0],
        to: endOfWeek.toISOString().split("T")[0],
        class_id: classes.map((c) => c.id),
      };

      const data = await scheduleApi.search(query);

      /* Normalize DTO -> ViewModel */

      const normalized: ScheduleVM[] = data.flatMap((cls) =>
        cls.schedules.map((s) => ({
          ...s,
          class: {
            id: cls.id,
            name: cls.name,
          },
        })),
      );

      setSchedules(normalized);
    };

    fetchSchedules();
  }, [classes]);

  /* ================= Group By Week ================= */

  const weekSchedules = useMemo(() => {
    const map: Record<number, ScheduleVM[]> = {};

    for (const s of schedules) {
      const day = DAY_MAP[s.day_of_week.toLowerCase()];
      if (day === undefined) continue;

      (map[day] ||= []).push(s);
    }

    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.start_time - b.start_time),
    );

    return map;
  }, [schedules]);

  return (
    <div className={cx("home-grid")}>
      <div className={cx("home-main")}>
        {/* <NextClassCard schedules={weekSchedules[today] || []} /> */}
        <ClassList classes={classesWithCount} />
      </div>

      <aside className={cx("home-side")}>
        <WeekMini
          today={today}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          weekSchedules={weekSchedules}
        />
        <ArchivedClassList classes={classesWithCount} />
      </aside>
    </div>
  );
}
