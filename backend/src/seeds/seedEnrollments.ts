import { EnrollmentModel } from "../models/Enrollment";
import { StudentModel } from "../models/User";
import { ClassModel } from "../models/Class";
import { faker } from "@faker-js/faker";

export default async function seedEnrollments(count: number) {
  const students = await StudentModel.find({ role: "STUDENT" });
  const classes = await ClassModel.find();

  if (!students.length || !classes.length)
    throw new Error("Need existing students and classes");

  const enrollments = [];

  for (let i = 0; i < count; i++) {
    enrollments.push({
      student_id: faker.helpers.arrayElement(students)._id,
      class_id: faker.helpers.arrayElement(classes)._id,
    });
  }

  try {
    await EnrollmentModel.insertMany(enrollments, { ordered: false });
    console.log(`${count} enrollments inserted`);
  } catch (err) {
    console.warn("Some duplicates skipped");
  }
}
