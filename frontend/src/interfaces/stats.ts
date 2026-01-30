export interface StudentsByMonth {
  year: number;
  month: number;
  total: number;
}

export interface CourseStudents {
  course_id: string;
  course_name: string;
  total_students: number;
}
