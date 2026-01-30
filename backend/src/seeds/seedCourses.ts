import { CourseModel } from "../models/Course";

export default async function seedCourses() {
  const courses = [
    {
      code: "N5",
      name: "Gungun N5",
      description: "Khóa học tiếng Nhật sơ cấp N5",
      status: "active",
    },
    {
      code: "N4",
      name: "Gungun N4",
      description: "Khóa học tiếng Nhật sơ cấp N4",
      status: "active",
    },
    {
      code: "N3",
      name: "Gungun N3",
      description: "Khóa học tiếng Nhật trung cấp N3",
      status: "active",
    },
    {
      code: "N2",
      name: "Gungun N2",
      description: "Khóa học tiếng Nhật trung cấp N2",
      status: "active",
    },
    {
      code: "N1",
      name: "Gungun N1",
      description: "Khóa học tiếng Nhật cao cấp N1",
      status: "active",
    },
    {
      code: "SP",
      name: "Chuyên ngành",
      description: "Khóa học tiếng Nhật chuyên ngành",
      status: "active",
    },
    {
      code: "GC",
      name: "Giao tiếp",
      description: "Khóa học tiếng Nhật giao tiếp",
      status: "active",
    },
  ];

  await CourseModel.insertMany(courses);
  console.log(`${courses.length} courses inserted`);
}
