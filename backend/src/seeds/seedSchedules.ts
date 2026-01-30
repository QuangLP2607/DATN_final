import { ClassModel } from "../models/Class";
import { ScheduleModel } from "../models/Schedule";
import { faker } from "@faker-js/faker";

export default async function seedSchedules() {
  const classes = await ClassModel.find();

  if (!classes.length) {
    throw new Error("No classes found");
  }

  const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;

  const schedules = [];

  for (const cls of classes) {
    const numberOfDays = faker.number.int({ min: 2, max: 4 });
    const days = faker.helpers.arrayElements(DAYS, numberOfDays);

    for (const day of days) {
      const startHour = faker.number.int({ min: 7, max: 18 });
      const startMinute = faker.helpers.arrayElement([0, 30]);
      const startTime = startHour * 60 + startMinute;

      const duration = faker.helpers.arrayElement([90, 120]);
      const endTime = startTime + duration;

      if (endTime > 1440) continue;

      schedules.push({
        class_id: cls._id,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
        note: "Lịch học cố định",
      });
    }
  }

  await ScheduleModel.bulkWrite(
    schedules.map((s) => ({
      updateOne: {
        filter: {
          class_id: s.class_id,
          day_of_week: s.day_of_week,
          start_time: s.start_time,
        },
        update: { $setOnInsert: s },
        upsert: true,
      },
    }))
  );

  console.log(` Schedules seeded for ${classes.length} classes`);
}
