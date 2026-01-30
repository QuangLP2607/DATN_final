export type JoinClassMemberDTO = {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
};

export type JoinClassResponse = {
  id: string;
  members: JoinClassMemberDTO[];
};
