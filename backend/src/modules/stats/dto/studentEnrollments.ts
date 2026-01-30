export type StudentEnrollmentMonth = {
  month: number;
  total: number;
};

export type StudentEnrollmentYear = {
  year: number;
  months: StudentEnrollmentMonth[];
};

export type StudentEnrollmentResponse = {
  stats: StudentEnrollmentYear[];
};
