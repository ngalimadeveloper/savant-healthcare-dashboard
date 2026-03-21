import type { Patient, PatientStatus } from "@/interfaces/patient";
import type { PatientNote } from "@/interfaces/patientNote";
import type { PatientSummary } from "@/interfaces/patientSummary";
import type { PatientFormData } from "@/interfaces/patientForm";
import { fetchJson, fetchVoid } from "@/services/apiClient";

export type PatientsListResponse = {
  items: Patient[];
  next_cursor: number | null;
  has_more: boolean;
};

export type GetPatientsPageParams = {
  cursor: number | null;
  search: string;
  status: "all" | PatientStatus;
};

export type PatientNotesListResponse = {
  items: PatientNote[];
  next_cursor: number | null;
  has_more: boolean;
};

export type PatientStats = {
  total: number;
  active: number;
  inactive: number;
};

const API_BASE_URL = "http://localhost:8000/api/v1";

export async function getPatientsPage({
  cursor,
  search,
  status,
}: GetPatientsPageParams): Promise<PatientsListResponse> {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (cursor) {
    params.set("cursor", String(cursor));
  }

  return fetchJson<PatientsListResponse>(
    `${API_BASE_URL}/patients?${params.toString()}`,
    undefined,
    "Failed to fetch patients",
  );
}

export async function getPatientById(patientId: string): Promise<Patient> {
  return fetchJson<Patient>(
    `${API_BASE_URL}/patients/${patientId}`,
    undefined,
    "Failed to fetch patient",
  );
}

export async function getPatientSummary(patientId: string): Promise<PatientSummary> {
  return fetchJson<PatientSummary>(
    `${API_BASE_URL}/patients/${patientId}/summary`,
    undefined,
    "Failed to fetch patient summary",
  );
}

export async function getPatientNotesPage({
  patientId,
  cursor,
  limit,
}: {
  patientId: string;
  cursor: number | null;
  limit: number;
}): Promise<PatientNotesListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  if (cursor) {
    params.set("cursor", String(cursor));
  }

  return fetchJson<PatientNotesListResponse>(
    `${API_BASE_URL}/patients/${patientId}/notes?${params.toString()}`,
    undefined,
    "Failed to fetch notes",
  );
}

export async function createPatientNote(patientId: string, text: string): Promise<PatientNote> {
  return fetchJson<PatientNote>(
    `${API_BASE_URL}/patients/${patientId}/notes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    },
    "Could not save note. Please try again.",
  );
}

export async function deletePatientNote(patientId: string, noteId: number): Promise<void> {
  return fetchVoid(
    `${API_BASE_URL}/patients/${patientId}/notes/${noteId}`,
    {
      method: "DELETE",
    },
    "Failed to delete note",
  );
}

export async function deletePatientById(patientId: string): Promise<void> {
  return fetchVoid(
    `${API_BASE_URL}/patients/${patientId}`,
    {
      method: "DELETE",
    },
    "Failed to delete patient",
  );
}

export async function getPatientStats(): Promise<PatientStats> {
  return fetchJson<PatientStats>(
    `${API_BASE_URL}/patients/stats`,
    undefined,
    "Failed to fetch stats",
  );
}

export async function createPatient(payload: PatientFormData): Promise<Patient> {
  return fetchJson<Patient>(
    `${API_BASE_URL}/patients`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Something went wrong. Please try again.",
  );
}

export async function updatePatient(patientId: number, payload: PatientFormData): Promise<Patient> {
  return fetchJson<Patient>(
    `${API_BASE_URL}/patients/${patientId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Something went wrong. Please try again.",
  );
}
