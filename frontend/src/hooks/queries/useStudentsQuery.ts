import { useQuery } from "@tanstack/react-query";
import userApi from "@/services/userService";
import type { ListParams } from "@/interfaces/common";
import type { PaginatedResponse } from "@/interfaces/common";
import type { User } from "@/interfaces/user";

export function useStudentsQuery(params: ListParams) {
  return useQuery<PaginatedResponse<"users", User>>({
    queryKey: ["students", params],
    queryFn: () =>
      userApi.search({
        ...params,
        role: "STUDENT",
      }),
    placeholderData: (prev) => prev,
  });
}
