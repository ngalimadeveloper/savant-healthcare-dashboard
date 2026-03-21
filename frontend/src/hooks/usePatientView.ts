import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getPatientById,
  getPatientSummary,
  getPatientNotesPage,
} from "@/services/patientService";
import { getErrorMessage } from "@/services/apiClient";

const NOTES_PAGE_LIMIT = 20;

export function usePatient(patientId?: string) {
  const query = useQuery({
    queryKey: ["patient", patientId],
    enabled: Boolean(patientId),
    queryFn: () => getPatientById(patientId!),
  });

  return {
    ...query,
    errorMessage: getErrorMessage(query.error, "Failed to fetch patient"),
  };
}

export function usePatientSummary(patientId?: string) {
  const query = useQuery({
    queryKey: ["patient-summary", patientId],
    enabled: Boolean(patientId),
    queryFn: () => getPatientSummary(patientId!),
  });

  return {
    ...query,
    errorMessage: getErrorMessage(query.error, "Failed to fetch patient summary"),
  };
}

export function usePatientNotes(patientId?: string) {
  const query = useInfiniteQuery({
    queryKey: ["patient-notes", patientId],
    enabled: Boolean(patientId),
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) =>
      getPatientNotesPage({
        patientId: patientId!,
        cursor: pageParam,
        limit: NOTES_PAGE_LIMIT,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor ?? undefined : undefined,
  });

  const notes = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    notes,
    errorMessage: getErrorMessage(query.error, "Failed to fetch notes"),
  };
}
