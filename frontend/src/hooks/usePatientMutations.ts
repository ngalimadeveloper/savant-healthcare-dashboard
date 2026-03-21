import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientFormData } from "@/interfaces/patientForm";
import { createPatient, updatePatient } from "@/services/patientService";
import { getErrorMessage } from "@/services/apiClient";

export function useCreatePatient() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: PatientFormData) => createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient-stats"] });
    },
  });

  return {
    ...mutation,
    errorMessage: getErrorMessage(mutation.error, "Something went wrong. Please try again."),
  };
}

export function useUpdatePatient(patientId: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: PatientFormData) => updatePatient(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", String(patientId)] });
      queryClient.invalidateQueries({ queryKey: ["patient-summary", String(patientId)] });
      queryClient.invalidateQueries({ queryKey: ["patient-stats"] });
    },
  });

  return {
    ...mutation,
    errorMessage: getErrorMessage(mutation.error, "Something went wrong. Please try again."),
  };
}
