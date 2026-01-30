import { IUserBase } from "../../../interfaces/user";

export type JoinClassMemberDTO = Pick<
  IUserBase,
  "id" | "email" | "username"
> & {
  avatar_url: string;
};

export type JoinClassResponse = {
  id: string;
  members: JoinClassMemberDTO[];
};
