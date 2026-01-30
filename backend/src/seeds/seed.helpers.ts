import { faker } from "@faker-js/faker";

/* ======================= NAME ======================= */
const vietnameseFirstNames = [
  "Anh",
  "Bảo",
  "Châu",
  "Duy",
  "Hà",
  "Hưng",
  "Khánh",
  "Linh",
  "Minh",
  "Ngọc",
  "Phương",
  "Quang",
  "Trang",
  "Tuấn",
];

const vietnameseLastNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Vũ",
  "Đặng",
  "Bùi",
  "Đỗ",
];

export function randomVietnameseName(): string {
  const first = faker.helpers.arrayElement(vietnameseFirstNames);
  const last = faker.helpers.arrayElement(vietnameseLastNames);
  return `${last} ${first}`;
}

/* ======================= USERNAME ======================= */
export function toUsername(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export function generateUniqueUsername(
  name: string,
  birthYear: number,
  existing: Set<string>,
): string {
  const base = `${toUsername(name)}${birthYear}`;
  let username = base;
  let i = 1;

  while (existing.has(username)) {
    username = `${base}${i++}`;
  }

  existing.add(username);
  return username;
}

/* ======================= PHONE ======================= */
export function randomVietnamesePhone(): string {
  const prefixes = [
    "032",
    "033",
    "034",
    "035",
    "036",
    "037",
    "038",
    "039",
    "070",
    "076",
    "077",
    "078",
    "079",
    "081",
    "082",
    "083",
    "084",
    "085",
    "086",
    "087",
    "088",
    "089",
  ];

  return (
    faker.helpers.arrayElement(prefixes) +
    faker.number.int({ min: 1000000, max: 9999999 })
  );
}

/* ======================= DOB ======================= */
export function randomStudentDOB(): Date {
  return faker.date.birthdate({ min: 15, max: 25, mode: "age" });
}

export function randomTeacherDOB(): Date {
  return faker.date.birthdate({ min: 25, max: 60, mode: "age" });
}

/* ======================= DAYS & SCHEDULE ======================= */
export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function generateSchedule() {
  const selectedDays = faker.helpers.arrayElements(
    weekdays.slice(0, 6),
    faker.number.int({ min: 2, max: 3 }),
  );

  return selectedDays.map((day) => {
    const startHour = faker.helpers.arrayElement([8, 10, 14, 18]);
    return {
      day_of_week: day,
      start_time: startHour * 60,
      end_time: (startHour + 2) * 60,
      note: faker.helpers.maybe(() => faker.lorem.words(3)),
    };
  });
}

export function getCourseDuration(courseName: string): number {
  switch (true) {
    case /N5/i.test(courseName):
      return 5;
    case /N4/i.test(courseName):
      return 5;
    case /N3/i.test(courseName):
      return 5;
    case /N2/i.test(courseName):
      return 5;
    case /N1/i.test(courseName):
      return 5;
    case /chuyên ngành/i.test(courseName):
      return 3;
    case /giao tiếp/i.test(courseName):
      return 2;
    default:
      return 5;
  }
}
