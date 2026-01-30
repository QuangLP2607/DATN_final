import { z } from "zod";
import {
  paginationQuerySchema,
  Pagination,
  isoDateSchema,
} from "../../../utils/zod";
import { ClassStatuses } from "../../../interfaces/class";
import { IClass } from "../../../interfaces/class";
import { ITeacher } from "../../../interfaces/user";
import { ICourse } from "../../../interfaces/course";

export const SearchClassesSchema = paginationQuerySchema
  .extend({
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
    status: z.enum(ClassStatuses).optional(),
  })
  .strict();

export type SearchClassesInput = z.infer<typeof SearchClassesSchema>;

export type ClassDetail = IClass & {
  teachers?: Pick<ITeacher, "id" | "username">[];
  course?: Pick<ICourse, "id" | "name" | "code">;
};

export interface SearchClassesResponse {
  classes: ClassDetail[];
  pagination: Pagination;
}
