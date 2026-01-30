export type Role = "ADMIN" | "STUDENT" | "TEACHER";

export type JapaneseLevel = "Không" | "N5" | "N4" | "N3" | "N2" | "N1";
export const JapaneseLevels: JapaneseLevel[] = [
  "Không",
  "N5",
  "N4",
  "N3",
  "N2",
  "N1",
];

export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  email: string;
  role: Role;
  username?: string;
  full_name?: string;
  avatar_id?: string;
  avatar_url?: string;
  dob?: string;
  phone?: string;
  address?: string;
  japaneseLevel?: JapaneseLevel;
  status?: UserStatus;
  note?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}
