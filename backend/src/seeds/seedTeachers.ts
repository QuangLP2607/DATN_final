import bcrypt from "bcryptjs";
import { TeacherModel } from "../models/User";
import {
  randomVietnameseName,
  generateUniqueUsername,
  randomVietnamesePhone,
  randomTeacherDOB,
} from "./seed.helpers";

const DEFAULT_PASSWORD = "123456";
const SALT_ROUNDS = 10;

export default async function seedTeachers(count: number) {
  const existingUsernames = new Set<string>();

  // hash 1 lần dùng chung
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const teachers = Array.from({ length: count }).map(() => {
    const fullName = randomVietnameseName();
    const dob = randomTeacherDOB();

    const username = generateUniqueUsername(
      fullName,
      dob.getFullYear(),
      existingUsernames
    );

    return {
      username,
      email: `${username}@gmail.com`,
      password: hashedPassword,
      role: "TEACHER",
      full_name: fullName,
      dob,
      phone: randomVietnamesePhone(),
      status: "active",
    };
  });

  await TeacherModel.insertMany(teachers);

  console.log(` ${count} teachers inserted (password hashed)`);
}
