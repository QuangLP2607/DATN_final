import bcrypt from "bcryptjs";
import { TeacherModel, StudentModel, UserModel } from "../models/User";
import { Roles } from "../interfaces/user";

const DEFAULT_PASSWORD = "123456";
const SALT_ROUNDS = 10;

export async function seedSpecialUsers() {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // ===== TEACHER =====
  const teacherEmail = "teacher@gmail.com";
  const teacherExists = await TeacherModel.findOne({ email: teacherEmail });

  if (!teacherExists) {
    await TeacherModel.create({
      username: "teacher",
      email: teacherEmail,
      password: hashedPassword,
      role: Roles.TEACHER,
      full_name: "Giáo viên hệ thống",
      dob: new Date(1990, 1, 1),
      phone: "0900000001",
      status: "active",
    });
    console.log(`Seeded: ${teacherEmail}`);
  } else {
    console.log(`Already exists: ${teacherEmail}`);
  }

  // ===== STUDENT =====
  const studentEmail = "student@gmail.com";
  const studentExists = await StudentModel.findOne({ email: studentEmail });

  if (!studentExists) {
    await StudentModel.create({
      username: "student",
      email: studentEmail,
      password: hashedPassword,
      role: Roles.STUDENT,
      full_name: "Học sinh hệ thống",
      dob: new Date(2005, 1, 1),
      phone: "0900000002",
      japaneseLevel: "Không",
    });
    console.log(`Seeded: ${studentEmail}`);
  } else {
    console.log(`Already exists: ${studentEmail}`);
  }

  // ===== ADMIN =====
  const adminEmail = "admin@gmail.com";
  const adminExists = await UserModel.findOne({ email: adminEmail });

  if (!adminExists) {
    await UserModel.create({
      username: "admin",
      email: adminEmail,
      password: hashedPassword,
      role: Roles.ADMIN,
    });
    console.log(`Seeded: ${adminEmail}`);
  } else {
    console.log(`Already exists: ${adminEmail}`);
  }
}
