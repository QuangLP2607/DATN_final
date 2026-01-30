import { useQuery } from "@tanstack/react-query";
import lectureVideoApi, {
  type LectureWithUrls,
} from "@/services/lectureService";
import type { PaginatedResponse, ListParams } from "@/interfaces/common";

export interface UseLecturesParams extends ListParams {
  classId: string;
}

export function useLecturesQuery(params: UseLecturesParams) {
  const { classId, ...listParams } = params;

  return useQuery<PaginatedResponse<"lectures", LectureWithUrls>>({
    queryKey: ["lectures", classId, listParams],
    queryFn: () => lectureVideoApi.getByClass(classId, listParams),
    placeholderData: (prev) =>
      prev as PaginatedResponse<"lectures", LectureWithUrls> | undefined,
  });
}
