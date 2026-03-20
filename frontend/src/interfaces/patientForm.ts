// src/interfaces/patientForm.ts
export interface PatientFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  blood_type: string;
  contact: { email: string; phone_number: string };
  address: { street: string; unit_number: string; city: string; state: string; zip_code: string; country: string };
  allergies: { allergy_name: string }[];
  conditions: { condition_name: string }[];
}