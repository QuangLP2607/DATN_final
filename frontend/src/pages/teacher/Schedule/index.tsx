import { useMemo, useState } from "react";
import classNames from "classnames/bind";
import Calendar, {
  type EventWithDate,
  type CalendarRange,
} from "@/components/commons/Calnedar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSchedulesQuery } from "@/hooks/queries/useSchedulesQuery";
import { useClass } from "@/hooks/useClass";
import styles from "./Schedule.module.scss";

const cx = classNames.bind(styles);

const dayOfWeekMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default function Schedule() {
  const { classes } = useClass();

  const [range, setRange] = useState<CalendarRange | null>(null);
  const debouncedRange = useDebouncedValue(range, 300);

  const classIds = useMemo(() => classes.map((c) => c.id), [classes]);

  const { data: scheduleData } = useSchedulesQuery(
    debouncedRange?.from.toISOString().slice(0, 10) || "",
    debouncedRange?.to.toISOString().slice(0, 10) || "",
    classIds
  );

  const events: EventWithDate[] = useMemo(() => {
    if (!scheduleData || !debouncedRange) return [];

    const result: EventWithDate[] = [];

    scheduleData.forEach((cls) => {
      cls.schedules.forEach((sch) => {
        const targetDow = dayOfWeekMap[sch.day_of_week];

        const cursor = new Date(debouncedRange.from);
        cursor.setHours(0, 0, 0, 0);

        const diff = (targetDow + 7 - cursor.getDay()) % 7;
        cursor.setDate(cursor.getDate() + diff);

        while (cursor <= debouncedRange.to) {
          result.push({
            date: new Date(cursor),
            start: sch.start_time / 60,
            duration: (sch.end_time - sch.start_time) / 60,
            title: cls.name,
          });

          cursor.setDate(cursor.getDate() + 7);
        }
      });
    });

    return result;
  }, [scheduleData, debouncedRange]);

  return (
    <div className={cx("schedule")}>
      <Calendar events={events} onRangeChange={setRange} />
    </div>
  );
}
