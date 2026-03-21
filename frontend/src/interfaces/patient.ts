
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;

export type PatientStatus = "active" | "inactive";

export interface Address {
  id: number;
  street: string;
  unit_number: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Contact {
  id: number;
  email: string;
  phone_number: string;
}

export interface Patient {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  dob: string;
  blood_type: BloodType | null;
  status: PatientStatus;
  age: number;
  last_visit: string | null;
  created_at: string;
  address: Address;
  contact: Contact;
}