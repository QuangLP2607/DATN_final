import { ClassModel } from "../../models/Class";
import { CourseModel } from "../../models/Course";
import { StudentModel } from "../../models/User";
import { TeacherModel } from "../../models/User";
import { EnrollmentModel } from "../../models/Enrollment";
import type {
  OverviewResponse,
  CourseStat,
  StudentLevelStat,
  TeacherStatusStat,
  ClassStatusStat,
} from "./dto/getOverview";
import { JapaneseLevels } from "../../interfaces/user";
import { TeacherStatuses } from "../../interfaces/user";
// import {
//   StudentsPerLevelResponse,
//   StudentLevelStat,
// } from "./dto/studentsPerLevel";
import {
  StudentEnrollmentResponse,
  type StudentEnrollmentMonth,
  type StudentEnrollmentYear,
} from "./dto/studentEnrollments";

export default {
  // -------------------- get overview --------------------
  getOverview: async (): Promise<OverviewResponse> => {
    // -------------------- Courses --------------------
    const coursesRaw = await CourseModel.find({ status: "active" }).lean();

    const coursesDetails: CourseStat[] = await Promise.all(
      coursesRaw.map(async (course) => {
        const classes = await ClassModel.find({ course_id: course._id }).lean();
        const classCount = classes.length;

        const studentIdsSet = new Set<string>();
        await Promise.all(
          classes.map(async (cls) => {
            const enrollments = await EnrollmentModel.find({
              class_id: cls._id,
            })
              .select("student_id")
              .lean();
            enrollments.forEach((e) =>
              studentIdsSet.add(e.student_id.toString())
            );
          })
        );

        return {
          name: course.name,
          student_count: studentIdsSet.size,
          class_count: classCount,
        };
      })
    );

    const totalCourses = coursesRaw.length;

    // -------------------- Students --------------------
    const studentsRaw = await StudentModel.find().lean();
    const totalStudents = studentsRaw.length;

    const studentsByLevel: StudentLevelStat[] = JapaneseLevels.map((level) => ({
      level,
      total: studentsRaw.filter((s) => s.japaneseLevel === level).length,
    }));

    // -------------------- Teachers --------------------
    const teachersRaw = await TeacherModel.find().lean();
    const totalTeachers = teachersRaw.length;

    const teachersByStatus: TeacherStatusStat[] = TeacherStatuses.map(
      (status) => ({
        status,
        total: teachersRaw.filter((t) => t.status === status).length,
      })
    );

    // -------------------- Classes --------------------
    const classesRaw = await ClassModel.find().lean();
    const totalClasses = classesRaw.length;

    const classesByStatus: ClassStatusStat[] = [
      "upcoming",
      "active",
      "finished",
    ].map((status) => ({
      status,
      total: classesRaw.filter((c) => c.status === status).length,
    }));

    // -------------------- Return --------------------
    return {
      courses: {
        total: totalCourses,
        details: coursesDetails,
      },
      students: {
        total: totalStudents,
        details: studentsByLevel,
      },
      teachers: {
        total: totalTeachers,
        details: teachersByStatus,
      },
      classes: {
        total: totalClasses,
        details: classesByStatus,
      },
    };
  },

  // -------------------- get student enrollments by year/month --------------------
  getStudentEnrollments: async (): Promise<StudentEnrollmentResponse> => {
    const aggregation: {
      _id: { year: number; month: number };
      total: number;
    }[] = await EnrollmentModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$enrolled_at" },
            month: { $month: "$enrolled_at" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": 1 } },
    ]);

    const yearMap = new Map<number, StudentEnrollmentMonth[]>();

    aggregation.forEach((e) => {
      const year = e._id.year;
      const monthData: StudentEnrollmentMonth = {
        month: e._id.month,
        total: e.total,
      };
      if (!yearMap.has(year)) yearMap.set(year, []);
      yearMap.get(year)!.push(monthData);
    });

    const stats: StudentEnrollmentYear[] = Array.from(yearMap.entries()).map(
      ([year, months]) => ({
        year,
        months,
      })
    );

    stats.sort((a, b) => b.year - a.year);

    return { stats };
  },
};
