import { useQuery } from "@tanstack/react-query";
import { getPatientStats } from "@/services/patientService";
import { getErrorMessage } from "@/services/apiClient";

export function usePatientStats() {
  const query = useQuery({
    queryKey: ["patient-stats"],
    queryFn: getPatientStats,
    initialData: { total: 0, active: 0, inactive: 0 },
  });

  return {
    ...query,
    errorMessage: getErrorMessage(query.error, "Failed to fetch stats"),
  };
}
