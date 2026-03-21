import { useInfiniteQuery } from "@tanstack/react-query";
import { getPatientsPage } from "@/services/patientService";
import { getErrorMessage } from "@/services/apiClient";
import type { PatientStatus } from "@/interfaces/patient";

export function usePatientsList({
  search,
  status,
  sortOrder,
}: {
  search: string;
  status: "all" | PatientStatus;
  sortOrder: "asc" | "desc";
}) {
  const query = useInfiniteQuery({
    queryKey: ["patients", search, status, sortOrder],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getPatientsPage({
        offset: pageParam,
        search,
        status,
        sortOrder,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor ?? undefined : undefined,
    staleTime: 30 * 1000,
  });

  const patients = query.data?.pages.flatMap((page) => page.items) ?? [];
  const errorMessage = getErrorMessage(query.error, "Failed to load patients");

  return {
    ...query,
    patients,
    errorMessage,
  };
}
