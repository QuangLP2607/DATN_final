import { useQuery } from "@tanstack/react-query";
import scheduleApi from "@/services/scheduleService";

export function useSchedulesQuery(
  from: string,
  to: string,
  classIds?: string[]
) {
  return useQuery({
    queryKey: ["schedules", { classIds, from, to }],
    queryFn: () =>
      scheduleApi.search({
        ...(classIds && { class_id: classIds }),
        from,
        to,
      }),
    enabled: !!from && !!to,
  });
}
