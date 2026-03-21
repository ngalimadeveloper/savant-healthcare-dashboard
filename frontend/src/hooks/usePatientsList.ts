import { useInfiniteQuery } from "@tanstack/react-query";
import { getPatientsPage } from "@/services/patientService";
import { getErrorMessage } from "@/services/apiClient";
import type { PatientStatus } from "@/interfaces/patient";

export function usePatientsList({
  search,
  status,
}: {
  search: string;
  status: "all" | PatientStatus;
}) {
  const query = useInfiniteQuery({
    queryKey: ["patients", search, status],
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) =>
      getPatientsPage({
        cursor: pageParam,
        search,
        status,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor ?? undefined : undefined,
  });

  const patients = query.data?.pages.flatMap((page) => page.items) ?? [];
  const errorMessage = getErrorMessage(query.error, "Failed to load patients");

  return {
    ...query,
    patients,
    errorMessage,
  };
}
