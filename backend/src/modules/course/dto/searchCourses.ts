import { z } from "zod";
import { paginationQuerySchema, Pagination } from "../../../utils/zod";
import { ICourse } from "../../../interfaces/course";

export const SearchCoursesSchema = paginationQuerySchema
  .extend({
    sortBy: z.enum(["name", "code", "createdAt"]).default("name"),
  })
  .strict();

export type SearchCoursesInput = z.infer<typeof SearchCoursesSchema>;

export interface CourseWithStats extends ICourse {
  total_classes?: number;
  active_classes?: number;
}

export interface SearchCoursesResponse {
  courses: CourseWithStats[];
  pagination: Pagination;
}
