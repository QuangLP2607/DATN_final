import { useQuery } from "@tanstack/react-query";
import userApi from "@/services/userService";
import type { ListParams } from "@/interfaces/common";
import type { PaginatedResponse } from "@/interfaces/common";
import type { User } from "@/interfaces/user";

export function useTeachersQuery(params: ListParams) {
  return useQuery<PaginatedResponse<"users", User>>({
    queryKey: ["teachers", params],
    queryFn: () =>
      userApi.search({
        ...params,
        role: "TEACHER",
      }),
    placeholderData: (prev) => prev,
  });
}
