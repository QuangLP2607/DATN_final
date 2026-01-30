import { IStudent } from "../../../interfaces/user";
import { IEnrollment } from "../../../interfaces/enrollment";

export interface EnrollmentWithStudent
  extends Pick<IEnrollment, "id" | "enrolled_at"> {
  student: Pick<IStudent, "id" | "username" | "full_name" | "email" | "phone">;
}

export type GetByClassResponse = EnrollmentWithStudent[];
