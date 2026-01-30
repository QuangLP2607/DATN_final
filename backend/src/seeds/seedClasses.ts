import { ClassModel } from "../models/Class";
import { CourseModel } from "../models/Course";
import { TeacherModel } from "../models/User";
import { ConversationModel } from "../models/Conversation";
import { faker } from "@faker-js/faker";
import { generateSchedule, getCourseDuration } from "./seed.helpers";

export default async function seedClasses(count: number) {
  const courses = await CourseModel.find();
  const teachers = await TeacherModel.find({ role: "TEACHER" });

  if (!courses.length || !teachers.length) {
    throw new Error("Need existing courses and teachers");
  }

  const classesData = Array.from({ length: count }).map(() => {
    const course = faker.helpers.arrayElement(courses);
    const durationMonths = getCourseDuration(course.name);

    const startDate = faker.date.between({
      from: "2025-04-01",
      to: "2025-10-01",
    });

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    return {
      name: `${course.name} - Lớp ${faker.string
        .alphanumeric(4)
        .toUpperCase()}`,
      course_id: course._id,
      teacher_ids: faker.helpers.arrayElements(
        teachers.map((t) => t._id),
        1,
      ),
      start_date: startDate,
      end_date: endDate,
      schedule: generateSchedule(),
      status: "upcoming",
    };
  });

  const insertedClasses = await ClassModel.insertMany(classesData);

  const conversations = insertedClasses.map((cls) => ({
    class_id: cls._id,
  }));

  await ConversationModel.bulkWrite(
    conversations.map((c) => ({
      updateOne: {
        filter: { class_id: c.class_id },
        update: { $setOnInsert: c },
        upsert: true,
      },
    })),
  );

  console.log(` ${insertedClasses.length} classes & conversations inserted`);
}
