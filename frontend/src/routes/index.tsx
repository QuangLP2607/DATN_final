import type { ReactElement, ReactNode } from "react";
import { StudentLayout } from "@/Layout";
import { TeacherLayout } from "@/Layout";
import { AdminLayout } from "@/Layout";

// public pages
import Login from "@/pages/Login";

// admin pages

import AdminHome from "@/pages/admin/Home";
import AdminSchedule from "@/pages/admin/Schedule";
import AdminCourses from "@/pages/admin/Courses/List";
import AdminCourseDetail from "@/pages/admin/Courses/Detail";
import AdminClasses from "@/pages/admin/Classes/List";
import AdminStudents from "@/pages/admin/Students/List";
import AdminStudentDetail from "@/pages/admin/Students/Detail";
import AdminTeachers from "@/pages/admin/Teachers/List";
import AdminTeacherDetail from "@/pages/admin/Teachers/Detail";

// // student pages
import StudentChat from "@/pages/student/Chat";
import StudentExercises from "@/pages/student/Exercises/List";
import StudentExerciseDetail from "@/pages/student/Exercises/Detail";
import StudentExerciseResult from "@/pages/student/Exercises/Result";
import StudentHome from "@/pages/student/Home";
import StudentLive from "@/pages/student/ClassLive";
import StudentLectures from "@/pages/student/Lectures/List";
import StudentLectureDetail from "@/pages/student/Lectures/Detail";
import StudentProfile from "@/pages/student/Profile";

// // teacher pages
import TeacherHome from "@/pages/teacher/Home";
import TeacherSchedule from "@/pages/teacher/Schedule";
import TeacherClass from "@/pages/teacher/Class";
import TeacherClassLive from "@/pages/teacher/ClassLive";
import TeacherClassLectures from "@/pages/teacher/Lectures/List";
import TeacherClassLectureDetail from "@/pages/teacher/Lectures/Detail";
import TeacherExercises from "@/pages/teacher/Exercises/List";
import TeacherExerciseDetail from "@/pages/teacher/Exercises/Detail";
import TeacherChat from "@/pages/teacher/Chat";
import TeacherProfile from "@/pages/teacher/Profile";

import type { Role } from "@/interfaces/user";

export interface RouteType {
  path: string;
  component: () => ReactElement;
  layout?: ((props: { children: ReactNode }) => ReactElement) | null;
  layoutProps?: {
    showHeader?: boolean;
    showSidebar?: boolean;
    showFooter?: boolean;
  };
  role?: Role;
}

/* ------------------------------
   Helpers to build role routes
------------------------------- */
const withStudent = (
  path: string,
  component: () => ReactElement,
): RouteType => ({
  path: `/${path}`,
  component,
  role: "STUDENT",
  layout: StudentLayout,
  layoutProps: { showSidebar: true },
});

const withTeacher = (
  path: string,
  component: () => ReactElement,
): RouteType => ({
  path: `/teaching${path}`,
  component,
  role: "TEACHER",
  layout: TeacherLayout,
});

const withAdmin = (path: string, component: () => ReactElement): RouteType => ({
  path: `/dashboard${path}`,
  component,
  role: "ADMIN",
  layout: AdminLayout,
});

/* ------------------------------
   Public routes
------------------------------- */
const publicRoutes: RouteType[] = [
  { path: "/login", component: Login, layout: null },
];

/* ------------------------------
   Private routes by role
------------------------------- */
const studentRoutes: RouteType[] = [
  withStudent("/home", StudentHome),
  withStudent("/lectures", StudentLectures),
  { ...withStudent("/lectures/:id", StudentLectureDetail) },
  withStudent("/exercises", StudentExercises),
  { ...withStudent("/exercises/:id", StudentExerciseDetail) },
  { ...withStudent("/attempt/:id", StudentExerciseResult) },
  withStudent("/chat", StudentChat),
  withStudent("/profile", StudentProfile),
  { ...withStudent("/live/:id", StudentLive) },
];

const teacherRoutes: RouteType[] = [
  // // ===== GENERAL =====
  withTeacher("/home", TeacherHome),
  withTeacher("/schedule", TeacherSchedule),
  withTeacher("/class", TeacherClass),
  withTeacher("/class/live", TeacherClassLive),
  withTeacher("/class/lectures", TeacherClassLectures),
  { ...withTeacher("/class/lectures/:id", TeacherClassLectureDetail) },
  withTeacher("/class/exercises", TeacherExercises),
  { ...withTeacher("/class/exercises/:id", TeacherExerciseDetail) },

  withTeacher("/profile", TeacherProfile),
  withTeacher("/class/chat", TeacherChat),
];

const adminRoutes: RouteType[] = [
  withAdmin("/home", AdminHome),
  withAdmin("/schedule", AdminSchedule),
  withAdmin("/course", AdminCourses),
  { ...withAdmin("/course/:id", AdminCourseDetail) },
  withAdmin("/class", AdminClasses),
  withAdmin("/teacher", AdminTeachers),
  {
    ...withAdmin("/teacher/:id", AdminTeacherDetail),
  },
  withAdmin("/student", AdminStudents),
  {
    ...withAdmin("/student/:id", AdminStudentDetail),
  },
];

/* ------------------------------
   Combined private routes
------------------------------- */

const privateRoutes = [...studentRoutes, ...teacherRoutes, ...adminRoutes];

export { privateRoutes, publicRoutes };
