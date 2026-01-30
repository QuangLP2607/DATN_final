// ------------------------------------------------------------------------
export const getDateFromDayOfWeek = (
  targetDay: number,
  baseDate: Date
): Date => {
  const date = new Date(baseDate);
  const diff = (targetDay - date.getDay() + 7) % 7;

  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);

  return date;
};

// ------------------------------------------------------------------------
export function getFirstDateByDayOfWeek(dayOfWeek: number, startDate: Date) {
  const date = new Date(startDate);
  const diff = (dayOfWeek - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// ------------------------------------------------------------------------
export function formatDateVN(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// ------------------------------------------------------------------------
export function formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // cùng ngày → show giờ
    return `Hôm nay, ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    // quá 7 ngày → show ngày đầy đủ
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
