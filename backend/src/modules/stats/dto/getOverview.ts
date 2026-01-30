export type CourseStat = {
  name: string;
  student_count: number;
  class_count: number;
};

export type StudentLevelStat = {
  level: string;
  total: number;
};

export type TeacherStatusStat = {
  status: string;
  total: number;
};

export type ClassStatusStat = {
  status: string;
  total: number;
};

export type OverviewResponse = {
  courses: {
    total: number;
    details: CourseStat[];
  };
  students: {
    total: number;
    details: StudentLevelStat[];
  };
  teachers: {
    total: number;
    details: TeacherStatusStat[];
  };
  classes: {
    total: number;
    details: ClassStatusStat[];
  };
};
