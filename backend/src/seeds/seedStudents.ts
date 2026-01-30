import bcrypt from "bcryptjs";
import { StudentModel } from "../models/User";
import {
  randomVietnameseName,
  generateUniqueUsername,
  randomVietnamesePhone,
  randomStudentDOB,
} from "./seed.helpers";

const DEFAULT_PASSWORD = "123456";
const SALT_ROUNDS = 10;

export default async function seedStudents(count: number) {
  const existingUsernames = new Set<string>();

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const students = Array.from({ length: count }).map(() => {
    const fullName = randomVietnameseName();
    const dob = randomStudentDOB();

    const username = generateUniqueUsername(
      fullName,
      dob.getFullYear(),
      existingUsernames
    );

    return {
      username,
      email: `${username}@gmail.com`,
      password: hashedPassword,
      role: "STUDENT",
      full_name: fullName,
      dob,
      phone: randomVietnamesePhone(),
      japaneseLevel: "Không",
    };
  });

  await StudentModel.insertMany(students);
  console.log(` ${count} students inserted (password hashed)`);
}
