import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientFormData } from "@/interfaces/patientForm";
import { createPatient, updatePatient, createPatientNote, deletePatientNote, deletePatientById } from "@/services/patientService";
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

export function useAddPatientNote(patientId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (text: string) => createPatientNote(patientId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-notes", patientId] });
      queryClient.invalidateQueries({ queryKey: ["patient-summary", patientId] });
    },
  });

  return {
    ...mutation,
    errorMessage: getErrorMessage(mutation.error, "Could not save note. Please try again."),
  };
}

export function useDeletePatientNote(patientId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (noteId: number) => deletePatientNote(patientId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-notes", patientId] });
      queryClient.invalidateQueries({ queryKey: ["patient-summary", patientId] });
    },
  });

  return {
    ...mutation,
    errorMessage: getErrorMessage(mutation.error, "Could not delete note. Please try again."),
  };
}

export function useDeletePatient() {
  const mutation = useMutation({
    mutationFn: (patientId: string) => deletePatientById(patientId),
  });

  return {
    ...mutation,
    errorMessage: getErrorMessage(mutation.error, "Could not delete patient. Please try again."),
  };
}
