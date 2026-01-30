import { z } from "zod";
import {
  Roles,
  Role,
  TeacherStatuses,
  JapaneseLevels,
} from "../../../interfaces/user";
import { paginationQuerySchema, Pagination } from "../../../utils/zod";
import { IUserBase } from "../../../interfaces/user";

const roleEnum = z.enum(Object.keys(Roles) as [Role, ...Role[]]);

export const SearchUsersSchema = paginationQuerySchema
  .extend({
    sortBy: z.enum(["username", "email", "createdAt"]).default("createdAt"),
    role: roleEnum.optional(),
    status: z.enum(TeacherStatuses).optional(),
    japaneseLevel: z.enum(JapaneseLevels).optional(),
  })
  .strict();

export type SearchUsersInput = z.infer<typeof SearchUsersSchema>;

export interface SearchUsersResponse {
  users: IUserBase[];
  pagination: Pagination;
}
