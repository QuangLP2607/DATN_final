import { useQuery } from "@tanstack/react-query";
import classApi from "@/services/classService";
import type { SearchClassesParams, ClassDetail } from "@/services/classService";
import type { PaginatedResponse } from "@/interfaces/common";

export function useClassesQuery(params: SearchClassesParams) {
  return useQuery<PaginatedResponse<"classes", ClassDetail[]>>({
    queryKey: ["classes", params],
    queryFn: () => classApi.search(params),
    placeholderData: {
      pagination: {
        total: 0,
        page: 1,
        limit: params.limit ?? 10,
        totalPages: 0,
      },
      classes: [],
    },
  });
}
