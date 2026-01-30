import mongoose from "mongoose";
import { seedSpecialUsers } from "./seedSpecialUsers";
import seedStudents from "./seedStudents";
import seedTeachers from "./seedTeachers";
import seedCourses from "./seedCourses";
import seedClasses from "./seedClasses";
import seedSchedules from "./seedSchedules";
import seedEnrollments from "./seedEnrollments";
import "dotenv/config";

async function seedAll() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("MONGO_URI missing");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    console.log("Seeding special users...");
    await seedSpecialUsers();

    console.log("Seeding teachers...");
    await seedTeachers(8);

    console.log("Seeding courses...");
    await seedCourses();

    console.log("Seeding students...");
    await seedStudents(1000);

    console.log("Seeding classes...");
    await seedClasses(30);

    console.log("Seeding schedules...");
    await seedSchedules();

    console.log("Seeding enrollments...");
    await seedEnrollments(500);

    console.log("All data seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  }
}

seedAll();
