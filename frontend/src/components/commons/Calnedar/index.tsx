import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import classNames from "classnames/bind";
import styles from "./Calendar.module.scss";
import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

/* ======================= Types ======================= */

export interface Event {
  start: number;
  duration: number;
  title: string;
}

export interface EventWithDate extends Event {
  date: Date;
}

export interface CalendarRange {
  from: Date;
  to: Date;
}

interface WeekDay {
  label: string;
  date: number;
  month: number;
  year: number;
  events: EventWithDate[];
  isToday: boolean;
}

interface MonthDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventWithDate[];
}

interface CalendarProps {
  events?: EventWithDate[];
  onRangeChange?: (range: CalendarRange) => void; // ✅ thêm
}

/* ======================= Color Palette ======================= */

const EVENT_COLORS = [
  "#4A90E2",
  "#50E3C2",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FFA500",
  "#FF7043",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#90A4AE",
];

const getEventColor = (index: number) =>
  EVENT_COLORS[index % EVENT_COLORS.length];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* ======================= Component ======================= */

function Calendar({ events = [], onRangeChange }: CalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const lastRangeRef = useRef<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [monthDays, setMonthDays] = useState<MonthDay[]>([]);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const [rowHeight, setRowHeight] = useState(8);
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  /* ======================= Read CSS Variable ======================= */
  useLayoutEffect(() => {
    if (!calendarRef.current) return;

    const value = getComputedStyle(calendarRef.current)
      .getPropertyValue("--hour-row-height")
      .trim();

    if (value) {
      setRowHeight(Number(value.replace("em", "")));
    }
  }, []);

  /* ======================= Utils ======================= */

  const getStartOfWeek = useCallback((date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const getEndOfWeek = useCallback(
    (date: Date) => {
      const d = getStartOfWeek(date);
      d.setDate(d.getDate() + 6);
      d.setHours(23, 59, 59, 999);
      return d;
    },
    [getStartOfWeek]
  );

  const getStartOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  const getEndOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  const generateWeekDays = useCallback(
    (start: Date): WeekDay[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);

        return {
          label: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][i],
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          isToday: normalized.getTime() === today.getTime(),
          events: events.filter(
            (e) =>
              e.date.getFullYear() === date.getFullYear() &&
              e.date.getMonth() === date.getMonth() &&
              e.date.getDate() === date.getDate()
          ),
        };
      });
    },
    [events]
  );

  const generateMonthDays = useCallback(
    (date: Date): MonthDay[] => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const days: MonthDay[] = [];

      const prevLast = new Date(year, month, 0).getDate();
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
          date: prevLast - i,
          month: month === 0 ? 11 : month - 1,
          year: month === 0 ? year - 1 : year,
          isCurrentMonth: false,
          isToday: false,
          events: [],
        });
      }

      for (let d = 1; d <= lastDate; d++) {
        const current = new Date(year, month, d);
        current.setHours(0, 0, 0, 0);

        days.push({
          date: d,
          month,
          year,
          isCurrentMonth: true,
          isToday: current.getTime() === today.getTime(),
          events: events.filter(
            (e) =>
              e.date.getFullYear() === year &&
              e.date.getMonth() === month &&
              e.date.getDate() === d
          ),
        });
      }

      let nextDay = 1;
      while (days.length < 42) {
        days.push({
          date: nextDay++,
          month: month === 11 ? 0 : month + 1,
          year: month === 11 ? year + 1 : year,
          isCurrentMonth: false,
          isToday: false,
          events: [],
        });
      }

      return days;
    },
    [events]
  );

  /* ======================= Effects ======================= */
  useEffect(() => {
    let start: Date;
    let end: Date;

    if (viewMode === "week") {
      start = getStartOfWeek(currentDate);
      end = getEndOfWeek(currentDate);
      setWeekDays(generateWeekDays(start));
    } else {
      start = getStartOfMonth(currentDate);
      end = getEndOfMonth(currentDate);
      setMonthDays(generateMonthDays(currentDate));
    }

    const rangeKey = `${start.getTime()}-${end.getTime()}`;
    if (lastRangeRef.current !== rangeKey) {
      lastRangeRef.current = rangeKey;
      onRangeChange?.({ from: start, to: end });
    }
  }, [
    currentDate,
    viewMode,
    generateWeekDays,
    generateMonthDays,
    getStartOfWeek,
    getEndOfWeek,
    onRangeChange,
  ]);

  /* ======================= Helpers ======================= */

  const formatHour = (h: number) =>
    h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`;

  const formatTime = (t: number) => {
    const h = Math.floor(t);
    const m = Math.floor((t % 1) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const getEventStyle = (start: number, duration: number) => ({
    top: `${(start - 6) * rowHeight}em`,
    height: `${duration * rowHeight}em`,
  });

  const goPrev = () => {
    const d = new Date(currentDate);
    if (viewMode === "week") {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
  };
  const goNext = () => {
    const d = new Date(currentDate);
    if (viewMode === "week") {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const headerTitle = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  /* ======================= Render ======================= */

  return (
    <div ref={calendarRef} className={cx("calendar")}>
      {/* Header */}
      <div className={cx("header")}>
        <div className={cx("header__nav")}>
          <button className={cx("header__nav-btn")} onClick={goPrev}>
            <Icon icon="iconamoon:arrow-left-2-bold" />
          </button>
          <button className={cx("header__nav-btn", "today")} onClick={goToday}>
            Today
          </button>
          <button className={cx("header__nav-btn")} onClick={goNext}>
            <Icon icon="iconamoon:arrow-right-2-bold" />
          </button>
        </div>

        <div className={cx("header__date")}>{headerTitle}</div>

        <div className={cx("header__mode")}>
          <button
            className={cx("header__mode-btn", { active: viewMode === "week" })}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={cx("header__mode-btn", { active: viewMode === "month" })}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* WEEK VIEW */}
      {viewMode === "week" ? (
        <div className={cx("calendar__week")}>
          <div className={cx("calendar__week-header")}>
            <div />
            {weekDays.map((d, i) => (
              <div key={i} className={cx("day")}>
                <div className={cx("day-label")}>{d.label}</div>
                <div className={cx("day-number", { today: d.isToday })}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>

          <div className={cx("calendar__week-body")}>
            <div className={cx("unit-column")}>
              {hours.map((h) => (
                <div key={h} className={cx("unit-cell")}>
                  {formatHour(h)}
                </div>
              ))}
            </div>

            {weekDays.map((day, i) => (
              <div key={i} className={cx("day-column")}>
                {hours.map((h) => (
                  <div key={h} className={cx("day-cell")} />
                ))}

                {day.events.map((ev, idx) => {
                  const color = getEventColor(idx);
                  return (
                    <div
                      key={idx}
                      className={cx("event")}
                      style={{
                        ...getEventStyle(ev.start, ev.duration),
                        backgroundColor: hexToRgba(color, 0.6),
                        borderLeft: `4px solid ${color}`,
                      }}
                    >
                      <div className={cx("event-time")}>
                        {formatTime(ev.start)} –{" "}
                        {formatTime(ev.start + ev.duration)}
                      </div>
                      <div className={cx("event-title")}>{ev.title}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MONTH VIEW */
        <div className={cx("month-view")}>
          <div className={cx("month-days-header")}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className={cx("month-day-label")}>
                {d}
              </div>
            ))}
          </div>

          <div className={cx("month-grid")}>
            {monthDays.map((d, i) => (
              <div
                key={i}
                className={cx("month-day-cell", {
                  otherMonth: !d.isCurrentMonth,
                })}
              >
                <div className={cx("month-day-number", { today: d.isToday })}>
                  {d.date}
                </div>

                {d.events.map((ev, idx) => {
                  const color = getEventColor(idx);
                  return (
                    <div
                      key={idx}
                      className={cx("month-event")}
                      style={{ backgroundColor: hexToRgba(color, 0.65) }}
                    >
                      {ev.title}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
