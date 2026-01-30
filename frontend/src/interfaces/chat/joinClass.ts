import type { User } from "@/interfaces/user";

export type JoinClassMemberDTO = Partial<
  Pick<User, "id" | "email" | "username" | "avatar_url">
>;

export type JoinClassResponse = {
  id: string;
  members: JoinClassMemberDTO[];
};
