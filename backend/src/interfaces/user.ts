export const Roles = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
} as const;

export type Role = keyof typeof Roles;

export const TeacherStatuses = ["active", "inactive", "pending"] as const;
export type TeacherStatus = (typeof TeacherStatuses)[number];

export const JapaneseLevels = ["Không", "N5", "N4", "N3", "N2", "N1"] as const;
export type JapaneseLevel = (typeof JapaneseLevels)[number];

export interface IUserBase {
  id?: string;
  username?: string;
  email: string;
  password?: string;
  avatar_id?: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdmin extends IUserBase {}

export interface IStudent extends IUserBase {
  full_name?: string;
  dob?: Date;
  phone?: string;
  address?: string;
  japaneseLevel?: JapaneseLevel;
  note?: string;
  lastLogin?: Date;
}

export interface ITeacher extends IUserBase {
  full_name?: string;
  dob?: Date;
  phone?: string;
  address?: string;
  status?: TeacherStatus;
  note?: string;
}

export interface AuthUser<R extends Role = Role> {
  id: string;
  role: R;
}
